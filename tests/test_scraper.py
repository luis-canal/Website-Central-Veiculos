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


if __name__ == "__main__":
    unittest.main()
