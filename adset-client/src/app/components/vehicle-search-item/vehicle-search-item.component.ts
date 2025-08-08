import { Component, Input } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';

@Component({
  selector: 'app-vehicle-search-item',
  templateUrl: './vehicle-search-item.component.html',
  styleUrls: ['./vehicle-search-item.component.css']
})
export class VehicleSearchItemComponent {
  @Input() vehicle!: Vehicle;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatKm(km: number): string {
    return new Intl.NumberFormat('pt-BR').format(km);
  }

  getOpcionaisText(): string {
    if (!this.vehicle.opcionais || this.vehicle.opcionais.length === 0) {
      return 'Sem opcionais';
    }
    return this.vehicle.opcionais.length > 3 
      ? `${this.vehicle.opcionais.length} opcionais`
      : this.vehicle.opcionais.join(', ');
  }

}
