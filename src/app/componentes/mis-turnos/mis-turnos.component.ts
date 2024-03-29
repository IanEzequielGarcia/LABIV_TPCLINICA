import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  constructor(private firestore:FirebaseService,
              public translate:TranslateService) {
    translate.addLangs(['en', 'es','pr']);  
    translate.setDefaultLang('es');  
  }
  cambiarLenguaje(lenguaje:string){
    this.translate.use(lenguaje);
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
          //console.log(result.value);
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
    this.GetTurnos(data);
    //this.GetPacientes(data);
    //this.pacienteHistoria=data;
  }
  SubirHistoria()
  {
    let altura=  (<HTMLInputElement>document.getElementById("altura")).value;
    let peso=  (<HTMLInputElement>document.getElementById("peso")).value;
    let temperatura=  (<HTMLInputElement>document.getElementById("temperatura")).value;
    let presion=  (<HTMLInputElement>document.getElementById("presion")).value;
    let clave1=  (<HTMLInputElement>document.getElementById("clave1")).value;
    let valor1=  (<HTMLInputElement>document.getElementById("valor1")).value;
    let clave2=  (<HTMLInputElement>document.getElementById("clave2")).value;
    let valor2=  (<HTMLInputElement>document.getElementById("valor2")).value;
    let clave3=  (<HTMLInputElement>document.getElementById("clave3")).value;
    let valor3=  (<HTMLInputElement>document.getElementById("valor3")).value;
    let clave4=  (<HTMLInputElement>document.getElementById("clave4")).value;
    let valor4=  (<HTMLInputElement>document.getElementById("valor4")).value == null ? "": (<HTMLInputElement>document.getElementById("valor4")).value;
    let clave5=  (<HTMLInputElement>document.getElementById("clave5")).value == null ? "": (<HTMLInputElement>document.getElementById("clave5")).value;
    let valor5=  (<HTMLInputElement>document.getElementById("valor5")).value == null ? "": (<HTMLInputElement>document.getElementById("valor5")).value;
    let clave6=  (<HTMLInputElement>document.getElementById("clave6")).value == null ? "": (<HTMLInputElement>document.getElementById("clave6")).value;
    let valor6=  (<HTMLInputElement>document.getElementById("valor6")).checked == null ? "": (<HTMLInputElement>document.getElementById("valor6")).checked;
    console.log(clave1);
    console.log(valor1);
    console.log(clave2);
    console.log(valor2);
    let turno={
      id:"",
      especialista:"",
      paciente: "",
      fecha: "",
      hora: "",
      especialidad: "",
      estado: "",
      calificacion: "",
      resena:"",
      historia:{
        altura:"",
        peso:"",
        temperatura:"",
        presion:"",
      },
      custom:{
        custom1:{clave:"",valor:""},
        custom2:{clave:"",valor:""},
        custom3:{clave:"",valor:""},
        custom4:{clave:"",valor:""},
        custom5:{clave:"",valor:""},
        custom6:{clave:"",valor:""},
      }
  }

    /*let paciente={
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
    }*/
    //console.log(this.pacienteHistoria.data.data);

    turno.especialista=this.pacienteHistoria.data.data.especialista;
    turno.paciente=this.pacienteHistoria.data.data.paciente;
    turno.calificacion=this.pacienteHistoria.data.data.calificacion;
    turno.especialidad=this.pacienteHistoria.data.data.especialidad;
    turno.estado=this.pacienteHistoria.data.data.estado;
    turno.fecha=this.pacienteHistoria.data.data.fecha;
    turno.hora=this.pacienteHistoria.data.data.hora;
    turno.resena=this.pacienteHistoria.data.data.resena;

    turno.id=this.pacienteHistoria.id;
    turno.historia.altura=altura;
    turno.historia.peso=peso;
    turno.historia.temperatura=temperatura;
    turno.historia.presion=presion;

    turno.custom.custom1={clave:clave1,valor:valor1};
    turno.custom.custom2={clave:clave2,valor:valor2};
    turno.custom.custom3={clave:clave3,valor:valor3};
    turno.custom.custom4={clave:clave4,valor:valor4};
    turno.custom.custom5={clave:clave5,valor:valor5};
    turno.custom.custom6={clave:clave6,valor:valor6.toString()};

    /*
      custom1:{clave1:valor1},
      custom2:{clave2:valor2},
      custom3:{clave3:valor3},
      custom4:{clave4:valor4},
      custom5:{clave5:valor5},
      custom6:{clave6:valor6},
    */
    //console.log(paciente.nombre);
    console.log(turno);
    this.firestore.UpdateTurno(turno);
    Swal.fire(
      'Exito!',
      'Historia añadida correctamente',
      'success'
    );
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
  GetTurnos(idPaciente?:any){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        if(idPaciente!=undefined)
        {
          //console.log(paciente);
          //console.log(idPaciente);
          if(paciente.id==idPaciente.id)
          {
            this.pacienteHistoria=idPaciente;
            //console.log("aaa");
            //console.log(this.pacienteHistoria);
          }
        }
        if(!this.esPaciente)
        {
          if(this.usuarioLoguado.id==paciente.data.data.especialista)
          {
            this.estadoConsulta=paciente.data.data.estado;
            this.turnoList.push(paciente);
            //console.log(paciente);
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
