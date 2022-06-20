import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  listaPacientes:any[]=[];
  listaEspecialistas:any[]=[];
  adminForm = new FormGroup({
    nombre : new FormControl('',[Validators.required]),
    apellido : new FormControl('',[Validators.required]),
    edad : new FormControl('',[Validators.required]),
    dni : new FormControl('',[Validators.required,Validators.minLength(4)]),
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),
    fotoUno : new FormControl('',[Validators.required]),
  });
  constructor(public firestore:FirebaseService) {
    this.getUsuarios();
  }
  admin={
    nombre:"",
    apellido:"",
    edad:"",
    dni:"",
    email:"",
    contrasena:"",
    fotoUno:"",
    tipo:"admin"
  }
  getUsuarios(){
    this.firestore.getCollection("especialistas").then((adminsAux)=>{
      adminsAux.forEach((especialista:any)=>{
      this.listaEspecialistas.push(especialista);
    })
    });
    this.firestore.getCollection("pacientes").then((adminsAux)=>{
      adminsAux.forEach((admins:any)=>{
      this.listaPacientes.push(admins);
    })
    })
  }
  ngOnInit(): void {
  }
  elegirUsuario(usuario:any)
  {
    console.log(usuario.data.especialista);
    if(usuario.data.especialista.verificado==false)
    {
      usuario.data.especialista.verificado = true;
    }else{
      usuario.data.especialista.verificado = false;
    }
    //usuario.data.especialista.verificado = !usuario.data.especialista.verificado
    let usuarioAux= usuario.data.especialista;
    console.log(usuarioAux);
    console.log(usuarioAux.verificado);
    //console.log(usuario);
    console.log(usuario.data.especialista);
    this.firestore.VerificarEspecialista("especialistas",usuarioAux,usuario.id);
  }
  get FotoUnoGet()
  {
    return this.adminForm.get('fotoUno');
  }
  async subirFoto(event:any)
  {
    let archivos=event.target.files[0];

    let promesa:string;
    this.firestore.subirFoto(this.admin.nombre+"_"+Date.now(),archivos).then((foto)=>{

      this.admin.fotoUno = foto;
      console.log("foto "+foto);
    });
  }
  agregarPaciente(){
    this.admin.nombre=this.adminForm.get('nombre')?.value;
    this.admin.apellido=this.adminForm.get('apellido')?.value;
    this.admin.edad=this.adminForm.get('edad')?.value;
    this.admin.dni=this.adminForm.get('dni')?.value;
    this.admin.email=this.adminForm.get('email')?.value;
    console.log(this.admin);
    this.firestore.añadirAdmin(this.admin);
    this.firestore.RegisterUser(this.admin.email,this.admin.contrasena);
  }
  DescargarExcel(data:any){
    
  }
}
