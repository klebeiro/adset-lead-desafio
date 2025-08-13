import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle, VehicleStats } from '../../models';

@Component({
  selector: 'app-vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.css']
})
export class VehicleSearchComponent implements OnInit {
  vehicles: Vehicle[] = [];
  stats?: VehicleStats;
  colors: string[] = [];

  LicensePlate?: string;
  Brand?: string;
  Model?: string;
  YearMin?: number;
  YearMax?: number;
  PriceRange?: '10-50' | '50-90' | '90+';
  WithPhotos?: boolean;
  Feature?: string;
  Color?: string;

  years = (() => {
    const current = new Date().getFullYear();
    const start = 2000;
    return Array.from({ length: current - start + 1 }, (_, i) => start + i);
  })();

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadColors();
    this.loadStats();
    this.search();
  }

  search(): void {
    const filter = {
      LicensePlate: this.LicensePlate || undefined,
      Brand: this.Brand || undefined,
      Model: this.Model || undefined,
      YearMin: this.YearMin ?? undefined,
      YearMax: this.YearMax ?? undefined,
      PriceRange: this.PriceRange || undefined,
      WithPhotos: this.WithPhotos,
      Color: this.Color || undefined,
      Feature: this.Feature || undefined
    };
    this.vehicleService.get(filter as any).subscribe(v => {
      this.vehicles = v;
      this.loadStats();
    });
  }

  clear(): void {
    this.LicensePlate = undefined;
    this.Brand = undefined;
    this.Model = undefined;
    this.YearMin = undefined;
    this.YearMax = undefined;
    this.PriceRange = undefined;
    this.WithPhotos = undefined;
    this.Feature = undefined;
    this.Color = undefined;
    this.search();
  }

  loadColors(): void {
    this.vehicleService.getColors().subscribe(c => {
      this.colors = c;
    });
  }

  loadStats(): void {
    this.vehicleService.getStats().subscribe(s => (this.stats = s));
  }

  pad3(n?: number): string {
    if (n == null) return '000';
    return n.toString().padStart(3, '0');
  }
}