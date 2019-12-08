import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SliderComponent } from './components/slider/slider.component';
import { HomeComponent } from './components/home/home.component';
import { ModalUploadComponent } from './components/modal-upload/modal-upload.component';
import { ServiceModule } from './services/service.module';
import { PipesModule } from './pipes/pipes.module';
import { APP_ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SliderComponent,
    HomeComponent,
    ModalUploadComponent
  ],
  imports: [
    BrowserModule,
    ServiceModule,
    PipesModule,
    APP_ROUTES,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
