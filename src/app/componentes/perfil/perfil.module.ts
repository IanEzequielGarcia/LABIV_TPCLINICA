import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { PipeFiltroPipe } from 'src/app/pipes/pipe-filtro.pipe';
import { ElementoNocheDirective } from 'src/app/directives/elemento-noche.directive';


@NgModule({
  declarations: [MisTurnosComponent,MiPerfilComponent,PipeFiltroPipe,ElementoNocheDirective],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class PerfilModule { }
