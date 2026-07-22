import requests 
from bs4 import BeautifulSoup

pagina = requests.get("https://www.carrodopovo.com.br/cp5/?pag=loja&id=36582110000156")
dados_pagina = BeautifulSoup(pagina.text, "html.parser")

print(dados_pagina.prettify())