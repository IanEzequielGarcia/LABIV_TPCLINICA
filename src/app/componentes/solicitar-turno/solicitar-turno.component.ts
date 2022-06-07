import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {
    registroTurnoForm = new FormGroup({
    especialidad : new FormControl('',[Validators.required]),
    especialista : new FormControl('',[Validators.required]),
    turno : new FormControl('',[Validators.required]),
    fecha : new FormControl('',[Validators.required]),
    hora : new FormControl('',[Validators.required,Validators.minLength(4)]),
  });
  turno={
    especialidad:"",
    especialista:"",
    paciente:"",
    fecha:"",
    hora:"",
    reseña:"",
  }
  especialidadesList: any[]=[];
  especialistaList: any[]=[];
  pacienteList:any[]=[];
  usuario:any;
  esPaciente=false;
  constructor(public firestore:FirebaseService) {
    this.getEspecialistas();
    this.getEspecialidad();
    this.getPacientes();
    this.VerificarPaciente();
  }

  ngOnInit(): void {
    //this.MaxmimoTurno();
  }
  MaxmimoTurno(){
    let numWeeks = 2;
    let now = new Date();
    //now.setDate(now.getDate() + numWeeks * 7);
    (document.getElementById('fecha') as HTMLInputElement).max = `${now.getFullYear()}-${now.getMonth()+1}-${now.getUTCDay()+14}`;
    (document.getElementById('fecha') as HTMLInputElement).min = `${now.getFullYear()}-${now.getMonth()+1}-${now.getUTCDay()}`;

    console.log(`${now.getFullYear()}-${now.getMonth()+1}-${now.getUTCDay()+14}`);
  }
  getEspecialidad(){
    this.especialidadesList=[];
    this.firestore.getCollection("especialidades").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      this.especialidadesList.push(dataAux.data.data);
    })
  });
  }
  getEspecialistas(){
    this.especialistaList=[];
    this.firestore.getCollection("especialistas").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      this.especialistaList.push(dataAux);
    })
  });
  }
  getPacientes(){
    this.pacienteList=[];
    this.firestore.getCollection("pacientes").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      this.pacienteList.push(dataAux);
    })
  });
  }
  VerificarPaciente(){
    this.firestore.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.paciente.email)
        {
          console.log("paciente");
          this.usuario=paciente;
          console.log(this.usuario);
          this.esPaciente=true;
        }
      })
    })
    if(this.usuario==null){
      this.firestore.getCollection("admins").then(async (pacientesAux)=>{
        let usuario = await this.firestore.InfoUsuario();
        //console.log(usuario);
        pacientesAux.forEach((paciente:any)=>{
          if(usuario?.email==paciente.data.admin.email)
          {
            console.log("admin");
            this.usuario=paciente;
            console.log(this.usuario);
          }
        })
      })
    }
  }
  AgregarTurno(){
    this.turno.especialidad=this.registroTurnoForm.get('especialidad')?.value;
    this.turno.especialista=this.registroTurnoForm.get('especialista')?.value;
    this.turno.fecha=this.registroTurnoForm.get('fecha')?.value;
    this.turno.hora=this.registroTurnoForm.get('hora')?.value;
    if(this.esPaciente){
      this.turno.paciente=this.usuario.id;
    }
    //this.turno.tipo="turno";
    console.log(this.turno);
    this.firestore.AñadirColeccion(this.turno,"turnos");
    //his.firestore.RegisterUser(this.turno.email,this.turno.contrasena);
  }
  SeleccionarPaciente(paciente:any){
    console.log("aaaaaaaaa");
    console.log(paciente);
    this.turno.paciente=paciente;
  }
}
