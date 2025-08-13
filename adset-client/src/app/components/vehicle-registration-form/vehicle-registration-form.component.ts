import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle, VehicleCreate, VehicleUpdate } from '../../models';
import { VehicleService } from 'src/app/services/vehicle.service';

type FeatureKey = 'AirConditioning' | 'Alarm' | 'Airbag' | 'ABSBrakes';

const FeatureIdMap: Record<FeatureKey, number> = {
  AirConditioning: 0,
  Alarm: 1,
  Airbag: 2,
  ABSBrakes: 3
};

@Component({
  selector: 'app-vehicle-registration-form',
  templateUrl: './vehicle-registration-form.component.html',
  styleUrls: ['./vehicle-registration-form.component.css']
})
export class VehicleRegistrationFormComponent implements OnInit {
  photoUrls: string[] = [];
  newPhotoUrl = '';

  formModel: Partial<VehicleCreate> = {
    brand: '',
    model: '',
    year: undefined,
    licensePlate: '',
    mileage: null as any,
    color: '',
    price: undefined,
    featureIds: [],
    photoUrls: []
  };

  readonly maxPhotos = 15;
  isSubmitting = false;
  colors: string[] = [];

  isEdit = false;
  vehicleId?: number;
  loading = false;

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadColors();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    if (this.isEdit) {
      this.vehicleId = Number(idParam);
      this.loadVehicle(this.vehicleId);
    }
  }

  private loadColors() {
    this.vehicleService.getColors().subscribe({
      next: (c) => (this.colors = c || []),
      error: (e) => console.error('Falha ao carregar cores', e)
    });
  }

  private loadVehicle(id: number) {
    this.loading = true;
    this.vehicleService.getById(id).subscribe({
      next: (v: Vehicle) => {
        this.formModel = {
          brand: v.brand,
          model: v.model,
          year: v.year,
          licensePlate: v.licensePlate,
          mileage: v.mileage as any,
          color: v.color,
          price: v.price,
          featureIds: (v.features || []).map(f => f.idFeature),
          photoUrls: (v.photos || []).map(p => p.url)
        };
        this.photoUrls = [...(this.formModel.photoUrls || [])];
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        alert(e?.error?.detail || 'Falha ao carregar veículo.');
        this.router.navigate(['/vehicle']);
      }
    });
  }

  hasFeature(name: FeatureKey): boolean {
    const id = FeatureIdMap[name];
    return (this.formModel.featureIds ?? []).includes(id);
  }

  toggleFeature(name: FeatureKey, checked: boolean) {
    const id = FeatureIdMap[name];
    const set = new Set<number>([...(this.formModel.featureIds ?? [])]);
    if (checked) set.add(id);
    else set.delete(id);
    this.formModel.featureIds = Array.from(set);
  }

  addPhotoUrl() {
    const url = (this.newPhotoUrl || '').trim();
    if (!url) return;

    if (this.photoUrls.length >= this.maxPhotos) {
      alert(`Você pode adicionar até ${this.maxPhotos} fotos.`);
      return;
    }

    const isValid =
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('/');

    if (!isValid) {
      alert('URL inválida. Use http://, https:// ou uma rota relativa iniciando com /.');
      return;
    }

    if (this.photoUrls.includes(url)) {
      alert('Essa URL já foi adicionada.');
      return;
    }

    this.photoUrls.push(url);
    this.newPhotoUrl = '';
  }

  removePhotoUrl(index: number) {
    if (index < 0 || index >= this.photoUrls.length) return;
    this.photoUrls.splice(index, 1);
  }

  private validateRequired(): string | null {
    const brand = this.formModel.brand?.trim();
    const model = this.formModel.model?.trim();
    const year = Number(this.formModel.year ?? 0);
    const licensePlate = this.formModel.licensePlate?.trim();
    const color = this.formModel.color?.trim();
    const price = Number(this.formModel.price ?? 0);

    if (!brand) return 'Informe a marca.';
    if (!model) return 'Informe o modelo.';
    if (!year || isNaN(year)) return 'Informe um ano válido.';
    if (!licensePlate) return 'Informe a placa.';
    if (!color) return 'Informe a cor.';
    if (!price || isNaN(price)) return 'Informe um preço válido.';
    return null;
  }

  private normalize(): VehicleCreate | VehicleUpdate {
    const mileageValid =
      this.formModel.mileage !== undefined &&
      this.formModel.mileage !== null &&
      (this.formModel.mileage as any) !== '' &&
      !isNaN(Number(this.formModel.mileage));

    const base = {
      brand: this.formModel.brand?.trim() || '',
      model: this.formModel.model?.trim() || '',
      year: Number(this.formModel.year ?? 0),
      licensePlate: (this.formModel.licensePlate?.trim() || '').toUpperCase(),
      mileage: mileageValid ? Number(this.formModel.mileage) : undefined,
      color: this.formModel.color?.trim() || '',
      price: Number(this.formModel.price ?? 0),
      featureIds: [...(this.formModel.featureIds ?? [])],
      photoUrls: [...this.photoUrls],
    };

    return base;
  }

  onSubmit() {
    if (this.isSubmitting) return;

    const err = this.validateRequired();
    if (err) {
      alert(err);
      return;
    }

    this.isSubmitting = true;
    const payload = this.normalize();

    if (this.isEdit && this.vehicleId) {
      this.vehicleService.update(this.vehicleId, payload as VehicleUpdate).subscribe({
        next: () => {
          alert('Veículo atualizado com sucesso!');
          this.isSubmitting = false;
          this.router.navigate(['/vehicle']);
        },
        error: (e) => {
          console.error(e);
          const msg = e?.error?.detail || 'Erro ao salvar alterações.';
          alert(msg);
          this.isSubmitting = false;
        }
      });
    } else {
      this.vehicleService.create(payload as VehicleCreate).subscribe({
        next: () => {
          alert('Veículo cadastrado com sucesso!');
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (e) => {
          console.error(e);
          const msg = e?.error?.detail || 'Erro ao cadastrar veículo.';
          alert(msg);
          this.isSubmitting = false;
        }
      });
    }
  }

  private resetForm() {
    this.formModel = {
      brand: '',
      model: '',
      year: undefined,
      licensePlate: '',
      mileage: null as any,
      color: '',
      price: undefined,
      featureIds: [],
      photoUrls: []
    };
    this.photoUrls = [];
    this.newPhotoUrl = '';
  }
}