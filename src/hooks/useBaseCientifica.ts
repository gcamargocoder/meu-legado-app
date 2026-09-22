import baseCientificaJson from '../data/base-cientifica.json';
import type { BaseCientificaData } from '../types/baseCientifica';

const baseCientifica = baseCientificaJson as BaseCientificaData;

export function useBaseCientifica(): BaseCientificaData {
  return baseCientifica;
}
