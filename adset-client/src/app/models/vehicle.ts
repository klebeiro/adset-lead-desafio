export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  km: number;
  cor: string;
  preco: number;
  quantidadeFotos: number;
  opcionais: string[];
  imagemUrl?: string;
}