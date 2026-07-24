import logging
import re
from urllib.parse import urljoin, parse_qs, urlparse

import requests
from bs4 import BeautifulSoup

from backend.config import (
    SCRAPER_TIMEOUT,
    SCRAPER_URL
)

logger = logging.getLogger(__name__)


class VehicleScraper:
    def __init__(self, base_url=None, timeout=None, session=None):
        self.base_url = base_url or SCRAPER_URL
        self.timeout = timeout or SCRAPER_TIMEOUT
        self.session = session or requests.Session()
        self.session = session or requests.Session()

        self.session.headers.update({
            "User-Agent": "Mozilla/5.0",
            "Accept-Language": "pt-BR,pt;q=0.9"
        })

    def scrape(self):
        vehicles = []

        links = self._get_vehicle_links()

        logger.info("%d veículos encontrados.", len(links))

        for link in links:
            try:
                vehicle = self._scrape_vehicle(link)

                if vehicle:
                    vehicles.append(vehicle)

            except Exception as e:
                logger.exception("Erro ao processar %s: %s", link, e)

        return vehicles

    def _scrape_vehicle(self, url):

        soup = self._get_soup(url)

        vehicle_id = parse_qs(urlparse(url).query).get("id", [""])[0]

        dados = self._extract_details(soup)

        return {
            "id": vehicle_id,
            "url": url,
            "nome": self._extract_name(soup),
            "marca": dados.get("marca", ""),
            "preco": self._parse_price(dados.get("preco")),
            "ano_modelo": dados.get("ano_modelo", ""),
            "observacoes": dados.get("observacoes", ""),
            "imagens": self._extract_images(soup),
        }



    def _get_soup(self, url):
        response = self.session.get(url, timeout=self.timeout)
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")

    def _get_vehicle_links(self):

        soup = self._get_soup(self.base_url)

        links = []

        for item in soup.select("div.item"):

            link = item.select_one("div.col.s3.m2 a.veiculo")

            if not link:
                continue

            href = link.get("href")

            if not href:
                continue

            full_url = urljoin(self.base_url, href)

            if full_url not in links:
                links.append(full_url)

        return links

    def _extract_name(self, soup):

        tag = soup.select_one("h3.detalhes_title")

        if tag:
            return tag.get_text(" ", strip=True)

        return ""

    def _extract_images(self, soup):

        images = []

        gallery = soup.select_one("div.galeria")

        if not gallery:
            return images

        for a in gallery.select("a[href]"):

            href = a["href"]

            if href.startswith("http") and href not in images:
                images.append(href)

        return images

    def _extract_details(self, soup):

        dados = {}

        detalhes = soup.select_one("div.flow-text.detalhes")

        if not detalhes:
            return dados

        rows = detalhes.select("div.row")

        for row in rows:

            cols = row.find_all("div", recursive=False)

            textos = []

            for c in cols:
                texto = c.get_text(" ", strip=True)

                if texto:
                    textos.append(texto)

            # Preço / Marca / KM
            if "Preço*" in textos:

                try:
                    idx = textos.index("Preço*")
                    dados["preco"] = textos[idx + 3]
                    dados["marca"] = textos[idx + 4]
                except:
                    pass

            # Ano Modelo
            elif "Ano Modelo" in textos:

                try:
                    idx = textos.index("Ano Modelo")
                    dados["ano_modelo"] = textos[idx + 3]
                except:
                    pass

            # Observações
            elif "Observações" in textos:

                try:
                    idx = textos.index("Observações")
                    dados["observacoes"] = "\n".join(textos[idx + 1:])
                except:
                    pass

        return dados

    @staticmethod
    def _parse_price(value):
        if not value:
            return None
        numeric_text = re.sub(r"[^0-9,\.]", "", value)
        if not numeric_text:
            return None
        if "," in numeric_text:
            integer_part, decimal_part = numeric_text.split(",", 1)
            integer_part = integer_part.replace(".", "")
            return int(integer_part) if integer_part.isdigit() else None
        numeric_text = numeric_text.replace(".", "")
        return int(numeric_text) if numeric_text.isdigit() else None

 