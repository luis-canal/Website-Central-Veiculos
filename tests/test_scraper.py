import unittest

from backend.services.scraper import VehicleScraper


class ScraperTests(unittest.TestCase):
    def test_parse_detail_page_extracts_expected_fields(self):
        html = """
        <html><body>
          <h3>VIRTUS Comfortline 2024</h3>
          <img src="https://www.carrodopovo.com.br/fotos/marcas/volkswagen.gif" />
          <img src="https://www.carrodopovo.com.br/fotos/bigimage/1.jpeg" />
          <img src="https://www.carrodopovo.com.br/fotos/bigimage/2.jpeg" />
          <div>Placa Cor JCO4J68 Cinza</div>
          <div>Preço* R$ 106.000,00</div>
          <div>Marca VOLKSWAGEN</div>
          <div>Ano Fabricação Ano Modelo Tipo 2024 2024</div>
          <div>Observações ÚNICO DONO Completo</div>
        </body></html>
        """

        scraper = VehicleScraper(base_url="https://www.carrodopovo.com.br/cp5/?pag=loja&id=36582110000156")
        data = scraper._parse_detail_page(html, "https://www.carrodopovo.com.br/cp5/?pag=veiculo&id=12615587")

        self.assertEqual(data["nome"], "VIRTUS Comfortline 2024")
        self.assertEqual(data["marca"], "Volkswagen")
        self.assertEqual(data["ano"], 2024)
        self.assertEqual(data["preco"], 106000)
        self.assertEqual(data["cor"], "Cinza")
        self.assertEqual(data["placa"], "JCO4J68")
        self.assertEqual(len(data["imagens"]), 2)

    def test_parse_detail_page_extracts_fields_from_real_layout(self):
        html = """
        <html><body>
          <meta property="og:title" content="VIRTUS Comfortline 2024" />
          <h3 class="flow-text detalhes_title">VIRTUS Comfortline 2024</h3>
          <div class="col s12 m6 l6 flow-text detalhes z-depth-0">
            <div class="row">
              <div class="col s6 m6 l6 center title no-margin">Placa</div>
              <div class="col s6 m6 l6 center title no-margin">Cor</div>
              <div class="col s6 m6 l6 center">JCO4J68</div>
              <div class="col s4 m6 l6 center">Cinza</div>
            </div>
            <div class="row">
              <div class="col s4 m4 l4 center title">Preço*</div>
              <div class="col s4 m4 l4 center title">Marca</div>
              <div class="col s4 m4 l4 center title truncate">KM</div>
              <div class="col s4 m4 l4 center">R$ 106.000,00</div>
              <div class="col s4 m4 l4 center">VOLKSWAGEN</div>
              <div class="col s4 m4 l4 center"></div>
            </div>
            <div class="row">
              <div class="col s4 m4 l4 center title truncate">Ano Fabricação</div>
              <div class="col s4 m4 l4 center title truncate">Ano Modelo</div>
              <div class="col s4 m4 l4 center title">Tipo</div>
              <div class="col s4 m4 l4 center">2024</div>
              <div class="col s4 m4 l4 center">2024</div>
              <div class="col s4 m4 l4 center">Carro Passeio</div>
            </div>
            <div class="row">
              <div class="col s12 m12 l12 center title">Observações</div>
              <div class="col s12 m12 l12 center">ÚNICO DONO Completo</div>
            </div>
          </div>
          <img src="https://www.carrodopovo.com.br/fotos/bigimage/573f129ea4897d31b161c7d73b5f6f72.jpeg" />
          <img src="https://www.carrodopovo.com.br/fotos/bigimage/468a7edb945f7d02d3d74255810df2cf.jpeg" />
          <img src="https://www.carrodopovo.com.br/fotos/marcas/volkswagen.gif" />
        </body></html>
        """

        scraper = VehicleScraper(base_url="https://www.carrodopovo.com.br/cp5/?pag=loja&id=36582110000156")
        data = scraper._parse_detail_page(html, "https://www.carrodopovo.com.br/cp5/?pag=veiculo&id=12615587")

        self.assertEqual(data["nome"], "VIRTUS Comfortline 2024")
        self.assertEqual(data["marca"], "Volkswagen")
        self.assertEqual(data["ano"], 2024)
        self.assertEqual(data["preco"], 106000)
        self.assertEqual(data["cor"], "Cinza")
        self.assertEqual(data["placa"], "JCO4J68")
        self.assertEqual(len(data["imagens"]), 2)


if __name__ == "__main__":
    unittest.main()
