import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseService } from '../servicios/firebase.service';

@Pipe({
  name: 'pipeFiltro'
})
export class PipeFiltroPipe implements PipeTransform {
  constructor(private firestore:FirebaseService)
  {

  }
  transform(value: any, args?: any): any {
    if(!value)return null;
    if(!args)return value;
    args = args.toLowerCase();
    return value.filter((data:any) =>{
        for (const pacientesAux of this.firestore.coleccionPacientes) {
          if(data.data.data.paciente==pacientesAux.id)
          {
            if(JSON.stringify(pacientesAux.data.paciente.nombre).toLowerCase().includes(args)||JSON.stringify(pacientesAux.data.paciente.apellido).toLowerCase().includes(args))
            {
              return JSON.stringify(pacientesAux.data.paciente.nombre).toLowerCase().includes(args)||JSON.stringify(pacientesAux.data.paciente.apellido).toLowerCase().includes(args);
            }
          }   
        }
        for (const especialistasAux of this.firestore.coleccionEspecialistas) {
          if(data.data.data.especialista==especialistasAux.id)
          {
            if(JSON.stringify(especialistasAux.data.especialista.nombre).toLowerCase().includes(args)||JSON.stringify(especialistasAux.data.especialista.apellido).toLowerCase().includes(args))
            {
              return JSON.stringify(especialistasAux.data.especialista.nombre).toLowerCase().includes(args)||JSON.stringify(especialistasAux.data.especialista.apellido).toLowerCase().includes(args);
            }
          }   
        }
        return JSON.stringify(data).toLowerCase().includes(args);
    });
}

}
