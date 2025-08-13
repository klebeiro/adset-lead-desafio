import { PackageTier } from "../models";

export interface VehicleCreate {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage?: number;
  color: string;
  price: number;
  idICarrosPackageTier?: PackageTier;
  idWebmotorsPackageTier?: PackageTier;
  featureIds?: number[];
  photoUrls?: string[];
}