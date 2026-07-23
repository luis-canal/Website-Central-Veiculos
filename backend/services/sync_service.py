import logging
import json
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
            seen_ids = set()

            for data in scraped_vehicles:
                seen_ids.add(data["id"])

                vehicle = (
                    session.query(Vehicle)
                    .filter(Vehicle.id == data["id"])
                    .first()
                )

                if vehicle is None:
                    self._create_vehicle(session, data, now)
                    created += 1
                else:
                    self._update_vehicle(vehicle, data, now)
                    updated += 1

            marked_unavailable = self._mark_missing_as_unavailable(
                session,
                seen_ids,
                now
            )

            session.commit()

        return {
            "created": created,
            "updated": updated,
            "marked_unavailable": marked_unavailable,
        }


    def _create_vehicle(self, session, data, now):
        vehicle = Vehicle(
            id=data["id"],
            url=data["url"],
            nome=data["nome"],
            marca=data["marca"],
            preco=data["preco"],
            ano_modelo=data["ano_modelo"],
            observacoes=data["observacoes"],
            imagens=self._serialize_list(data["imagens"]),
            is_available=True,
            created_at=now,
            updated_at=now,
            last_seen_at=now,
        )

        session.add(vehicle)

    def _update_vehicle(self, vehicle, data, now):
        vehicle.url = data["url"]
        vehicle.nome = data["nome"]
        vehicle.marca = data["marca"]
        vehicle.preco = data["preco"]
        vehicle.ano_modelo = data["ano_modelo"]
        vehicle.observacoes = data["observacoes"]
        vehicle.imagens = self._serialize_list(data["imagens"])

        vehicle.is_available = True
        vehicle.last_seen_at = now
        vehicle.updated_at = now

    def _mark_missing_as_unavailable(self, session, seen_ids, now):
        vehicles = (
            session.query(Vehicle)
            .filter(Vehicle.is_available.is_(True))
            .all()
        )

        marked = 0

        for vehicle in vehicles:
            if vehicle.id not in seen_ids:
                vehicle.is_available = False
                vehicle.updated_at = now
                marked += 1

        return marked

    @staticmethod
    def _serialize_list(value):
        if value is None:
            return None

        return json.dumps(value)