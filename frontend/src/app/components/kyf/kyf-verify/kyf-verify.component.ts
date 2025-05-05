import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '@/app/models/userModel';
import { KyfService } from '@/app/services/kyf/kyf.service';
import { NotificationService } from '@/app/services/notification/notification.service';
import { HeaderComponent } from '../../header/header.component';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-kyf-verify',
  templateUrl: './kyf-verify.component.html',
  styleUrl: './kyf-verify.component.css',
  imports: [RouterModule, ReactiveFormsModule, HeaderComponent]
})
export class KyfVerifyComponent {
  loading = true;
  verifyingDocument = false;
  user?: UserModel = undefined;

  @ViewChild('frontDocument') frontDocument!: ElementRef<HTMLInputElement>;
  @ViewChild('backDocument') backDocument!: ElementRef<HTMLInputElement>;

  frontDocumentFile?: File = undefined;
  backDocumentFile?: File = undefined;

  frontDocumentFilePreview?: string = undefined;
  backDocumentFilePreview?: string = undefined;

  draggingFile = false;

  constructor(private kyfService: KyfService, private notificationService: NotificationService) {
    kyfService.loadingSubject.subscribe((isLoading) => {
      if (isLoading) {
        return;
      }  
      this.user = kyfService.userSubject.getValue();
      if (this.user) { 
        this.loading = false;
        return;
      }
      this.gotoMainPage();
    })
  }

  @HostListener('window:drop', ['$event'])
  @HostListener('window:dragover', ['$event'])
  preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  gotoMainPage() {
    window.location.href = "/kyf"
  }

  

  selectFrontDocument(fileEvent: DragEvent | Event | undefined = undefined) {
    if (!fileEvent) {
      this.frontDocument.nativeElement.click();
      return;
    }
    
    if (!(fileEvent instanceof DragEvent)) {
      const input = fileEvent.target as HTMLInputElement;
      const file = input.files ? input.files[0] : undefined;
      this.frontDocumentFile = file;
      this.frontDocumentFilePreview = file ? URL.createObjectURL(file) : undefined; 
      return;
    }

    if (!fileEvent.dataTransfer) {
      return;
    }

    if (fileEvent.dataTransfer?.files.length > 0) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(fileEvent.dataTransfer.files[0]);
      this.frontDocument.nativeElement.files = dataTransfer.files;
    }

  }

  selectBackDocument(fileEvent: DragEvent | Event | undefined = undefined) {
    if (!fileEvent) {
      this.backDocument.nativeElement.click();
      return;
    }

    if (!(fileEvent instanceof DragEvent)) {
      const input = fileEvent.target as HTMLInputElement;
      const file = input.files ? input.files[0] : undefined;
      this.backDocumentFile = input.files ? input.files[0] : undefined;
      this.backDocumentFilePreview = file ? URL.createObjectURL(file) : undefined; 
      return;
    }

    if (!fileEvent.dataTransfer) {
      return;
    }

    if (fileEvent.dataTransfer?.files.length > 0) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(fileEvent.dataTransfer.files[0]);
      this.backDocument.nativeElement.files = dataTransfer.files;
      
    }
  }

  submitDocuments() {
    if (!this.frontDocumentFile) {
      this.notificationService.show({title:"Erro ao enviar documentos", description:"Frente do documento faltando."});
      return;
    }
    if (!this.backDocumentFile) {
      this.notificationService.show({title:"Erro ao enviar documentos", description:"Verso do documento faltando."});
      return;
    }
    this.verifyingDocument = true;
    this.kyfService.submitDocument(this.frontDocumentFile, this.backDocumentFile).pipe(catchError(err => {
      this.notificationService.show({description: err.error, title: "Erro ao validar documento"});
      this.verifyingDocument = false;
      return throwError(() => err);
    })).subscribe((val) => {
      this.verifyingDocument = false;
      window.location.href = "/kyf/profile"
    });
  }
}
