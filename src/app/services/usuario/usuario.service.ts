import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

// npm install --save sweetalert2
import Swal from 'sweetalert2';

// RXJS
import { map, catchError } from 'rxjs/operators';
import { throwError} from 'rxjs';

import { Router } from '@angular/router';
import { SubirImagenService } from '../subir-imagen/subir-imagen.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirImagenService: SubirImagenService
  ) {}

  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
              .pipe(map( (resp: any) => {

                Swal.fire(
                  'Usuario creado',
                  usuario.nombreUsuario,
                  'success'
                );
                return resp.usuario;
              }),
              catchError(err => {
                Swal.fire(
                  err.error.mensaje,
                  'Ya hay un usuario con ese nombre y/o correo',
                  'error'
                );
                return throwError(err.message);
              })
            );
  }

  actualizarUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id;

    return this.http.put( url, usuario )
              .pipe(map( (resp: any) => {

                Swal.fire(
                  'Usuario actualizado',
                  usuario.nombreUsuario,
                  'success'
                );
                return true;
              }),
              catchError(err => {
                Swal.fire(
                  err.error.mensaje,
                  'Ya hay un usuario con ese nombre  y/o correo',
                  'error'
                );
                return throwError(err.message);
              })
            );

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirImagenService.subirImagen( archivo, 'usuarios', id )
          .then( (resp: any) => {

            this.usuario.imagen = resp.usuario.imagen;
            Swal.fire(
              'Imagen Actualizada',
              this.usuario.nombreUsuario,
              'success'
            );

          })
          .catch( resp => {
            console.log( resp );
          }) ;

  }

  cargarUsuarios( desde: number = 0 ) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get( url );

  }

  buscarUsuarios( termino: string ) {

    const url = URL_SERVICIOS + '/busqueda/usuario/' + termino;
    return this.http.get( url )
        .pipe(map( (resp: any) => resp.usuarios));
  }

  desactivarUsuario( usuario: Usuario ) {
    const url = URL_SERVICIOS + '/usuario/' + usuario._id;

    return this.http.put( url, usuario )
              .pipe(map( (resp: any) => {
                return true;
              }));
  }

  borrarUsuario( id: string ) {
    const url = URL_SERVICIOS + '/usuario/' + id;

    return this.http.delete( url )
              .pipe(map( resp => {
                Swal.fire(
                  'Usuario borrado',
                  'El usuario a sido eliminado correctamente',
                  'success'
                );
                return true;
              }));
  }

}
