export class Usuario {

    constructor(
        public nombreUsuario: string,
        public correo: string,
        public password: string,
        public imagen?: string,
        public activo?: boolean,
        public _id?: string
    ) { }

}
