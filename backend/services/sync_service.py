import logging
from datetime import datetime, timezone
from typing import Dict, Any

from sqlalchemy.orm import Session

from ..models import Vehicle

logger = logging.getLogger(__name__)


class VehicleSyncService:
    def __init__(self, session_factory, scraper=None):
        self.session_factory = session_factory
        self.scraper = scraper

    def sync(self) -> Dict[str, int]:
        if self.scraper is None:
            raise ValueError("A scraper instance is required")

        scraped_vehicles = self.scraper.scrape()
        now = datetime.now(timezone.utc)
        created = 0
        updated = 0
        marked_unavailable = 0

        with self.session_factory() as session:
            seen_external_ids = set()
            for data in scraped_vehicles:
                external_id = data.get("external_id") or data.get("link") or data.get("nome")
                seen_external_ids.add(external_id)
                vehicle = self._find_existing_vehicle(session, data)
                if vehicle is None:
                    self._create_vehicle(session, data, now)
                    created += 1
                else:
                    self._update_vehicle(vehicle, data, now)
                    updated += 1

            marked_unavailable = self._mark_missing_as_unavailable(session, seen_external_ids, now)
            session.commit()

        return {
            "created": created,
            "updated": updated,
            "marked_unavailable": marked_unavailable,
        }

    def _find_existing_vehicle(self, session: Session, data: Dict[str, Any]):
        external_id = data.get("external_id") or data.get("link") or None
        if external_id:
            existing = session.query(Vehicle).filter(Vehicle.external_id == external_id).first()
            if existing:
                return existing

        vehicle_id = self._build_vehicle_id(data)
        if vehicle_id:
            existing = session.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
            if existing:
                return existing

        return None

    def _create_vehicle(self, session: Session, data: Dict[str, Any], now: datetime):
        vehicle = Vehicle(
            id=self._build_vehicle_id(data),
            external_id=data.get("external_id") or data.get("link") or data.get("nome"),
            source=data.get("source"),
            nome=data.get("nome"),
            marca=data.get("marca"),
            versao=data.get("versao"),
            ano=data.get("ano"),
            km=data.get("km"),
            preco=data.get("preco"),
            combustivel=data.get("combustivel"),
            cambio=data.get("cambio"),
            cor=data.get("cor"),
            imagens=self._serialize_list(data.get("imagens")),
            descricao=data.get("descricao"),
            opcionais=self._serialize_list(data.get("opcionais")),
            link=data.get("link"),
            destaque=data.get("destaque", False),
            is_available=True,
            last_seen_at=now,
            created_at=now,
            updated_at=now,
        )
        session.add(vehicle)

    def _update_vehicle(self, vehicle: Vehicle, data: Dict[str, Any], now: datetime):
        vehicle.external_id = data.get("external_id") or data.get("link") or data.get("nome")
        vehicle.source = data.get("source")
        vehicle.nome = data.get("nome")
        vehicle.marca = data.get("marca")
        vehicle.versao = data.get("versao")
        vehicle.ano = data.get("ano")
        vehicle.km = data.get("km")
        vehicle.preco = data.get("preco")
        vehicle.combustivel = data.get("combustivel")
        vehicle.cambio = data.get("cambio")
        vehicle.cor = data.get("cor")
        vehicle.imagens = self._serialize_list(data.get("imagens"))
        vehicle.descricao = data.get("descricao")
        vehicle.opcionais = self._serialize_list(data.get("opcionais"))
        vehicle.link = data.get("link")
        vehicle.destaque = data.get("destaque", False)
        vehicle.is_available = True
        vehicle.last_seen_at = now
        vehicle.updated_at = now

    def _mark_missing_as_unavailable(self, session: Session, seen_external_ids: set, now: datetime) -> int:
        vehicles = session.query(Vehicle).filter(Vehicle.is_available.is_(True)).all()
        marked = 0
        for vehicle in vehicles:
            if vehicle.external_id not in seen_external_ids:
                vehicle.is_available = False
                vehicle.updated_at = now
                marked += 1
        return marked

    @staticmethod
    def _build_vehicle_id(data: Dict[str, Any]) -> str:
        base = data.get("external_id") or data.get("link") or data.get("nome")
        return str(base).replace("/", "-").replace("?", "-")

    @staticmethod
    def _serialize_list(value):
        if value is None:
            return None
        if isinstance(value, str):
            return value
        return str(value)
