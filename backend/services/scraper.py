import logging
import re
import time
from typing import List, Dict, Any
from urllib.parse import urljoin, parse_qs, urlparse

import requests
from bs4 import BeautifulSoup


logger = logging.getLogger(__name__)


class VehicleScraper:
    def __init__(self, base_url=None, timeout=None, session=None):
        self.base_url = base_url or SCRAPER_URL
        self.timeout = timeout or SCRAPER_TIMEOUT
        self.session = session or requests.Session()

    def scrape(self) -> List[Dict[str, Any]]:
        if not self.base_url:
            logger.warning("SCRAPER_URL not configured; returning empty list")
            return []

        try:
            response = self._request(self.base_url)
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.exception("Erro ao acessar a página da loja: %s", exc)
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        listing_items = self._extract_listing_items(soup)
        vehicles = []

        for listing_item in listing_items:
            try:
                vehicle = self._fetch_vehicle_page(listing_item.get("url"))
                if vehicle:
                    vehicle["external_id"] = listing_item.get("external_id") or vehicle.get("external_id")
                    vehicle["nome"] = vehicle.get("nome") or listing_item.get("title")
                    vehicle["ano"] = vehicle.get("ano") or listing_item.get("year")
                    vehicle["imagens"] = vehicle.get("imagens") or [listing_item.get("thumbnail")] if listing_item.get("thumbnail") else vehicle.get("imagens")
                    vehicles.append(vehicle)
            except Exception as exc:  # pragma: no cover - defensive path
                logger.exception("Erro ao processar anúncio %s: %s", listing_item.get("url"), exc)

        return [vehicle for vehicle in vehicles if vehicle.get("nome")]

    def _fetch_vehicle_page(self, detail_url: str) -> Dict[str, Any]:
        if not detail_url:
            return {}

        absolute_url = urljoin(self.base_url, detail_url)
        try:
            response = self._request(absolute_url)
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.exception("Erro ao acessar anúncio %s: %s", absolute_url, exc)
            return {}

        return self._parse_detail_page(response.text, absolute_url)

    def _parse_detail_page(self, html: str, detail_url: str) -> Dict[str, Any]:
        soup = BeautifulSoup(html, "html.parser")
        metadata = self._extract_metadata(soup, detail_url)
        specifications = self._extract_specifications(soup)
        description = self._extract_description(soup)
        optional_items = self._extract_optionals(soup)
        images = self._extract_images(soup)

        return {
            "external_id": metadata.get("external_id"),
            "source": "carrodopovo",
            "nome": metadata.get("title") or "Veículo sem nome",
            "marca": self._normalize_brand(specifications.get("marca")),
            "versao": metadata.get("title") or description,
            "ano": specifications.get("ano"),
            "km": specifications.get("km"),
            "preco": specifications.get("preco"),
            "combustivel": specifications.get("combustivel"),
            "cambio": specifications.get("cambio"),
            "cor": specifications.get("cor"),
            "imagens": images,
            "descricao": description,
            "opcionais": optional_items,
            "link": detail_url,
            "destaque": False,
            "placa": specifications.get("placa"),
        }

    def _extract_listing_items(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        items = []
        for item in soup.select("div.item"):
            link_element = item.select_one("a.veiculo")
            if not link_element:
                continue
            href = link_element.get("href", "")
            if not href:
                continue

            thumbnail = None
            image_element = item.select_one("img")
            if image_element:
                thumbnail = image_element.get("src") or image_element.get("data-src")

            title = self._clean_text(item.get_text(" ", strip=True))
            year = self._extract_year(title) if title else None

            parsed_url = urlparse(href)
            query_params = parse_qs(parsed_url.query)
            external_id = query_params.get("id", [None])[0]

            items.append({
                "external_id": external_id,
                "title": title,
                "year": year,
                "thumbnail": self._normalize_image_url(thumbnail) if thumbnail else None,
                "url": href,
            })

        return self._dedupe_listing_items(items)

    @staticmethod
    def _find_text(container, selectors):
        for selector in selectors:
            element = container.select_one(selector)
            if element and element.get_text(strip=True):
                return element.get_text(strip=True)
        return None

    def _extract_metadata(self, soup: BeautifulSoup, detail_url: str) -> Dict[str, Any]:
        meta_title = soup.select_one('meta[property="og:title"]')
        meta_image = soup.select_one('meta[property="og:image"]')
        meta_url = soup.select_one('meta[property="og:url"]')

        title = self._clean_text(meta_title.get("content")) if meta_title and meta_title.get("content") else self._extract_title(soup)
        image = self._clean_text(meta_image.get("content")) if meta_image and meta_image.get("content") else None
        url = self._clean_text(meta_url.get("content")) if meta_url and meta_url.get("content") else detail_url

        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        external_id = query_params.get("id", [None])[0]

        return {
            "title": title,
            "image": self._normalize_image_url(image) if image else None,
            "url": url,
            "external_id": external_id,
        }

    def _extract_specifications(self, soup: BeautifulSoup) -> Dict[str, Any]:
        details_container = soup.select_one('.detalhes')
        details_text = details_container.get_text(" ", strip=True) if details_container else soup.get_text(" ", strip=True)

        price_text = self._extract_price_from_details(details_container or soup)
        brand_text = self._extract_brand_from_details(details_container or soup)
        placa = self._extract_plate(details_text)
        cor = self._extract_color(details_text)
        marca = self._extract_brand_from_text(soup, brand_text)
        ano = self._extract_year(details_text)
        km = self._extract_km(details_text)
        combustivel = self._extract_spec_value(details_container or soup, "Combustível")
        cambio = self._extract_spec_value(details_container or soup, "Câmbio")

        return {
            "marca": marca,
            "ano": ano,
            "km": km,
            "preco": self._parse_price(price_text),
            "combustivel": combustivel,
            "cambio": cambio,
            "cor": cor,
            "placa": placa,
        }

    def _extract_description(self, soup: BeautifulSoup) -> str:
        details_container = soup.select_one('.detalhes')
        if details_container:
            observations = details_container.find(string=re.compile(r"Observações", re.I))
            if observations and observations.parent:
                block = observations.parent.parent if observations.parent.parent else observations.parent
                return self._clean_text(block.get_text(" ", strip=True))

        description = self._clean_text(self._find_text(soup, [".description", ".descricao", "p"]))
        return description or self._clean_text(soup.get_text(" ", strip=True))

    def _extract_optionals(self, soup: BeautifulSoup) -> List[str]:
        details_container = soup.select_one('.detalhes')
        if details_container:
            optional_heading = None
            for node in details_container.find_all(['div', 'span']):
                text = self._clean_text(node.get_text(" ", strip=True))
                if text and text.lower() == "opcionais":
                    optional_heading = node
                    break
            if optional_heading and optional_heading.parent:
                parent = optional_heading.parent
                return [self._clean_text(item.get_text(" ", strip=True)) for item in parent.find_all(['div', 'span']) if self._clean_text(item.get_text(" ", strip=True))]

        return self._extract_options(soup)

    def _extract_images(self, soup: BeautifulSoup) -> List[str]:
        gallery = soup.select_one('.galeria_detalhes')
        if gallery:
            anchors = gallery.select('a[href]')
            images = []
            for anchor in anchors:
                href = anchor.get("href")
                if href and "bigimage" in href.lower():
                    images.append(self._normalize_image_url(href))
            if images:
                return self._dedupe_images(images)

        images = []
        for img in soup.select('img'):
            src = img.get("src") or img.get("data-src")
            if src and not self._is_brand_image(src):
                normalized = self._normalize_image_url(src)
                if normalized and self._is_vehicle_image(normalized):
                    images.append(normalized)
        return self._dedupe_images(images)

    @staticmethod
    def _find_link(container):
        link = container.find("a")
        return link.get("href") if link and link.get("href") else None

    @staticmethod
    def _clean_text(value):
        if not value:
            return None
        return re.sub(r"\s+", " ", value).strip()

    @staticmethod
    def _normalize_brand(value):
        if not value:
            return None
        mapping = {
            "volkswagen": "Volkswagen",
            "chevrolet": "Chevrolet",
            "toyota": "Toyota",
            "honda": "Honda",
            "hyundai": "Hyundai",
            "bmw": "BMW",
            "ford": "Ford",
            "fiat": "Fiat",
            "renault": "Renault",
            "nissan": "Nissan",
        }
        lowered = value.lower()
        return mapping.get(lowered, value)

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

    @staticmethod
    def _extract_year(value):
        if not value:
            return None
        match = re.search(r"\b(19|20)\d{2}\b", value)
        return int(match.group(0)) if match else None

    @staticmethod
    def _extract_km(value):
        if not value:
            return None
        match = re.search(r"(\d[\d\.]*)\s*km", value, re.IGNORECASE)
        return int(match.group(1).replace(".", "")) if match else None

    @staticmethod
    def _extract_version(value):
        if not value:
            return None
        return value

    @staticmethod
    def _extract_options(soup: BeautifulSoup) -> List[str]:
        text = soup.get_text(" ", strip=True)
        options = []
        for marker in ["Opcional", "Opcionais", "Observações"]:
            if marker in text:
                options.append(marker)
        return options

    @staticmethod
    def _extract_value(soup: BeautifulSoup, labels: List[str]):
        text = soup.get_text(" ", strip=True)
        for label in labels:
            pattern = rf"{label}\s*[:\-]?\s*([A-Za-z0-9\s./-]+)"
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    @staticmethod
    def _extract_brand_from_text(soup: BeautifulSoup, fallback=None):
        text = soup.get_text(" ", strip=True)
        if fallback:
            normalized_fallback = fallback.strip()
            if normalized_fallback and normalized_fallback.lower() not in {"km", "marca"}:
                return normalized_fallback

        match = re.search(r"Marca\s*[:\-]?\s*([A-Za-zÀ-ÖØ-öø-ÿ]+)", text, re.IGNORECASE)
        if match:
            candidate = match.group(1).strip()
            if candidate and candidate.lower() not in {"km", "marca"}:
                return candidate
        return fallback

    @staticmethod
    def _extract_brand_from_details(soup: BeautifulSoup):
        rows = soup.select('.detalhes .row')
        for row in rows:
            cells = [cell for cell in row.find_all(['div', 'span']) if cell.get_text(" ", strip=True)]
            if not cells:
                continue

            title_cells = [cell for cell in cells if "title" in cell.get("class", [])]
            value_cells = [cell for cell in cells if "title" not in cell.get("class", [])]

            for idx, cell in enumerate(title_cells):
                text = cell.get_text(" ", strip=True)
                if text.lower() == "marca":
                    if idx < len(value_cells):
                        candidate = value_cells[idx].get_text(" ", strip=True)
                        if candidate and candidate.lower() not in {"km", "", "preço*", "preco*"}:
                            return candidate
                    break
        return None

    @staticmethod
    def _extract_title(soup: BeautifulSoup):
        meta_title = soup.select_one('meta[property="og:title"]')
        if meta_title and meta_title.get("content"):
            return meta_title.get("content").strip()
        for selector in ["h3.detalhes_title", ".detalhes_title", "h1", "h2", "h3", ".title", ".vehicle-title"]:
            element = soup.select_one(selector)
            if element and element.get_text(strip=True):
                return element.get_text(" ", strip=True)
        return None

    @staticmethod
    def _extract_price_from_details(soup: BeautifulSoup):
        for element in soup.select('.detalhes .row .center'):
            text = element.get_text(" ", strip=True)
            if text and "R$" in text:
                return text

        text = soup.get_text(" ", strip=True)
        match = re.search(r"R\$\s*([\d\.]+(?:,\d{1,2})?)", text)
        if match:
            return match.group(0)
        return None

    @staticmethod
    def _extract_spec_value(soup: BeautifulSoup, label: str):
        for element in soup.select('.detalhes .row .center'):
            text = element.get_text(" ", strip=True)
            if text and text.lower() == label.lower():
                next_sibling = element.find_next_sibling()
                if next_sibling:
                    value = next_sibling.get_text(" ", strip=True)
                    if value:
                        return value
        return None

    @staticmethod
    def _extract_plate(text: str):
        match = re.search(r"\b([A-Za-z]{3}(?:-?\d{4}|\d[A-Za-z0-9]\d{2}))\b", text, re.IGNORECASE)
        if match:
            return match.group(1).upper()
        return None

    @staticmethod
    def _extract_color(text: str):
        color_names = {
            "preto", "preta", "branco", "branca", "cinza", "vermelho", "vermelha", "azul", "verde",
            "prata", "grafite", "bege", "marrom", "amarelo", "laranja", "roxo", "rosa", "dourado", "bronze",
            "vinho", "chumbo"
        }

        for candidate in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]+", text):
            if candidate.lower() in color_names:
                return candidate.strip().capitalize()

        return None

    @staticmethod
    def _extract_price_from_text(soup: BeautifulSoup):
        text = soup.get_text(" ", strip=True)
        match = re.search(r"R\$\s*([\d\.]+(?:,\d{1,2})?)", text)
        if match:
            return match.group(0)
        return None

    @staticmethod
    def _is_brand_image(value):
        if not value:
            return False
        lowered = value.lower()
        return any(token in lowered for token in ["marca", "logo", "icon", "gif", "avatar", "bgcar", "wzt", "wzpa", "watts"])

    @staticmethod
    def _is_vehicle_image(value):
        if not value:
            return False
        lowered = value.lower()
        return any(token in lowered for token in ["bigimage", "fotos", "foto"])

    @staticmethod
    def _normalize_image_url(value):
        if not value:
            return None
        if value.startswith("http"):
            return value
        return f"https://www.carrodopovo.com.br{value}" if not value.startswith("/") else f"https://www.carrodopovo.com.br{value}"

    @staticmethod
    def _dedupe_images(images: List[str]) -> List[str]:
        seen = set()
        result = []
        for image in images:
            if image and image not in seen:
                seen.add(image)
                result.append(image)
        return result

    @staticmethod
    def _dedupe_links(links: List[str]) -> List[str]:
        seen = set()
        result = []
        for link in links:
            if link and link not in seen:
                seen.add(link)
                result.append(link)
        return result

    @staticmethod
    def _dedupe_listing_items(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen = set()
        result = []
        for item in items:
            key = item.get("url") or item.get("external_id")
            if key and key not in seen:
                seen.add(key)
                result.append(item)
        return result

    def _request(self, url: str, retries: int = 3) -> requests.Response:
        last_error = None
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=self.timeout, headers=self._headers())
                response.raise_for_status()
                return response
            except requests.RequestException as exc:
                last_error = exc
                if attempt < retries - 1:
                    logger.warning("Falha na requisição %s (tentativa %s/%s): %s", url, attempt + 1, retries, exc)
                    time.sleep(1)
                    continue
                logger.exception("Erro final na requisição %s: %s", url, exc)
                raise
        raise last_error

    @staticmethod
    def _headers() -> Dict[str, str]:
        return {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        }
