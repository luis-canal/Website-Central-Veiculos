import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs

BASE_URL = "https://www.carrodopovo.com.br/cp5/"
STORE_URL = "https://www.carrodopovo.com.br/cp5/?pag=loja&id=36582110000156"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


class CarroDoPovoScraper:

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    # ------------------------------------------------------------------
    # Faz o download de qualquer página
    # ------------------------------------------------------------------
    def get_soup(self, url):
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")

    # ------------------------------------------------------------------
    # Extrai todas as URLs dos veículos da página da loja
    # ------------------------------------------------------------------
    def get_vehicle_links(self):

        soup = self.get_soup(STORE_URL)

        links = []

        for item in soup.select("div.item"):

            link = item.select_one("div.col.s3.m2 a.veiculo")

            if not link:
                continue

            href = link.get("href")

            if not href:
                continue

            full_url = urljoin(BASE_URL, href)

            if full_url not in links:
                links.append(full_url)

        return links

    # ------------------------------------------------------------------
    # Nome do veículo
    # ------------------------------------------------------------------
    def extract_name(self, soup):

        tag = soup.select_one("h3.detalhes_title")

        if tag:
            return tag.get_text(" ", strip=True)

        return ""

    # ------------------------------------------------------------------
    # Todas as imagens
    # ------------------------------------------------------------------
    def extract_images(self, soup):

        images = []

        gallery = soup.select_one("div.galeria")

        if not gallery:
            return images

        for a in gallery.select("a[href]"):

            href = a["href"]

            if href.startswith("http") and href not in images:
                images.append(href)

        return images

    # ------------------------------------------------------------------
    # Extrai informações da tabela de detalhes
    # ------------------------------------------------------------------
    def extract_details(self, soup):

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

    # ------------------------------------------------------------------
    # Raspa um veículo
    # ------------------------------------------------------------------
    def scrape_vehicle(self, url):

        soup = self.get_soup(url)

        vehicle_id = parse_qs(urlparse(url).query).get("id", [""])[0]

        dados = self.extract_details(soup)

        vehicle = {

            "id": vehicle_id,

            "url": url,

            "nome": self.extract_name(soup),

            "marca": dados.get("marca", ""),

            "preco": dados.get("preco", ""),

            "ano_modelo": dados.get("ano_modelo", ""),

            "observacoes": dados.get("observacoes", ""),

            "imagens": self.extract_images(soup)

        }

        return vehicle

    # ------------------------------------------------------------------
    # Raspa todos os veículos da loja
    # ------------------------------------------------------------------
    def scrape_store(self):

        vehicles = []

        links = self.get_vehicle_links()

        print(f"{len(links)} veículos encontrados.")

        for i, link in enumerate(links, start=1):

            print(f"[{i}/{len(links)}] {link}")

            try:

                vehicle = self.scrape_vehicle(link)

                vehicles.append(vehicle)

            except Exception as e:

                print("Erro:", e)

        return vehicles


if __name__ == "__main__":

    scraper = CarroDoPovoScraper()

    carros = scraper.scrape_store()

    print()

    print("=" * 60)

    for carro in carros:

        print(carro["nome"])
        print(carro["marca"])
        print(carro["preco"])
        print(carro["ano_modelo"])
        print(carro["observacoes"])
        print(f"{len(carro['imagens'])} imagens")
        print("-" * 60)