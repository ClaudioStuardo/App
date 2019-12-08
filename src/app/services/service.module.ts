import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './usuario/usuario.service';
import { SubirImagenService } from './subir-imagen/subir-imagen.service';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UsuarioService,
    SubirImagenService,
    ModalUploadService
  ]
})
export class ServiceModule { }
