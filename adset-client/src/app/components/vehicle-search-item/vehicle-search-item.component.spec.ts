import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSearchItemComponent } from './vehicle-search-item.component';

describe('VehicleSearchItemComponent', () => {
  let component: VehicleSearchItemComponent;
  let fixture: ComponentFixture<VehicleSearchItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSearchItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
