import type { FaixaEtaria } from '../types/faixasEtarias';
import type { FaixaEtariaId } from '../types/conteudo';

export function calcularIdadeEmAnos(dataNascimentoIso: string): number {
  const nascimento = new Date(dataNascimentoIso);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversarioEsseAno =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversarioEsseAno) idade -= 1;
  return Math.max(idade, 0);
}

export function calcularFaixaPorIdade(
  dataNascimentoIso: string,
  faixas: FaixaEtaria[]
): FaixaEtariaId | null {
  if (faixas.length === 0) return null;
  const idade = calcularIdadeEmAnos(dataNascimentoIso);
  const faixaEncontrada = faixas.find((f) => idade >= f.idadeMin && idade <= f.idadeMax);
  if (faixaEncontrada) return faixaEncontrada.id;

  const ordenadas = [...faixas].sort((a, b) => a.idadeMin - b.idadeMin);
  if (idade < ordenadas[0].idadeMin) return ordenadas[0].id;
  return ordenadas[ordenadas.length - 1].id;
}
