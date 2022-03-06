import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/shared/image.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  imgSrc!: string;
  selectedImage: any = null;
  isSubmitted!: boolean;

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    imgUrl: new FormControl('', Validators.required),
    category: new FormControl('')
  })

  constructor(private storage: AngularFireStorage, private service: ImageService) {}

  ngOnInit(): void {
    this.resetForm();
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/upload.png';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue: any) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.isSubmitted = false;
      this.storage.upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imgUrl'] = url;
            this.service.insertImageDetails(formValue);
            this.resetForm();
          })
        })
        ).subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls']
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: '',
      imgUrl: '',
      category: ''
    });
    this.imgSrc = '/assets/img/upload.png';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}
