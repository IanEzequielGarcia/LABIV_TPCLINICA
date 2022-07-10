import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseService } from '../servicios/firebase.service';

@Pipe({
  name: 'especialistaPipe'
})
export class EspecialistaPipePipe implements PipeTransform {
  constructor(private firestore:FirebaseService)
  {
  }

  transform(id: number): string 
  {
    for (const especialistasAux of this.firestore.coleccionEspecialistas) {
      if(id==especialistasAux.id)
      {
        return especialistasAux.data.especialista.nombre+" "+especialistasAux.data.especialista.apellido;
      }   
    }
    return '';
  }
}
