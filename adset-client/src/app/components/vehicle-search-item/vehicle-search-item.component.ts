import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Vehicle } from 'src/app/models';
import { VehicleService } from 'src/app/services/vehicle.service';

type ICarrosTier = 'DiamanteFeirao' | 'Diamante' | 'Platinum';
type WebmotorsTier = 'Basico';

const ICarrosNumToStr: Record<number, ICarrosTier> = {
  0: 'DiamanteFeirao',
  1: 'Diamante',
  2: 'Platinum'
};
const WebmotorsNumToStr: Record<number, WebmotorsTier> = {
  0: 'Basico'
};

@Component({
  selector: 'app-vehicle-search-item',
  templateUrl: './vehicle-search-item.component.html',
  styleUrls: ['./vehicle-search-item.component.css']
})
export class VehicleSearchItemComponent implements OnInit, OnChanges {
  @Input() vehicle!: Vehicle;
  @Output() deleted = new EventEmitter<number>();

  isDeleting = false;
  isSavingTier = false;

  selectedICarrosTier: ICarrosTier | null = null;
  selectedWebmotorsTier: WebmotorsTier | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.syncSelectedFromVehicle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle']?.currentValue) {
      this.syncSelectedFromVehicle();
    }
  }

  private normalizeICarrosFromApi(val: any): ICarrosTier | null {
    if (val == null) return null;
    if (typeof val === 'string') return val as ICarrosTier;
    if (typeof val === 'number') return ICarrosNumToStr[val] ?? null;
    return null;
  }

  private normalizeWebmotorsFromApi(val: any): WebmotorsTier | null {
    if (val == null) return null;
    if (typeof val === 'string') return val as WebmotorsTier;
    if (typeof val === 'number') return WebmotorsNumToStr[val] ?? null;
    return null;
  }

  private syncSelectedFromVehicle() {
    this.selectedICarrosTier = this.normalizeICarrosFromApi(this.vehicle?.idICarrosPackageTier);
    this.selectedWebmotorsTier = this.normalizeWebmotorsFromApi(this.vehicle?.idWebmotorsPackageTier);
  }

  onToggleICarros(tier: ICarrosTier, checked: boolean) {
    const next = checked ? tier : null;
    this.onSelectICarrosTier(next);
  }

  onToggleWebmotors(tier: WebmotorsTier, checked: boolean) {
    const next = checked ? tier : null;
    this.onSelectWebmotorsTier(next);
  }

  onSelectICarrosTier(tier: ICarrosTier | null) {
    if (!this.vehicle?.id || this.isSavingTier) return;

    this.selectedICarrosTier = tier;

    this.isSavingTier = true;
    this.vehicleService.setPackage(this.vehicle.id, tier, this.selectedWebmotorsTier).subscribe({
      next: (updated) => {
        this.vehicle.idICarrosPackageTier = this.normalizeICarrosFromApi(updated.idICarrosPackageTier) as any;
        this.vehicle.idWebmotorsPackageTier = this.normalizeWebmotorsFromApi(updated.idWebmotorsPackageTier) as any;
        this.syncSelectedFromVehicle();
        this.isSavingTier = false;
      },
      error: (e) => {
        console.error(e);
        this.isSavingTier = false;
        const errors = e?.error?.errors;
        if (errors) {
          const flat = Object.entries(errors).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
          alert(`Falha ao salvar plano:\n${flat}`);
        } else {
          alert(e?.error?.detail || e?.message || 'Falha ao salvar plano.');
        }
        this.syncSelectedFromVehicle();
      }
    });
  }

  onSelectWebmotorsTier(tier: WebmotorsTier | null) {
    if (!this.vehicle?.id || this.isSavingTier) return;

    this.selectedWebmotorsTier = tier;

    this.isSavingTier = true;
    this.vehicleService.setPackage(this.vehicle.id, this.selectedICarrosTier, tier).subscribe({
      next: (updated) => {
        this.vehicle.idICarrosPackageTier = this.normalizeICarrosFromApi(updated.idICarrosPackageTier) as any;
        this.vehicle.idWebmotorsPackageTier = this.normalizeWebmotorsFromApi(updated.idWebmotorsPackageTier) as any;
        this.syncSelectedFromVehicle();
        this.isSavingTier = false;
      },
      error: (e) => {
        console.error(e);
        this.isSavingTier = false;
        const errors = e?.error?.errors;
        if (errors) {
          const flat = Object.entries(errors).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
          alert(`Falha ao salvar plano:\n${flat}`);
        } else {
          alert(e?.error?.detail || e?.message || 'Falha ao salvar plano.');
        }
        this.syncSelectedFromVehicle();
      }
    });
  }

  formatPrice(price?: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0);
  }

  formatKm(km?: number): string {
    return new Intl.NumberFormat('pt-BR').format(km || 0);
  }

  getOpcionaisText(): string {
    const list = this.vehicle?.features ?? [];
    if (!list.length) return 'Sem opcionais';
    const names = list.map(f => f.featureName || String(f.idFeature)).filter(Boolean) as string[];
    const count = names.length;
    if (count > 3) return `${count} opcionais`;
    return names.join(', ');
  }

  opcionaisCount(): number {
    return Array.isArray(this.vehicle?.features) ? this.vehicle!.features.length : 0;
  }

  get photosCount(): number {
    const arr = this.vehicle?.photos ?? [];
    return Array.isArray(arr) ? arr.length : 0;
  }

  get mainPhotoUrl(): string {
    return this.vehicle?.photos?.[0]?.url || '../../../assets/image-placeholder.webp';
  }

  onDelete() {
    if (!this.vehicle?.id || this.isDeleting) return;

    const ok = confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.');
    if (!ok) return;

    this.isDeleting = true;
    this.vehicleService.delete(this.vehicle.id).subscribe({
      next: () => {
        this.isDeleting = false;
        window.location.reload();
      },
      error: (e) => {
        console.error(e);
        this.isDeleting = false;
        alert(e?.error?.detail || e?.error || 'Falha ao excluir veículo.');
      }
    });
  }
}