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
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from './shared/spinner.interceptor';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { PerfilRoutingModule } from './componentes/perfil/perfil-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformesComponent } from './componentes/informes/informes.component';
import { NgChartsModule } from 'ng2-charts';
import { PerfilModule } from './componentes/perfil/perfil.module';
import { OscurecerFondoDirective } from './directives/oscurecer-fondo.directive';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export function HttpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    SpinnerComponent,
    UsuariosComponent,
    NavbarComponent,
    SolicitarTurnoComponent,
    TurnosComponent,
    InformesComponent,
    OscurecerFondoDirective,
    EncuestaComponent
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
    BrowserAnimationsModule,
    NgChartsModule,
    PerfilModule,
    TranslateModule.forRoot({  
      loader: {  
        provide: TranslateLoader,  
        useFactory: HttpTranslateLoader,  
        deps: [HttpClient]  
        }  
      })  
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,useClass:SpinnerInterceptor,multi:true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
