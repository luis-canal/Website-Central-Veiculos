function getVehicleYear(carro) {
  const rawYear = carro?.ano ?? carro?.ano_modelo ?? carro?.year ?? 0;
  const yearMatch = String(rawYear).match(/\d{4}/);

  return yearMatch ? Number(yearMatch[0]) : 0;
}

export function filterCars(cars = [], filters = {}) {
  const {
    search = '',
    marca: marcaFiltro = '',
    ano: anoFiltro = '',
    anoMin = '',
    anoMax = '',
    kmMax = '',
    precoMin = '',
    precoMax = '',
    sortBy = 'preco-asc',
  } = filters;

  const termo = search.trim().toLowerCase();
  const precoMinValue = precoMin === '' ? NaN : Number(precoMin);
  const precoMaxValue = precoMax === '' ? NaN : Number(precoMax);
  const anoValue = anoFiltro === '' ? NaN : Number(anoFiltro);
  const anoMinValue = anoMin === '' ? NaN : Number(anoMin);
  const anoMaxValue = anoMax === '' ? NaN : Number(anoMax);
  const kmMaxValue = kmMax === '' ? NaN : Number(kmMax);

  const filtrados = cars.filter((carro) => {
    const nome = String(carro?.nome || '').toLowerCase();
    const marca = String(carro?.marca || '').toLowerCase();
    const observacoes = String(carro?.observacoes || '').toLowerCase();
    const ano = getVehicleYear(carro);
    const km = Number(carro?.km || 0);

    const atendeTexto =
      !termo ||
      [nome, marca, observacoes].some((valor) => valor.includes(termo));

    const atendeMarca =
      !marcaFiltro || String(carro?.marca || '').toLowerCase() === marcaFiltro.toLowerCase();

    const atendeAno = !anoFiltro || ano === anoValue;
    const atendeAnoMin = Number.isNaN(anoMinValue) || ano >= anoMinValue;
    const atendeAnoMax = Number.isNaN(anoMaxValue) || ano <= anoMaxValue;
    const atendeKmMax = Number.isNaN(kmMaxValue) || km <= kmMaxValue;
    const atendePrecoMin =
      Number.isNaN(precoMinValue) || Number(carro?.preco || 0) >= precoMinValue;
    const atendePrecoMax =
      Number.isNaN(precoMaxValue) || Number(carro?.preco || 0) <= precoMaxValue;

    return (
      atendeTexto &&
      atendeMarca &&
      atendeAno &&
      atendeAnoMin &&
      atendeAnoMax &&
      atendeKmMax &&
      atendePrecoMin &&
      atendePrecoMax
    );
  });

  const sorted = [...filtrados].sort((a, b) => {
    switch (sortBy) {
      case 'preco-desc':
        return Number(b?.preco || 0) - Number(a?.preco || 0);
      case 'ano-desc':
        return getVehicleYear(b) - getVehicleYear(a);
      case 'ano-asc':
        return getVehicleYear(a) - getVehicleYear(b);
      case 'nome-asc':
        return String(a?.nome || '').localeCompare(String(b?.nome || ''), 'pt-BR');
      case 'preco-asc':
      default:
        return Number(a?.preco || 0) - Number(b?.preco || 0);
    }
  });

  return sorted;
}
