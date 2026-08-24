from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from requests import HTTPError

from backend.services.scraper import VehicleScraper


def make_response(html, *, raise_http_error=False):
    response = SimpleNamespace(text=html)

    def raise_for_status():
        if raise_http_error:
            raise HTTPError("HTTP error")

    response.raise_for_status = raise_for_status
    return response


def test_get_vehicle_links_extracts_expected_urls():
    html = """
    <html><body>
      <div class="item">
        <div class="col s3 m2">
          <a class="veiculo" href="/veiculo?id=101">Veículo 101</a>
        </div>
      </div>
      <div class="item">
        <div class="col s3 m2">
          <a class="veiculo" href="https://site.com/veiculo?id=202">Veículo 202</a>
        </div>
      </div>
      <div class="item">
        <div class="col s3 m2">
          <a class="veiculo" href="/veiculo?id=101">Veículo duplicado</a>
        </div>
      </div>
    </body></html>
    """
    session = Mock()
    session.get.return_value = make_response(html)

    scraper = VehicleScraper(base_url="https://carros.example.com/loja?id=999", session=session)

    assert scraper._get_vehicle_links() == [
        "https://carros.example.com/veiculo?id=101",
        "https://site.com/veiculo?id=202",
    ]


def test_get_vehicle_links_returns_empty_when_no_vehicle_cards_exist():
    html = "<html><body><div class='not-item'>Sem carros aqui</div></body></html>"
    session = Mock()
    session.get.return_value = make_response(html)

    scraper = VehicleScraper(base_url="https://carros.example.com", session=session)

    assert scraper._get_vehicle_links() == []


def test_scrape_vehicle_extracts_expected_fields():
    html = """
    <html><body>
      <h3 class="detalhes_title">VIRTUS Comfortline 2024</h3>
      <div class="galeria">
        <a href="https://img.example.com/1.jpg">1</a>
        <a href="https://img.example.com/2.jpg">2</a>
        <a href="https://img.example.com/1.jpg">duplicado</a>
      </div>
      <div class="flow-text detalhes">
        <div class="row">
          <div>Preço*</div>
          <div>Marca</div>
          <div>KM</div>
          <div>R$ 106.000,00</div>
          <div>VOLKSWAGEN</div>
          <div></div>
        </div>
        <div class="row">
          <div>Ano Fabricação</div>
          <div>Ano Modelo</div>
          <div>Tipo</div>
          <div>2024</div>
          <div>2024</div>
          <div>Carro Passeio</div>
        </div>
        <div class="row">
          <div>Observações</div>
          <div>ÚNICO DONO Completo</div>
        </div>
      </div>
    </body></html>
    """
    session = Mock()
    session.get.return_value = make_response(html)

    scraper = VehicleScraper(base_url="https://carros.example.com/loja?id=999", session=session)
    vehicle = scraper._scrape_vehicle("https://carros.example.com/veiculo?id=12615587")

    assert vehicle["external_id"] == "12615587"
    assert vehicle["source"] == "carros.example.com"
    assert vehicle["url"] == "https://carros.example.com/veiculo?id=12615587"
    assert vehicle["nome"] == "VIRTUS Comfortline 2024"
    assert vehicle["marca"] == "VOLKSWAGEN"
    assert vehicle["preco"] == 106000
    assert vehicle["ano_modelo"] == "2024"
    assert vehicle["observacoes"] == "ÚNICO DONO Completo"
    assert vehicle["imagens"] == [
        "https://img.example.com/1.jpg",
        "https://img.example.com/2.jpg",
    ]


def test_extract_details_handles_missing_fields_gracefully():
    html = "<html><body><div class='flow-text detalhes'><div class='row'><div>Sem campos relevantes</div></div></div></body></html>"
    scraper = VehicleScraper(base_url="https://carros.example.com", session=Mock())
    soup = scraper._get_soup if False else None

    details = VehicleScraper._extract_details(scraper, __import__("bs4").BeautifulSoup(html, "html.parser"))

    assert details == {}


def test_extract_name_returns_empty_string_when_missing():
    soup = __import__("bs4").BeautifulSoup("<html><body><h1>Sem nome</h1></body></html>", "html.parser")
    scraper = VehicleScraper(base_url="https://carros.example.com", session=Mock())

    assert scraper._extract_name(soup) == ""


