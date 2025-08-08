import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSearchComponent } from './components/vehicle-search/vehicle-search.component';
import { VehicleRegistrationFormComponent } from './components/vehicle-registration-form/vehicle-registration-form.component';

const routes: Routes = [
  { 
  path: 'vehicle',
  component: VehicleSearchComponent,
  data: { title: 'Buscar veículo' }
  },
  { 
    path: 'vehicle/register', 
    component: VehicleRegistrationFormComponent,
    data: { title: 'Cadastrar veículo' }
  },
  { 
    path: '**', 
    component: VehicleSearchComponent,
    data: { title: 'Buscar veículo' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
