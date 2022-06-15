import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  siteKey="6LdyH0ggAAAAAJ_b3FbfmaifgFbU-sjevqMez2Kp";
  pacienteForm=true;
  registroPacienteForm = new FormGroup({
    nombre : new FormControl('',[Validators.required]),
    apellido : new FormControl('',[Validators.required]),
    edad : new FormControl('',[Validators.required]),
    dni : new FormControl('',[Validators.required,Validators.minLength(4)]),
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),
    obraSocial : new FormControl('',[Validators.required]),
    fotoUno : new FormControl('',[Validators.required]),
    fotoDos : new FormControl('',[Validators.required]),
    recaptcha : new FormControl('',[Validators.required]),
  });
  paciente={
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
  }
  get FotoUnoGet()
  {
    return this.registroPacienteForm.get('fotoUno');
  }
  get FotoDosGet()
  {
    return this.registroPacienteForm.get('fotoDos');
  }
  constructor(public firestore:FirebaseService,) {
    this.getEspecialistas();
  }

  ngOnInit(): void {
    //this.getCaptcha();
  }
  async subirFoto(event:any,numero:number)
  {
    let archivos=event.target.files[0];

    this.firestore.subirFoto(this.paciente.nombre+"_"+Date.now(),archivos).then((foto)=>{
      if(numero==1)
      {
        this.paciente.fotoUno = foto;
      }else{
        this.paciente.fotoDos = foto;
      }
      console.log("foto "+foto);
    });
  }
  agregarPaciente(){
    this.paciente.nombre=this.registroPacienteForm.get('nombre')?.value;
    this.paciente.apellido=this.registroPacienteForm.get('apellido')?.value;
    this.paciente.edad=this.registroPacienteForm.get('edad')?.value;
    this.paciente.dni=this.registroPacienteForm.get('dni')?.value;
    this.paciente.email=this.registroPacienteForm.get('email')?.value;
    this.paciente.contrasena=this.registroPacienteForm.get('contrasena')?.value;
    this.paciente.obraSocial=this.registroPacienteForm.get('obraSocial')?.value;
    this.paciente.tipo="paciente";
    console.log(this.paciente);
    this.firestore.añadirPacientes(this.paciente);
    try {
      this.firestore.RegisterUser(this.paciente.email,this.paciente.contrasena);
      alert("Registrado correctamente ");
    } catch (error) {
      alert("No se pudo registrar "+error);
    }
  }
  /*ESPECIALISTA*/
  especialidadesList:any[]=[];
  async subirFotoEspecialista(event:any)
  {
    let archivos=event.target.files[0];

    this.firestore.subirFoto(this.especialista.nombre+"_"+Date.now(),archivos).then((foto)=>{
      this.especialista.fotoUno = foto;
      console.log("foto "+foto);
    });
  }
  AgregarEspecialista(){
    this.especialista.nombre=this.registroEspecialistaForm.get('nombre')?.value;
    this.especialista.apellido=this.registroEspecialistaForm.get('apellido')?.value;
    this.especialista.edad=this.registroEspecialistaForm.get('edad')?.value;
    this.especialista.dni=this.registroEspecialistaForm.get('dni')?.value;
    this.especialista.email=this.registroEspecialistaForm.get('email')?.value;
    this.especialista.contrasena=this.registroEspecialistaForm.get('contrasena')?.value;
    this.especialista.especialidad=this.registroEspecialistaForm.get('especialidad')?.value;
    //this.especialista.tipo="especialista";
    console.log(this.especialista);
    this.firestore.añadirEpecialistas(this.especialista);
    this.firestore.RegisterUser(this.especialista.email,this.especialista.contrasena);
  }
  AgregarEspecialidad(){
    console.log((<HTMLInputElement> document.getElementById("especialidadInput")).value);
    this.firestore.AñadirColeccion((<HTMLInputElement> document.getElementById("especialidadInput")).value,"especialidades");
    this.getEspecialistas();
  }
  getEspecialistas(){
    this.especialidadesList=[];
    this.firestore.getCollection("especialidades").then((data)=>{
      data.forEach((dataAux:any)=>{
      this.especialidadesList.push(dataAux.data.data);
    })
    });
  }
  SeleccionarEspecialidad(especialidad:string){
    console.log(especialidad);
    this.registroEspecialistaForm.controls['especialidad'].setValue(especialidad);
  }
  inputEspecialista:string="";
  captcha = <HTMLInputElement> document.querySelector(".captcha");
  reloadBtn = <HTMLInputElement> document.querySelector(".reload-btn");
  inputField = <HTMLInputElement> document.querySelector(".input-area input");
  checkBtn = <HTMLInputElement> document.querySelector(".check-btn");
  statusTxt = <HTMLInputElement> document.querySelector(".status-text");
  
  //storing all captcha characters in array
  allCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
                    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
                    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                    't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  getCaptcha(){
    for (let i = 0; i < 6; i++) { //getting 6 random characters from the array
      let randomCharacter = this.allCharacters[Math.floor(Math.random() * this.allCharacters.length)];
      (<HTMLInputElement> document.querySelector(".captcha")).innerText += ` ${randomCharacter}`; //passing 6 random characters inside captcha innerText
      //console.log(this.captcha.innerText);
    }
  }
  CargarCaptcha(){
    setTimeout(()=>{
      this.ReloadButton();
    },50);
  }
   //calling getCaptcha when the page open
  //calling getCaptcha & removeContent on the reload btn click
  ReloadButton(){
    this.removeContent();
    this.getCaptcha();
  }
  
  removeContent()
  {
    (<HTMLInputElement> document.querySelector(".input-area input")).value = "";
    (<HTMLInputElement> document.querySelector(".captcha")).innerText = "";
    (<HTMLInputElement> document.querySelector(".status-text")).style.display = "none";
  }
  registroEspecialistaForm = new FormGroup({
    nombre : new FormControl('',[Validators.required]),
    apellido : new FormControl('',[Validators.required]),
    edad : new FormControl('',[Validators.required]),
    dni : new FormControl('',[Validators.required,Validators.minLength(4)]),
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),
    especialidad : new FormControl('',[Validators.required]),
    fotoUno : new FormControl('',[Validators.required]),
    captcha : new FormControl('',[Validators.required]),
  });
  especialista={
    nombre:"",
    apellido:"",
    edad:"",
    dni:"",
    email:"",
    contrasena:"",
    especialidad:"",
    fotoUno:"",
    tipo:"especialista",
    verificado:false
  }
  get FotoUnoGetEspecialista()
  {
    return this.registroEspecialistaForm.get('fotoUno');
  }
  CheckButton(){
    //e.preventDefault(); //preventing button from it's default behaviour
    (<HTMLInputElement> document.querySelector(".status-text")).style.display  = "block";
    //adding space after each character of user entered values because I've added spaces while generating captcha
    let inputVal =(<HTMLInputElement> document.querySelector(".input-area input")).value.split('').join(' ');
    if(inputVal == (<HTMLInputElement> document.querySelector(".captcha")).innerText){ //if captcha matched
      (<HTMLInputElement> document.querySelector(".status-text")).style.color = "#4db2ec";
      (<HTMLInputElement> document.querySelector(".status-text")).innerText = "CAPTCHA Ingresado Correctamente";
      this.registroEspecialistaForm.get('captcha')!.setValue(true);
    }else{
      (<HTMLInputElement> document.querySelector(".status-text")).style.color = "#ff0000";
      (<HTMLInputElement> document.querySelector(".status-text")).innerText = "ERROR, Reingrese";
    }
  }
}
