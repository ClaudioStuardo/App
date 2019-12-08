import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import * as EmailValidator from 'email-validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  anio: number = new Date().getFullYear();

  usuarioDB: Usuario;
  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe(resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ){
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios( this.desde )
                .subscribe( (resp: any) => {
                  this.totalRegistros = resp.total;
                  this.usuarios = resp.usuarios;
                  this.cargando = false;
                });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
            .subscribe( (usuarios: Usuario[]) => {
              this.usuarios = usuarios;
              this.cargando = false;
            });
  }

  desactivarUsuario( usuario: Usuario ) {

    this.usuarioDB = usuario;

    if ( usuario.activo === false ) {
      Swal.fire(
        'Error al desactivar usuario',
        'El usuario ya está desactivo',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás desactivando a ' + usuario.nombreUsuario,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Desactivado',
          'Usuario desactivado',
          'success'
        );

        this.usuarioDB.activo = false;
        this._usuarioService.actualizarUsuario(usuario)
            .subscribe( resp => {
              this.cargarUsuarios();
            });
      }
    });
  }

  activarUsuario( usuario: Usuario ) {

    this.usuarioDB = usuario;

    if ( usuario.activo === true ) {
      Swal.fire(
        'Error al activar usuario',
        'El usuario ya está activo',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás activando a ' + usuario.nombreUsuario,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Activar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Activado',
          'Usuario activado',
          'success'
        );

        this.usuarioDB.activo = true;
        this._usuarioService.actualizarUsuario(usuario)
            .subscribe( resp => {
              this.cargarUsuarios();
            });
      }
    });
  }


  guardarUsuario( usuario: Usuario ) {
    usuario.nombreUsuario = usuario.nombreUsuario.split(' ').join('');
    usuario.correo = usuario.correo.split(' ').join('');
    if ( usuario.nombreUsuario.length < 3 ) {
      Swal.fire(
        'Error al guardar usuario',
        'El nombre requiere un mínimo de 3 caractéres',
        'error'
      );
      this.cargarUsuarios();
      return;
    }
    if ( !usuario.activo ) {
      Swal.fire(
        'Error al guardar usuario',
        'El usuario está desactivado',
        'error'
      );
      this.cargarUsuarios();
      return;
    }

    if (EmailValidator.validate(usuario.correo)) {
      usuario.correo = usuario.correo.toLowerCase();
      usuario.nombreUsuario = usuario.nombreUsuario.charAt(0).toUpperCase() + usuario.nombreUsuario.slice(1).toLowerCase();
      this._usuarioService.actualizarUsuario(usuario)
              .subscribe( resp => {
                this.cargarUsuarios();
              });
    } else {
      Swal.fire(
        'Error al guardar usuario',
        'Ingrese un correo válido',
        'error'
      );
      this.cargarUsuarios();
      return;
    }
  }

  borrarUsuario( usuario: Usuario ) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Te recomendamos desactivar la cuenta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar de todas formas'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario(usuario._id)
                .subscribe( resp => {
                  // console.log(resp);
                  this.cargarUsuarios();
                });
      }
    });
  }

  crearUsuario() {
    let info: string[];
    let nombre = '';
    let correo = '';
    let password = '';
    let cont = 0;
    let validar = '';

    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Continuar &rarr;',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Crear Usuario',
        text: 'Ingrese el nombre'
      },
      'Ingrese el correo',
      'Ingrese una contraseña'
    ]).then((result) => {
      if (result.value) {
        let answers = JSON.stringify(result.value);
        answers = answers.replace('"', '');
        answers = answers.replace('[', '');
        answers = answers.replace(']', '');
        info = answers.split(',');
        nombre = info[info.length - 3].replace('"', '');
        correo = info[info.length - 2].replace('"', '');
        password = info[info.length - 1].replace('"', '');
        Swal.fire({
          title: '¿Está todo correcto?',
          html: `
            <h4>Nombre</h4>
            <pre><code>${nombre.replace('"', '')}</code></pre>
            <br><h4>Correo</h4>
            <pre><code>${correo.replace('"', '')}</code></pre>
            <br><h4>Contraseña</h4>
            <pre><code>${password.replace('"', '')}</code></pre>
          `,
          confirmButtonText: 'Aceptar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        });
      }
      nombre = nombre.split(' ').join('');
      if (nombre.replace('"', '').length < 3) {
        validar = 'a';
      } else {
        nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        cont++;
      }

      correo = correo.split('"').join('');
      correo = correo.split(' ').join('');
      if (EmailValidator.validate(correo)) {
        cont++;
        correo = correo.toLowerCase();
      }
      if (!EmailValidator.validate(correo)) {
        validar = 'b';
      }

      password = password.split(' ').join('');
      if (password.replace('"', '').length < 3) {
        validar = 'c';
      } else {
        cont++;
      }

      if (cont === 3) {

        const newUsuario = new Usuario(nombre.replace('"', ''), correo.replace('"', ''), password.replace('"', ''));

        this._usuarioService.crearUsuario(newUsuario)
            .subscribe( () => this.cargarUsuarios() );

      } else {
        if ( validar === 'a' ) {
          Swal.fire(
            'Error al crear usuario',
            'El nombre requiere un mínimo de 3 caractéres',
            'error'
          );
        }
        if ( validar === 'b' ) {
          Swal.fire(
            'Error al crear usuario',
            'Ingrese un correo válido',
            'error'
          );
        }
        if ( validar === 'c' ) {
          Swal.fire(
            'Error al crear usuario',
            'La contraseña requiere un mínimo de 3 caractéres',
            'error'
          );
        }

      }

    });

  }

}
