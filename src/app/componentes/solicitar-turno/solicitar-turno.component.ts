import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { time } from 'console';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {
  pasoSwitch=0;
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
  turnoList:any[]=[];
  usuario:any;
  esPaciente=false;
  especialista:any=null;
    registroTurnoForm = new FormGroup({
    especialidad : new FormControl('',[Validators.required]),
    especialista : new FormControl('',[Validators.required]),
    fecha : new FormControl('',[Validators.required]),
    hora : new FormControl('',[Validators.required,Validators.minLength(4)]),
  },{validators:this.HoraValidator('hora')},
  );
  constructor(public firestore:FirebaseService) {
    this.getEspecialistas();
    this.getEspecialidad();
    this.getPacientes();
    this.getTurnos();
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
          let turnoAux2= JSON.stringify(this.turnoList);
          let turnoAux3= JSON.parse(turnoAux2);
          //console.log(turnoAux2);  // output: Apple Orange Banana
          //console.log(turnoAux3);  // output: Apple Orange Banana
          for(let i=0;i<turnoAux3.length;i++)
          {
            console.log(turnoAux3[i]);
            
            let horaAuxTurno=Date.parse(`01/01/2011 ${turnoAux3[i].data.data.hora}`);
            //let horaAux=Date.parse(`01/01/2011 ${hora}`);
            console.log("HORARIO EN USO "+horaAuxTurno);
            console.log("NUEVO TURNO "+horaAux);
            console.log("HORARIO EN USO MAX"+(horaAuxTurno+900000));

            if((horaAuxTurno+900000)>=horaAux&&horaAuxTurno<=horaAux)
            {
              console.log("fallo2");
              return{turnoSuperpuesto:true}
            }else{
              console.log("entro2");
              return null;
            }
          }
          /*this.turnoList.forEach((turno)=>{
            console.log(turno);
            let horaAuxTurno=Date.parse(`01/01/2011 ${turno.data.data.hora}`);
            //let horaAux=Date.parse(`01/01/2011 ${hora}`);
            if(horaAuxTurno>=(horaAux*30000)&&horaAuxTurno<=horaAux)
            {
              console.log("fallo2");
              return{turnoSuperpuesto:true}
            }else{
              console.log("entro2");
              return null;
            }
          }
          )*/
          return null;
        }else{
          return{errorHorasMaxMin:true}
        }

      }else{
        return{errorHorasMaxMin:true};
      }
    }
  }
  getTurnos(){
    this.especialidadesList=[];
    this.firestore.getCollection("turnos").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      this.turnoList.push(dataAux);
    })
  });
  }
  getEspecialidad(especialidadId?:string){
    this.especialidadesList=[];
    this.firestore.getCollection("especialidades").then((data)=>{
      data.forEach((dataAux:any)=>{
        console.log(especialidadId);
        if(especialidadId!=undefined)
        {
          if(especialidadId==dataAux.id)
          {
            this.getEspecialistas(undefined,dataAux.data.data);
            this.especialidadesList.push(dataAux);
            console.log(this.especialidadesList[0].data.data);
          }
        }else{
          this.especialidadesList.push(dataAux);
        }
    })
  });
  }
  getEspecialistas(especialistaId?:string,especialidad?:string){
    this.especialistaList=[];
    let especialidadesAux=[];
    console.log(especialidad);
    this.firestore.getCollection("especialistas").then((data)=>{
      data.forEach((dataAux:any)=>{
        //console.log(dataAux);
      if(especialidad!=undefined)
      {
        console.log(especialidad);
        for(let especialidadAux of dataAux.data.especialista.especialidad)
        {
          console.log(especialidadAux);
          console.log(especialidad);
          if(especialidadAux==especialidad)
          {
            this.especialistaList.push(dataAux);
          }
        }
      }
      else if(especialistaId!=undefined)
      {
        if(dataAux.id==especialistaId)
        {
          console.log(dataAux);
          this.especialista=dataAux;
        }
      }else{
        this.especialistaList.push(dataAux);
      }
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
          this.pasoSwitch=1;
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
            this.pasoSwitch=0;
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
    Swal.fire(
      'Exito!',
      'Turno añadido correctamente',
      'success'
    );
  }
  SeleccionarPaciente(paciente:any){
    //this.registroTurnoForm.get('paciente')?.setValue(paciente);
    this.pasoSwitch=1;
    this.turno.paciente=paciente;
    console.log(paciente);
    (<HTMLInputElement> document.getElementById("pacienteInput")).style.display="none";
  }
  SeleccionarEspecialistas(data:any){
    this.registroTurnoForm.get('especialista')?.setValue(data);
    this.especialista=this.getEspecialistas(data);
    this.pasoSwitch=3;
  }
  SeleccionarEspecialidad(data:any){
    this.registroTurnoForm.get('especialidad')?.setValue(data.data.data);
    this.pasoSwitch=2;
    console.log(data);
    console.log(data.id);
    this.getEspecialidad(data.id);
    console.log(this.especialidadesList[0]);
    //this.getEspecialistas(this.especialidadesList[0].data.data);
    //this.registroTurnoForm.setValue('especialidad',)
    //this.turno.paciente=data;
  }
}
