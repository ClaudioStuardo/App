import { Component, OnInit } from '@angular/core';
import { SubirImagenService } from '../../services/subir-imagen/subir-imagen.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public _subirImagenService: SubirImagenService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }

  subirImagen() {
    this._subirImagenService.subirImagen( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
          .then( resp  => {
            this._modalUploadService.notificacion.emit( resp );
            this.cerrarModal();
          })
          .catch( err => {
            console.log('Error en la carga...');
          });
  }

  seleccionImage( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire(
        'Sólo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;

  }

}
