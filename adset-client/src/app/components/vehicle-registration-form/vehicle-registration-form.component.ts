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

  priceInput = '';
  licensePlateInput = '';

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
    } else {
      this.onPriceInput('');
      this.onLicensePlateInput('');
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
          licensePlate: (v.licensePlate || '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
          mileage: v.mileage as any,
          color: v.color,
          price: v.price,
          featureIds: (v.features || []).map(f => f.idFeature),
          photoUrls: (v.photos || []).map(p => p.url)
        };
        this.photoUrls = [...(this.formModel.photoUrls || [])];

        this.onLicensePlateInput(this.formModel.licensePlate || '');
        this.onPriceInput(String((this.formModel.price ?? 0).toFixed(2)).replace('.', ',')); 

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

  onPriceInput(value: string) {
    const digits = (value || '').replace(/\D/g, ''); // só números
    const cents = Number(digits || '0');
    const numeric = cents / 100;

    this.formModel.price = numeric;
    this.priceInput = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numeric);
  }

  onPriceBlur() {
    const n = Number(this.formModel.price ?? 0);
    this.priceInput = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  onLicensePlateInput(value: string) {
    const raw = (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

    let masked = raw;
    if (raw.length >= 7) {
      const seven = raw.substring(0, 7);

      if (/^[A-Z]{3}[0-9]{4}$/.test(seven)) {
        masked = `${seven.substring(0,3)}-${seven.substring(3)}`; 
      } else if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(seven)) {
        masked = seven; 
      } else {
        masked = seven; 
      }
    }

    this.licensePlateInput = masked;
    this.formModel.licensePlate = raw;
  }

  private isValidPlate(raw: string): boolean {
    return /^[A-Z]{3}[0-9]{4}$/.test(raw) || /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(raw);
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
    const licensePlate = (this.formModel.licensePlate || '').toUpperCase();
    const color = this.formModel.color?.trim();
    const price = Number(this.formModel.price ?? 0);

    if (!brand) return 'Informe a marca.';
    if (!model) return 'Informe o modelo.';
    if (!year || isNaN(year)) return 'Informe um ano válido.';
    if (!licensePlate) return 'Informe a placa.';
    if (!this.isValidPlate(licensePlate)) return 'Placa inválida (use AAA-1234 ou AAA1A23).';
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

    return {
      brand: this.formModel.brand?.trim() || '',
      model: this.formModel.model?.trim() || '',
      year: Number(this.formModel.year ?? 0),
      licensePlate: (this.formModel.licensePlate || '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
      mileage: mileageValid ? Number(this.formModel.mileage) : undefined,
      color: this.formModel.color?.trim() || '',
      price: Number(this.formModel.price ?? 0),
      featureIds: [...(this.formModel.featureIds ?? [])],
      photoUrls: [...this.photoUrls],
    };
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
    this.priceInput = '';
    this.licensePlateInput = '';
  }
}