import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VehicleSearchComponent } from './components/vehicle-search/vehicle-search.component';
import { VehicleRegistrationFormComponent } from './components/vehicle-registration-form/vehicle-registration-form.component';
import { VehicleSearchItemComponent } from './components/vehicle-search-item/vehicle-search-item.component';

@NgModule({
  declarations: [
    AppComponent,
    VehicleSearchComponent,
    VehicleRegistrationFormComponent,
    VehicleSearchItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
