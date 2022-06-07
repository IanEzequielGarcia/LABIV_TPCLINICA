import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {
  usuarioLoguado:any;
  tipoLogueado = "";
  esPaciente = false;
  turnoList:any[]=[];
  constructor(private firestore:FirebaseService) {

  }

  ngOnInit(): void {
    this.GetTipo();
    this.GetTurnos();
  }
  CancelarTurno(data:any){
    console.log(data);
    this.firestore.BorrarDatoColeccion("turnos",data.id);
    this.GetTurnos();
  }
  AceptarTurno(turno:any){

  }
  RechazarTurno(turno:any){
    
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
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        if(!this.esPaciente)
        {
          if(this.usuarioLoguado.id==paciente.data.data.especialista)
          {
            this.turnoList.push(paciente);
            console.log(paciente);
          }
        }else{
          this.turnoList.push(paciente);
          console.log(paciente);
        }
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
  async GetTipo(){
    this.firestore.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.paciente.email)
        {
          this.tipoLogueado="paciente";
          this.esPaciente=true;
          console.log("paciente");
          this.usuarioLoguado=paciente;
        }
      })
    })
    this.firestore.getCollection("especialistas").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.especialista.email)
        {
          this.tipoLogueado="especialista";
          console.log("especialista");
          this.usuarioLoguado=paciente;
        }
      })
    })
    if(this.tipoLogueado==""){
      console.log("ninguno/admin");
      this.tipoLogueado="ninguno";
    }
  }
}
