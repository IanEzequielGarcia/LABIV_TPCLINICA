import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
