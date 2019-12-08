import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/imagen';

    if ( !img ) {
      return url + '/usuarios/xxx';
    }

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    if (tipo === 'usuario') {
        url += '/usuarios/' + img;
    } else {
        url += '/usuarios/xxx';
    }

    return url;
  }

}
