import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {
  registroEspecialistaForm = new FormGroup({
    nombre : new FormControl('',[Validators.required]),
    apellido : new FormControl('',[Validators.required]),
    edad : new FormControl('',[Validators.required]),
    dni : new FormControl('',[Validators.required,Validators.minLength(4)]),
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),
    especialidad : new FormControl('',[Validators.required]),
    fotoUno : new FormControl('',[Validators.required]),
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
  inputEspecialista:string="";
  especialidadesList:any[]=[];

  constructor(public firestore:FirebaseService) {
    this.getEspecialistas();
  }
  get FotoUnoGet()
  {
    return this.registroEspecialistaForm.get('fotoUno');
  }
  ngOnInit(): void {
  }
  async subirFoto(event:any)
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
}
