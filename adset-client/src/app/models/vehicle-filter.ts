export interface VehicleFilter {
  placa?: string;
  marca?: string;
  modelo?: string;
  anoMin?: number;
  anoMax?: number;
  precoFaixa?: '10-50' | '50-90' | '90+';
  comFotos?: boolean;
  cor?: string;
  opcional?: string;
}