def test_extract_images_returns_empty_when_gallery_missing():
    soup = __import__("bs4").BeautifulSoup("<html><body><div>Sem galeria</div></body></html>", "html.parser")
    scraper = VehicleScraper(base_url="https://carros.example.com", session=Mock())

    assert scraper._extract_images(soup) == []


def test_scrape_returns_expected_vehicle_list_for_valid_list_page():
    list_page = """
    <html><body>
      <div class="item">
        <div class="col s3 m2"><a class="veiculo" href="/veiculo?id=101">Carro 101</a></div>
      </div>
      <div class="item">
        <div class="col s3 m2"><a class="veiculo" href="/veiculo?id=202">Carro 202</a></div>
      </div>
    </body></html>
    """

    detail_101 = """
    <html><body>
      <h3 class="detalhes_title">Carro 101</h3>
      <div class="galeria"><a href="https://img.example.com/101a.jpg">a</a></div>
      <div class="flow-text detalhes">
        <div class="row"><div>Preço*</div><div>Marca</div><div>KM</div><div>R$ 80.000,00</div><div>FIAT</div><div></div></div>
        <div class="row"><div>Ano Fabricação</div><div>Ano Modelo</div><div>Tipo</div><div>2020</div><div>2020</div><div>Carro Passeio</div></div>
        <div class="row"><div>Observações</div><div>ÚNICO DONO</div></div>
      </div>
    </body></html>
    """

    detail_202 = """
    <html><body>
      <h3 class="detalhes_title">Carro 202</h3>
      <div class="galeria"><a href="https://img.example.com/202a.jpg">a</a></div>
      <div class="flow-text detalhes">
        <div class="row"><div>Preço*</div><div>Marca</div><div>KM</div><div>R$ 90.000,00</div><div>VW</div><div></div></div>
        <div class="row"><div>Ano Fabricação</div><div>Ano Modelo</div><div>Tipo</div><div>2021</div><div>2021</div><div>Carro Passeio</div></div>
        <div class="row"><div>Observações</div><div>Completo</div></div>
      </div>
    </body></html>
    """

    session = Mock()
    session.get.side_effect = [
        make_response(list_page),
        make_response(detail_101),
        make_response(detail_202),
    ]

    scraper = VehicleScraper(base_url="https://carros.example.com/loja?id=999", session=session)
    vehicles = scraper.scrape()

    assert len(vehicles) == 2
    assert vehicles[0]["external_id"] == "101"
    assert vehicles[0]["nome"] == "Carro 101"
    assert vehicles[0]["preco"] == 80000
    assert vehicles[1]["external_id"] == "202"
    assert vehicles[1]["nome"] == "Carro 202"
    assert vehicles[1]["preco"] == 90000


def test_scrape_handles_http_error_for_detail_page():
    list_page = """
    <html><body>
      <div class="item"><div class="col s3 m2"><a class="veiculo" href="/veiculo?id=404">Carro 404</a></div></div>
    </body></html>
    """
    session = Mock()
    session.get.side_effect = [
        make_response(list_page),
        make_response("<html></html>", raise_http_error=True),
    ]

    scraper = VehicleScraper(base_url="https://carros.example.com/loja?id=999", session=session)

    assert scraper.scrape() == []


def test_scrape_handles_invalid_or_unexpected_html_without_crashing():
    html = "<html><body><div class='item'><div class='col s3 m2'><a class='veiculo' href='/veiculo?id=100'>Sem dados</a></div></div></body></html>"
    session = Mock()
    session.get.side_effect = [
        make_response(html),
        make_response("<html><body><h1>Sem detalhes</h1></body></html>"),
    ]

    scraper = VehicleScraper(base_url="https://carros.example.com/loja?id=999", session=session)
    vehicles = scraper.scrape()

    assert len(vehicles) == 1
    assert vehicles[0]["external_id"] == "100"
    assert vehicles[0]["nome"] == ""
    assert vehicles[0]["marca"] == ""
    assert vehicles[0]["preco"] is None
    assert vehicles[0]["observacoes"] == ""
