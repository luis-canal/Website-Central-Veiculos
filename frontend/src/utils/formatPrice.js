export function formatPrice(value) {
  const numero = Number(value ?? 0);
  if (!Number.isFinite(numero)) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(numero);
}
