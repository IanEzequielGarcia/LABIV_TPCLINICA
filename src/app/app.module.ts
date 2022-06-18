import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { provideStorage } from '@angular/fire/storage';
import { provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from './shared/spinner.interceptor';
import { RegistroEspecialistaComponent } from './componentes/registro-especialista/registro-especialista.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { PerfilRoutingModule } from './componentes/perfil/perfil-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    SpinnerComponent,
    RegistroEspecialistaComponent,
    UsuariosComponent,
    NavbarComponent,
    SolicitarTurnoComponent,
    TurnosComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideStorage(()=>getStorage()),
    NgxCaptchaModule,
    PerfilRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,useClass:SpinnerInterceptor,multi:true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
