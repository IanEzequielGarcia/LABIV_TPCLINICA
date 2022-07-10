import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { PipeFiltroPipe } from 'src/app/pipes/pipe-filtro.pipe';
import { ElementoNocheDirective } from 'src/app/directives/elemento-noche.directive';
import { EspecialistaPipePipe } from 'src/app/pipes/especialista-pipe.pipe';
import { PacientePipePipe } from 'src/app/pipes/paciente-pipe.pipe';
import { BotonGorditoDirective } from 'src/app/directives/boton-gordito.directive';



@NgModule({
  declarations: [MisTurnosComponent,MiPerfilComponent,PipeFiltroPipe,ElementoNocheDirective,EspecialistaPipePipe,PacientePipePipe,BotonGorditoDirective],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[EspecialistaPipePipe,PacientePipePipe,PipeFiltroPipe]
})
export class PerfilModule { }
