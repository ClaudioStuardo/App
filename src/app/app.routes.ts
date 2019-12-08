import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';


const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        data: { titulo: 'Inicio' }
    },
    { path: '**', component: HomeComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
