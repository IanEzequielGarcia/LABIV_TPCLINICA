import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {

  usuarioLoguado:any;
  tipoLogueado = "";
  esPaciente = false;
  estadoConsulta="";
  haTerminado=false;
  turnoList:any[]=[];
  constructor(private firestore:FirebaseService) {

  }

  ngOnInit(): void {
    this.GetTurnos();
  }
  CancelarTurno(data:any){
    console.log(data);
    if(data.data.data.estado=="")
    {
      Swal.fire({
        title: "Cuentennos por que cancela su turno",
        text: "Escriba abajo:",
        input: 'text',
        showCancelButton: true        
    }).then((result) => {
        if (result.value) {
          //let foo = prompt('Cuentenos porque cancela su turno');
          data.data.data.resena=result.value;
          data.data.data.estado="cancelado";
          console.log(result.value);
          this.firestore.UpdateTurno(data);
          this.GetTurnos();
        }
    });
    }else{
      Swal.fire(
        'ERROR',
        'ya no puede ser cancelado',
        'error'
      );
    }
  }
  Ordenar(ordenar:string){
    //console.log("aaaa");
    this.turnoList.sort((t1,t2)=>{
      //console.log("bbbb");
      if(ordenar=="especialidad")
      {
        if(t1.data.data.especialidad>t2.data.data.especialidad)
        {
          return 1;
        }else if(t1.data.data.especialidad<t2.data.data.especialidad){
          return -1
        }
        return 0;
      }else if(ordenar=="especialista"){
        if(t1.data.data.especialista>t2.data.data.especialista)
        {
          return 1;
        }else if(t1.data.data.especialista<t2.data.data.especialista){
          return -1
        }
        return 0;
      }else{
        if(t1.data.data.paciente>t2.data.data.paciente)
        {
          return 1;
        }else if(t1.data.data.paciente<t2.data.data.paciente){
          return -1;
        }
        return 0;
      }
      return 0;
    });
  }
  GetTurnos(){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        this.turnoList.push(paciente);
        console.log(paciente);
      })
    })
  }
  FiltrarEspecialidad(data:any){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        if(data.data.data.especialidad==paciente.data.data.especialidad)
        {
          this.turnoList.push(paciente);
          console.log(paciente);
        }
        
      })
    })
  }
  FiltrarEspecialista(data:any){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        if(data.data.data.especialista==paciente.data.data.especialista)
        {
          this.turnoList.push(paciente);
          console.log(paciente);
        }
        
      })
    })
  }
}
