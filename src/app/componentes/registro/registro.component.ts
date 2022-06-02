import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
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
  constructor(public firestore:FirebaseService) { }

  ngOnInit(): void {
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
}
