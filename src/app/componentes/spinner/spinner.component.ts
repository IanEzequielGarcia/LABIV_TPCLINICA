import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  mostrar = true;
  //estaCargando = this.servicioSpinner.estaCargando;
  constructor(private servicioSpinner:SpinnerService) {
    //console.log(this.estaCargando);
    this.mostrarAlCargar();
  }

  mostrarAlCargar(){
    this.servicioSpinner.mostrar();
    setTimeout(()=>{
      this.servicioSpinner.esconder();
      this.mostrar = false;
    },2000);
  }
  ngOnInit(): void {
  }

}
