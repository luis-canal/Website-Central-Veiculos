export function filterCars(cars = [], filters = {}) {
  const {
    search = '',
    marca: marcaFiltro = '',
    precoMin = '',
    precoMax = '',
    sortBy = 'preco-asc',
  } = filters;

  const termo = search.trim().toLowerCase();
  const precoMinValue = Number(precoMin);
  const precoMaxValue = Number(precoMax);

  const filtrados = cars.filter((carro) => {
    const nome = String(carro?.nome || '').toLowerCase();
    const marca = String(carro?.marca || '').toLowerCase();
    const observacoes = String(carro?.observacoes || '').toLowerCase();

    const atendeTexto =
        !termo ||
        [nome, marca, observacoes].some(valor =>
            valor.includes(termo)
        );
    const atendeMarca = !marcaFiltro || !filters?.marca || String(carro?.marca || '').toLowerCase() === marcaFiltro.toLowerCase();
    const atendePrecoMin = Number.isNaN(precoMinValue) || Number(carro?.preco || 0) >= precoMinValue;
    const atendePrecoMax = Number.isNaN(precoMaxValue) || Number(carro?.preco || 0) <= precoMaxValue;

    return atendeTexto && atendeMarca && atendePrecoMin && atendePrecoMax && atendeAnoMin && atendeAnoMax && atendeKmMax;
  });

  const sorted = [...filtrados].sort((a, b) => {
    switch (sortBy) {
      case 'preco-desc':
        return Number(b?.preco || 0) - Number(a?.preco || 0);
      case 'nome-asc':
        return String(a?.nome || '').localeCompare(String(b?.nome || ''), 'pt-BR');
      case 'preco-asc':
      default:
        return Number(a?.preco || 0) - Number(b?.preco || 0);
    }
  });

  return sorted;
}
