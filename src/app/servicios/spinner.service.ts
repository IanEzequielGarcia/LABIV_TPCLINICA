import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  estaCargando = new Subject<boolean>();
  mostrar(){
    this.estaCargando.next(true);
  }
  esconder(){
    this.estaCargando.next(false);
  }
  constructor() { }
}
