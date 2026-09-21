import faixasJson from '../data/raizes-faixas-etarias.json';
import type { FaixasEtariasData } from '../types/faixasEtarias';

const faixasEtarias = faixasJson as FaixasEtariasData;

export function useFaixasEtarias(): FaixasEtariasData {
  return faixasEtarias;
}
