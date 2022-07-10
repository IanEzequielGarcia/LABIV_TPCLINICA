import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseService } from '../servicios/firebase.service';

@Pipe({
  name: 'pacientePipe'
})
export class PacientePipePipe implements PipeTransform {
  constructor(private firestore:FirebaseService)
  {
  }

  transform(id: number): string 
  {
    for (const pacientesAux of this.firestore.coleccionPacientes) {
      //console.log(pacientesAux);
      if(id==pacientesAux.id)
      {
        return pacientesAux.data.paciente.nombre+" "+pacientesAux.data.paciente.apellido;
      }   
    }
    return '';
  }
}
