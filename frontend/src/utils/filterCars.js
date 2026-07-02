export function filterCars(cars = [], filters = {}) {
  const {
    search = '',
    marca: marcaFiltro = '',
    precoMin = '',
    precoMax = '',
    anoMin = '',
    anoMax = '',
    kmMax = '',
    sortBy = 'preco-asc',
  } = filters;

  const termo = search.trim().toLowerCase();
  const precoMinValue = Number(precoMin);
  const precoMaxValue = Number(precoMax);
  const anoMinValue = Number(anoMin);
  const anoMaxValue = Number(anoMax);
  const kmMaxValue = Number(kmMax);

  const filtrados = cars.filter((carro) => {
    const nome = String(carro?.nome || '').toLowerCase();
    const marca = String(carro?.marca || '').toLowerCase();
    const versao = String(carro?.versao || '').toLowerCase();

    const atendeTexto = !termo || [nome, marca, versao].some((valor) => valor.includes(termo));
    const atendeMarca = !marcaFiltro || !filters?.marca || String(carro?.marca || '').toLowerCase() === marcaFiltro.toLowerCase();
    const atendePrecoMin = Number.isNaN(precoMinValue) || Number(carro?.preco || 0) >= precoMinValue;
    const atendePrecoMax = Number.isNaN(precoMaxValue) || Number(carro?.preco || 0) <= precoMaxValue;
    const atendeAnoMin = Number.isNaN(anoMinValue) || Number(carro?.ano || 0) >= anoMinValue;
    const atendeAnoMax = Number.isNaN(anoMaxValue) || Number(carro?.ano || 0) <= anoMaxValue;
    const atendeKmMax = Number.isNaN(kmMaxValue) || Number(carro?.km || 0) <= kmMaxValue;

    return atendeTexto && atendeMarca && atendePrecoMin && atendePrecoMax && atendeAnoMin && atendeAnoMax && atendeKmMax;
  });

  const sorted = [...filtrados].sort((a, b) => {
    switch (sortBy) {
      case 'preco-desc':
        return Number(b?.preco || 0) - Number(a?.preco || 0);
      case 'ano-asc':
        return Number(a?.ano || 0) - Number(b?.ano || 0);
      case 'ano-desc':
        return Number(b?.ano || 0) - Number(a?.ano || 0);
      case 'km-asc':
        return Number(a?.km || 0) - Number(b?.km || 0);
      case 'km-desc':
        return Number(b?.km || 0) - Number(a?.km || 0);
      case 'nome-asc':
        return String(a?.nome || '').localeCompare(String(b?.nome || ''), 'pt-BR');
      case 'preco-asc':
      default:
        return Number(a?.preco || 0) - Number(b?.preco || 0);
    }
  });

  return sorted;
}
