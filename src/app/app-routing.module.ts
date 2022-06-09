import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './componentes/mis-turnos/mis-turnos.component';
import { RegistroEspecialistaComponent } from './componentes/registro-especialista/registro-especialista.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { AdminGuardGuard } from './guards/admin-guard.guard';

const routes: Routes = [
  {
    path: 'bienvenida',
    component:BienvenidaComponent
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'registro',
    component:RegistroComponent
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'login',
    component:LoginComponent
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'registroEspecialista',
    component:RegistroEspecialistaComponent
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'usuarios',
    component:UsuariosComponent,canActivate:[AdminGuardGuard]
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'misTurnos',
    component:MisTurnosComponent//,canActivate:[AdminGuardGuard]
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'miPerfil',
    component:MiPerfilComponent//,canActivate:[AdminGuardGuard]
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'solicitarTurno',
    component:SolicitarTurnoComponent//,canActivate:[AdminGuardGuard]
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'turnos',
    component:TurnosComponent,canActivate:[AdminGuardGuard]
    //loadChildren: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path:'**',
    redirectTo:'bienvenida'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
