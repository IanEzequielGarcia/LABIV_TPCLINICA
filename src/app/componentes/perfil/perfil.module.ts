import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';


@NgModule({
  declarations: [MisTurnosComponent,MiPerfilComponent],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class PerfilModule { }
