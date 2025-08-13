import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle, VehicleCreate, VehicleUpdate, VehicleStats, PackageTier } from '../models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private baseUrl = 'https://localhost:7216/api/vehicle';

  constructor(private http: HttpClient) {}

  private buildParams(filter?: any): HttpParams {
    let params = new HttpParams();
    if (!filter) return params;

    const yearMin = filter?.YearMin ?? filter?.anoMin;
    const yearMax = filter?.YearMax ?? filter?.anoMax;
    const priceRange = filter?.PriceRange ?? filter?.precoFaixa;
    const withPhotos = filter?.WithPhotos ?? filter?.comFotos;
    const color = filter?.Color ?? filter?.cor;
    const licensePlate = filter?.LicensePlate ?? filter?.placa;
    const brand = filter?.Brand ?? filter?.marca;
    const model = filter?.Model ?? filter?.modelo;
    const feature = filter?.Feature ?? filter?.opcional;

    if (yearMin != null) params = params.set('YearMin', String(yearMin));
    if (yearMax != null) params = params.set('YearMax', String(yearMax));
    if (priceRange) params = params.set('PriceRange', String(priceRange));
    if (withPhotos != null) params = params.set('WithPhotos', String(withPhotos));
    if (color) params = params.set('Color', String(color));
    if (licensePlate) params = params.set('LicensePlate', String(licensePlate));
    if (brand) params = params.set('Brand', String(brand));
    if (model) params = params.set('Model', String(model));
    if (feature) params = params.set('Feature', String(feature));

    return params;
  }

  get(filter: any): Observable<Vehicle[]> {
    const params = this.buildParams(filter);
    return this.http.get<Vehicle[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  create(body: VehicleCreate): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, body);
  }

  update(id: number, body: VehicleUpdate): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStats(filter?: any): Observable<VehicleStats> {
    const params = this.buildParams(filter);
    return this.http.get<VehicleStats>(`${this.baseUrl}/stats`, { params });
  }

  getColors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/colors`);
  }

  setPackage(id: number, icarrosTier: string | null, webmotorsTier: string | null) {
    const body = {
      iCarrosPackageTier: icarrosTier,
      webmotorsPackageTier: webmotorsTier
    };
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}/package`, body);
  }
}