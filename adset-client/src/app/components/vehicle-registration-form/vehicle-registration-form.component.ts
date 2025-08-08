import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-registration-form',
  templateUrl: './vehicle-registration-form.component.html',
  styleUrls: ['./vehicle-registration-form.component.css']
})
export class VehicleRegistrationFormComponent {
  photoPreviews: string[] = [];
photos: File[] = [];

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);
  const total = this.photoPreviews.length + files.length;

  if (total > 15) {
    alert('Você pode enviar no máximo 15 fotos.');
    return;
  }

  for (let file of files) {
    if (this.photoPreviews.length >= 15) break;
    this.photos.push(file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

    input.value = '';
  }

  removePhoto(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
  }
}
