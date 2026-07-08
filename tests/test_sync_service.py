import unittest
from datetime import datetime

from backend.database import Base, get_session_factory
from backend.models import Vehicle
from backend.services.sync_service import VehicleSyncService


class SyncServiceTests(unittest.TestCase):
    def setUp(self):
        self.session_factory, self.engine = get_session_factory("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)

    def test_sync_marks_previous_vehicle_as_unavailable(self):
        with self.session_factory() as session:
            session.add(
                Vehicle(
                    id="legacy-car",
                    marca="Volkswagen",
                    nome="Gol",
                    versao="1.0",
                    ano=2020,
                    km=50000,
                    preco=45000,
                    is_available=True,
                    last_seen_at=datetime.utcnow(),
                )
            )
            session.commit()

        class FakeScraper:
            def scrape(self):
                return [
                    {
                        "marca": "Volkswagen",
                        "nome": "Gol",
                        "versao": "1.0",
                        "ano": 2020,
                        "km": 50000,
                        "preco": 45000,
                        "descricao": "Novo anúncio",
                        "imagens": ["gol.jpg"],
                        "opcionais": ["Ar"],
                        "link": "https://example.com/gol",
                        "source": "demo",
                        "external_id": "demo-gol",
                    }
                ]

        service = VehicleSyncService(session_factory=self.session_factory, scraper=FakeScraper())
        result = service.sync()

        self.assertEqual(result["created"], 1)
        self.assertEqual(result["updated"], 0)
        self.assertEqual(result["marked_unavailable"], 1)

        with self.session_factory() as session:
            vehicle = session.query(Vehicle).filter(Vehicle.id == "legacy-car").one()
            self.assertFalse(vehicle.is_available)


if __name__ == "__main__":
    unittest.main()
