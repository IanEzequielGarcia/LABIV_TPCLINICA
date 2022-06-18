import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { time } from 'console';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {
  pasoSwitch=1;
  turno={
    especialidad:"",
    especialista:"",
    paciente:"",
    fecha:"",
    hora:"",
    resena:"",
    estado: "",
    calificacion: "",
  }
  especialidadesList: any[]=[];
  especialistaList: any[]=[];
  pacienteList:any[]=[];
  usuario:any;
  esPaciente=false;
  especialista:any=null;
    registroTurnoForm = new FormGroup({
    especialidad : new FormControl('',[Validators.required]),
    especialista : new FormControl('',[Validators.required]),
    turno : new FormControl('',[Validators.required]),
    fecha : new FormControl('',[Validators.required]),
    hora : new FormControl('',[Validators.required,Validators.minLength(4)]),
  },{validators:this.HoraValidator('hora')},
  );
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
    console.log((document.getElementById('fecha') as HTMLInputElement).value);
  }
  MaximaHora()
  {
    this.getEspecialistas(this.registroTurnoForm.get('especialista')?.value);
    //console.log(this.especialista);
    //this.registroTurnoForm.get('especialista')?

    (document.getElementById('hora') as HTMLInputElement).value;
    (document.getElementById('hora') as HTMLInputElement).value;
  }
  HoraValidator(controlHora:string):ValidatorFn{
    return(control:AbstractControl):ValidationErrors|null =>{
      const formGroup= control as FormGroup
      const hora= formGroup.get(controlHora)?.value;
      //console.log(this.especialista);
      if(this.especialista!=null)
      {
        let horaMin=Date.parse(`01/01/2011 ${this.especialista.data.especialista.horaMin}`);
        let horaMax=Date.parse(`01/01/2011 ${this.especialista.data.especialista.horaMax}`);
        let horaAux=Date.parse(`01/01/2011 ${hora}`);
        console.log("hora min: "+horaMin+" hora max: "+horaMax);
        console.log("hora elegida"+horaAux);
        if(horaAux>=horaMin&&horaAux<=horaMax)
        {
          //console.log("hora min: "+this.especialista.data.especialista.horaMin+" hora max: "+this.especialista.data.especialista.horaMax);
          //console.log("hora elegida"+hora);
          console.log("entro");
          return null;
        }else{
          return{errorHorasMaxMin:true}
        }
      }else{
        return{errorHorasMaxMin:true};
      }
    }
  }
  getEspecialidad(){
    this.especialidadesList=[];
    this.firestore.getCollection("especialidades").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      this.especialidadesList.push(dataAux);
    })
  });
  }
  getEspecialistas(especialistaId?:string){
    this.especialistaList=[];
    this.firestore.getCollection("especialistas").then((data)=>{
      data.forEach((dataAux:any)=>{
        console.log(dataAux);
      if(especialistaId!=undefined&&dataAux.id==especialistaId)
      {
        console.log(dataAux);
        this.especialista=dataAux;
      }
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
    //this.firestore.AñadirColeccion(this.turno,"turnos");
    
  }
  SeleccionarPaciente(paciente:any){
    this.turno.paciente=paciente;
  }
  SeleccionarEspecialistas(data:any){
    this.registroTurnoForm.get('especialista')?.setValue(data);
    this.pasoSwitch=3;
  }
  SeleccionarEspecialidad(data:any){
    this.registroTurnoForm.get('especialidad')?.setValue(data);
    this.pasoSwitch=2;
    //this.registroTurnoForm.setValue('especialidad',)
    //this.turno.paciente=data;
  }
}
