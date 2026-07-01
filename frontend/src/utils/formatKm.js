export function formatKm(value) {
  const numero = Number(value ?? 0);
  if (!Number.isFinite(numero)) return '0 km';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(numero)} km`;
}
