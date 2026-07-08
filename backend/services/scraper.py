import logging
from typing import List, Dict, Any

import requests
from bs4 import BeautifulSoup

from ..config import SCRAPER_TIMEOUT, SCRAPER_URL, SCRAPER_CARD_SELECTOR

logger = logging.getLogger(__name__)


class VehicleScraper:
    def __init__(self, base_url=None, timeout=None):
        self.base_url = base_url or SCRAPER_URL
        self.timeout = timeout or SCRAPER_TIMEOUT

    def scrape(self) -> List[Dict[str, Any]]:
        if not self.base_url:
            logger.warning("SCRAPER_URL not configured; returning empty list")
            return []

        try:
            response = requests.get(self.base_url, timeout=self.timeout)
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.exception("Erro ao acessar a fonte de anúncios: %s", exc)
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        cards = soup.select(SCRAPER_CARD_SELECTOR)
        vehicles = []

        for card in cards:
            try:
                vehicles.append(self._parse_vehicle(card))
            except Exception as exc:  # pragma: no cover - defensive path
                logger.exception("Erro ao processar item de anúncio: %s", exc)

        return [vehicle for vehicle in vehicles if vehicle.get("nome")]

    def _parse_vehicle(self, card) -> Dict[str, Any]:
        title = self._find_text(card, ["h2", "h3", ".title", ".vehicle-title"])
        price = self._find_text(card, [".price", ".preco", ".valor"])
        description = self._find_text(card, [".description", ".descricao", "p"])
        link = self._find_link(card)
        images = [img.get("src") for img in card.select("img") if img.get("src")]

        return {
            "external_id": link or title,
            "source": "scraper",
            "nome": title or "Veículo sem nome",
            "marca": self._extract_brand(title),
            "versao": "",
            "ano": None,
            "km": None,
            "preco": self._parse_price(price),
            "combustivel": None,
            "cambio": None,
            "cor": None,
            "imagens": images,
            "descricao": description,
            "opcionais": [],
            "link": link,
            "destaque": False,
        }

    @staticmethod
    def _find_text(container, selectors):
        for selector in selectors:
            element = container.select_one(selector)
            if element and element.get_text(strip=True):
                return element.get_text(strip=True)
        return None

    @staticmethod
    def _find_link(container):
        link = container.find("a")
        return link.get("href") if link and link.get("href") else None

    @staticmethod
    def _extract_brand(title):
        if not title:
            return None
        parts = [part.strip() for part in title.split() if part.strip()]
        return parts[0] if parts else None

    @staticmethod
    def _parse_price(value):
        if not value:
            return None
        digits = "".join(ch for ch in value if ch.isdigit())
        return int(digits) if digits else None
