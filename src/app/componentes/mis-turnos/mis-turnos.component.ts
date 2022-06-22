import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
//import Swal from 'sweetalert2/dist/sweetalert2.js'
@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {
  usuarioLoguado:any;
  listaTodosPacientes:any[]=[];
  tipoLogueado = "";
  esPaciente = false;
  estadoConsulta="";
  haTerminado=false;
  turnoList:any[]=[];
  pacienteHistoria:any;
  constructor(private firestore:FirebaseService) {

  }

  ngOnInit(): void {
    this.GetTipo();
    this.GetTurnos();
  }
  GetPacientes(id?:any)
  {
    this.firestore.getCollection("pacientes").then((adminsAux)=>{
      adminsAux.forEach((admins:any)=>{
        if(id!=undefined)
        {
          //console.log(id.data.data.paciente);
          //console.log(admins.id);
          if(admins.id==id.data.data.paciente)
          {
            console.log(admins);
            this.pacienteHistoria=admins;
            //this.listaTodosPacientes.push(admins);
          }
        }else{
          this.listaTodosPacientes.push(admins);
        }
      })
    });
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
  AceptarTurno(turno:any){
    console.log(turno);
    if(turno.data.data.estado=="")
    {
      turno.data.data.estado="aceptado";
      this.firestore.UpdateTurno(turno);
      this.GetTurnos();
    }else{
      Swal.fire(
        'ERROR',
        'ya no puede ser aceptado',
        'error'
      );
    }
  }
  MostrarResena(data:any){
    if(data.data.data.resena!="")
    {
      Swal.fire(data.data.data.resena)
    }else{
      Swal.fire(
        'ERROR',
        'no tiene ninguna reseña cargada',
        'error'
      );
    }
  }
  MostrarEncuesta(data:any){

  }
  CalificarAtencion(data:any){
    Swal.fire({
      title: "Cuentennos que penso del especialista",
      text: "Escriba abajo:",
      input: 'text',
      showCancelButton: true        
    }).then((result) => {
        if (result.value) {
          //let foo = prompt('Cuentenos porque cancela su turno');
          data.data.data.calificacion=result.value;
          //data.data.data.estado="finalizado";
          console.log(result.value);
          this.firestore.UpdateTurno(data);
          this.GetTurnos();
        }
    });
  }
  FinalizarTurno(turno:any){
    console.log(turno);
    if(turno.data.data.estado=="aceptado")
    {
      Swal.fire({
        title: "Deje un comentario y su diagnostico",
        text: "Escriba abajo:",
        input: 'text',
        showCancelButton: true        
    }).then((result) => {
        if (result.value) {
          //let foo = prompt('Cuentenos porque cancela su turno');
          turno.data.data.resena=result.value;
          turno.data.data.estado="finalizado";
          console.log(result.value);
          this.firestore.UpdateTurno(turno);
          this.GetTurnos();
        }
    });
      //turno.data.data.estado="finalizado";
      //this.firestore.UpdateTurno(turno);
      //this.GetTurnos();
    }else{
      Swal.fire(
        'ERROR',
        'ya no puede ser finalizado',
        'error'
      );
    }
  }
  RechazarTurno(turno:any){
    console.log(turno);
    if(turno.data.data.estado=="")
    {
      Swal.fire({
        title: "Cuentennos por que rechaza su turno",
        text: "Escriba abajo:",
        input: 'text',
        showCancelButton: true        
    }).then((result) => {
        if (result.value) {
          //let foo = prompt('Cuentenos porque cancela su turno');
          turno.data.data.resena=result.value;
          turno.data.data.estado="rechazado";
          console.log(result.value);
          this.firestore.UpdateTurno(turno);
          this.GetTurnos();
        }
    });
      //turno.data.data.estado="rechazado";
      //this.firestore.UpdateTurno(turno);
      //this.GetTurnos();
    }else{
      Swal.fire(
        'ERROR',
        'ya no puede ser finalizado',
        'error'
      );
    }
  }
  CargarHistoria(data:any){
    document.getElementById("inputHistoria")!.style.display="block";
    this.GetPacientes(data);
    //this.pacienteHistoria=data;
  }
  SubirHistoria()
  {
    let altura=  (<HTMLInputElement>document.getElementById("altura")).value
    let peso=  (<HTMLInputElement>document.getElementById("peso")).value
    let temperatura=  (<HTMLInputElement>document.getElementById("temperatura")).value
    let presion=  (<HTMLInputElement>document.getElementById("presion")).value

    let paciente={
      id:"",
      nombre:"",
      apellido:"",
      edad:"",
      dni:"",
      email:"",
      contrasena:"",
      obraSocial:"",
      fotoUno:"",
      fotoDos:"",
      tipo:"paciente",
      historia:{
        altura:"",
        peso:"",
        temperatura:"",
        presion:""
      }
    }
    console.log(this.pacienteHistoria);

    paciente.nombre=this.pacienteHistoria.data.paciente.nombre;
    paciente.apellido=this.pacienteHistoria.data.paciente.apellido;
    paciente.edad=this.pacienteHistoria.data.paciente.edad;
    paciente.dni=this.pacienteHistoria.data.paciente.dni;
    paciente.email=this.pacienteHistoria.data.paciente.email;
    paciente.contrasena=this.pacienteHistoria.data.paciente.contrasena;
    paciente.obraSocial=this.pacienteHistoria.data.paciente.obraSocial;
    paciente.fotoUno=this.pacienteHistoria.data.paciente.fotoUno;
    paciente.fotoDos=this.pacienteHistoria.data.paciente.email;
    paciente.tipo=this.pacienteHistoria.data.paciente.tipo;

    paciente.id=this.pacienteHistoria.id;
    paciente.historia.altura=altura;
    paciente.historia.peso=peso;
    paciente.historia.temperatura=temperatura;
    paciente.historia.presion=presion;
    //console.log(paciente.nombre);
    this.firestore.UpdatePaciente(paciente);
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
        if(!this.esPaciente)
        {
          if(this.usuarioLoguado.id==paciente.data.data.especialista)
          {
            this.estadoConsulta=paciente.data.data.estado;
            this.turnoList.push(paciente);
            console.log(paciente);
          }
        }else if(this.esPaciente&&this.usuarioLoguado.id==paciente.data.data.paciente){
          this.estadoConsulta=paciente.data.data.estado;
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
