import unittest
import uuid
from datetime import datetime, timezone

from backend.database import Base, get_session_factory
from backend.models import Vehicle
from backend.services.sync_service import VehicleSyncService


class SyncServiceTests(unittest.TestCase):
    def setUp(self):
        self.session_factory, self.engine = get_session_factory("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)

    def _create_vehicle(self, *, source="demo", external_id=None, available=True):
        if external_id is None:
            external_id = f"car-{uuid.uuid4().hex[:8]}"

        vehicle = Vehicle(
            external_id=external_id,
            source=source,
            url=f"https://example.com/{external_id}",
            nome="Gol",
            marca="Volkswagen",
            preco=45000,
            ano_modelo="2020",
            observacoes="ok",
            imagens='["car.jpg"]',
            is_available=available,
            last_seen_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        with self.session_factory() as session:
            session.add(vehicle)
            session.commit()

    def test_sync_aborts_when_scraper_returns_zero_vehicles(self):
        self._create_vehicle(external_id="car-1")

        class FakeScraper:
            def scrape(self):
                return []

        service = VehicleSyncService(session_factory=self.session_factory, scraper=FakeScraper())
        result = service.sync()

        self.assertTrue(result["aborted"])
        self.assertEqual(result["reason"], "zero_results")

        with self.session_factory() as session:
            vehicle = session.query(Vehicle).filter(Vehicle.external_id == "car-1").one()
            self.assertTrue(vehicle.is_available)

    def test_sync_aborts_when_scraper_drop_is_too_large(self):
        for idx in range(40):
            self._create_vehicle(external_id=f"car-{idx}")

        class FakeScraper:
            def scrape(self):
                return [
                    {
                        "external_id": f"car-{idx}",
                        "source": "demo",
                        "url": f"https://example.com/car-{idx}",
                        "nome": "Gol",
                        "marca": "Volkswagen",
                        "preco": 45000,
                        "ano_modelo": "2020",
                        "observacoes": "ok",
                        "imagens": ["car.jpg"],
                    }
                    for idx in range(20)
                ]

        service = VehicleSyncService(session_factory=self.session_factory, scraper=FakeScraper())
        result = service.sync()

        self.assertTrue(result["aborted"])
        self.assertEqual(result["reason"], "drop_too_large")

        with self.session_factory() as session:
            active_count = session.query(Vehicle).filter(Vehicle.is_available.is_(True)).count()
            self.assertEqual(active_count, 40)

    def test_sync_works_normally_when_scraper_is_valid(self):
        self._create_vehicle(external_id="car-1")

        class FakeScraper:
            def scrape(self):
                return [
                    {
                        "external_id": "car-1",
                        "source": "demo",
                        "url": "https://example.com/car-1",
                        "nome": "Gol Atualizado",
                        "marca": "Volkswagen",
                        "preco": 50000,
                        "ano_modelo": "2021",
                        "observacoes": "atualizado",
                        "imagens": ["car-updated.jpg"],
                    },
                    {
                        "external_id": "car-2",
                        "source": "demo",
                        "url": "https://example.com/car-2",
                        "nome": "Civic",
                        "marca": "Honda",
                        "preco": 70000,
                        "ano_modelo": "2022",
                        "observacoes": "novo",
                        "imagens": ["civic.jpg"],
                    },
                ]

        service = VehicleSyncService(session_factory=self.session_factory, scraper=FakeScraper())
        result = service.sync()

        self.assertFalse(result["aborted"])
        self.assertEqual(result["created"], 1)
        self.assertEqual(result["updated"], 1)
        self.assertEqual(result["marked_unavailable"], 0)

        with self.session_factory() as session:
            vehicle = session.query(Vehicle).filter(Vehicle.external_id == "car-1").one()
            self.assertEqual(vehicle.nome, "Gol Atualizado")
            self.assertTrue(vehicle.is_available)

    def test_sync_aborts_when_scraper_raises_exception(self):
        self._create_vehicle(external_id="car-1")

        class FakeScraper:
            def scrape(self):
                raise RuntimeError("scraper failed")

        service = VehicleSyncService(session_factory=self.session_factory, scraper=FakeScraper())
        result = service.sync()

        self.assertTrue(result["aborted"])
        self.assertEqual(result["reason"], "scraper_exception")

        with self.session_factory() as session:
            vehicle = session.query(Vehicle).filter(Vehicle.external_id == "car-1").one()
            self.assertTrue(vehicle.is_available)


if __name__ == "__main__":
    unittest.main()
