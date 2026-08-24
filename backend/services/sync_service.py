import json
import logging
from datetime import datetime, timezone
from typing import Dict

from backend.models import Vehicle

logger = logging.getLogger(__name__)


class VehicleSyncService:
    MAX_DROP_PERCENTAGE = 50

    def __init__(self, session_factory, scraper=None):
        self.session_factory = session_factory
        self.scraper = scraper

    def sync(self) -> Dict[str, int]:
        if self.scraper is None:
            raise ValueError("A scraper instance is required")

        try:
            scraped_vehicles = self.scraper.scrape()
        except Exception:
            logger.exception("Vehicle synchronization aborted because scraper failed")
            return {
                "aborted": True,
                "reason": "scraper_exception",
                "created": 0,
                "updated": 0,
                "marked_unavailable": 0,
            }

        if len(scraped_vehicles) == 0:
            logger.warning("Vehicle synchronization aborted: scraper returned zero vehicles")
            return {
                "aborted": True,
                "reason": "zero_results",
                "created": 0,
                "updated": 0,
                "marked_unavailable": 0,
            }

        with self.session_factory() as session:
            current_total = session.query(Vehicle).count()

            if current_total > 0:
                found_count = len(scraped_vehicles)
                drop_percentage = (1 - (found_count / current_total)) * 100
                if found_count <= 0 or drop_percentage >= self.MAX_DROP_PERCENTAGE:
                    logger.warning(
                        "Vehicle synchronization aborted: percentage drop %.2f%% (%d found, %d current)",
                        drop_percentage,
                        found_count,
                        current_total,
                    )
                    return {
                        "aborted": True,
                        "reason": "drop_too_large",
                        "created": 0,
                        "updated": 0,
                        "marked_unavailable": 0,
                    }

            now = datetime.now(timezone.utc)
            created = 0
            updated = 0
            marked_unavailable = 0
            seen_keys = set()

            for data in scraped_vehicles:
                source = data.get("source")
                external_id = data.get("external_id")
                if not source or not external_id:
                    continue

                seen_keys.add((source, external_id))

                vehicle = (
                    session.query(Vehicle)
                    .filter(Vehicle.source == source, Vehicle.external_id == external_id)
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
                seen_keys,
                now
            )

            session.commit()

        return {
            "aborted": False,
            "reason": None,
            "created": created,
            "updated": updated,
            "marked_unavailable": marked_unavailable,
        }

    def _create_vehicle(self, session, data, now):
        vehicle = Vehicle(
            external_id=data["external_id"],
            source=data["source"],
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
        vehicle.external_id = data["external_id"]
        vehicle.source = data["source"]
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

    def _mark_missing_as_unavailable(self, session, seen_keys, now):
        vehicles = (
            session.query(Vehicle)
            .filter(Vehicle.is_available.is_(True))
            .all()
        )

        marked = 0

        for vehicle in vehicles:
            if (vehicle.source, vehicle.external_id) not in seen_keys:
                vehicle.is_available = False
                vehicle.updated_at = now
                marked += 1

        return marked

    @staticmethod
    def _serialize_list(value):
        if value is None:
            return None

        return json.dumps(value)