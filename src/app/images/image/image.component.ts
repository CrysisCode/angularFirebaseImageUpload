import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  imgSrc : string = '/assets/img/upload.png';
  selectedImage: any = null;
  isSubmitted : boolean = false;

  formTemplate = new FormGroup({
    caption : new FormControl('', Validators.required),
    category : new FormControl(''),
    imgUrl : new FormControl('', Validators.required)
  })

  constructor() { }

  ngOnInit(): void {
  }

  showPreview(event : any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      }
      else
      {
        this.imgSrc = '/assets/img/upload.png';
        this.selectedImage = null;
      }
  }

  onSubmit(formValue:any){
    this.isSubmitted = true;
  }

  get formControls() {
    return this.formTemplate['controls']
    }

}
