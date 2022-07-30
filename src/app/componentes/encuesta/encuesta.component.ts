import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {

  valorRapidez=5;
  usuario:any;
  constructor(public firestore:FirebaseService) {
    this.VerificarPaciente();
  }

  ngOnInit(): void {
  }
  ValorRapidez(valor:any)
  {
    this.valorRapidez=valor.value;
  }
  EnviarEncuesta()
  {
    let notas=(<HTMLInputElement>document.getElementById("notas")).value;
    let star=0;
    let aprobado=(<HTMLInputElement>document.getElementById("aprobado")).checked;
    let atencionExcelente=(<HTMLInputElement>document.getElementById("atencionExcelente")).checked;
    let atencionMedia=(<HTMLInputElement>document.getElementById("atencionMedia")).checked;
    let atencionMala=(<HTMLInputElement>document.getElementById("atencionMala")).checked;
    let starList= (document.getElementsByName('star'));
    let atencionList= (document.getElementsByName('atencion'));
    let atencion=0;

    for (let i = 0; i < starList.length; i++) {
      if((<HTMLInputElement>starList[i]).checked==true)
      {
        star=i;
      }
    }
    for (let i = 0; i < atencionList.length; i++) {
      if((<HTMLInputElement>atencionList[i]).checked==true)
      {
        atencion=i;
      }
    }
    let data={
      estrellas:"",
      notas:"",
      aprobado:"",
      atencion:"",
      rapidez:"",
      paciente:"",
    }
    data.notas=notas;
    data.atencion=atencion.toString();
    data.rapidez=this.valorRapidez.toString();
    switch(star)
    {
      case 4:
        star=1;
        break;
      case 3:
        star=2;
        break;
      case 2:
        star=3;
        break;
      case 1:
        star=4;
        break;
      case 0:
        star=5;
    }
    data.estrellas=star.toString();
    data.aprobado=String(aprobado);
    data.paciente=this.usuario.id;
    this.firestore.AñadirColeccion(data,"encuestas");
    Swal.fire(
      'Exito!',
      'encuesta añadido correctamente',
      'success'
    );
    console.log(data);
  }
  VerificarPaciente(){
    this.firestore.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.paciente.email)
        {
          this.usuario=paciente;
        }
      })
    })
  }
}
