import { loja } from '../config/loja';

export function buildWhatsAppLink(carro) {
  const nome = carro?.nome || 'veículo';
  const valor = carro?.preco != null ? `R$ ${Number(carro.preco).toLocaleString('pt-BR')}` : 'valor sob consulta';
  const mensagem = `Olá! Tenho interesse no ${nome} (${valor}). Poderia me passar mais informações?`;
  const encoded = encodeURIComponent(mensagem);
  return `https://wa.me/${loja.whatsapp}?text=${encoded}`;
}
