import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),

    })
  email="";
  contrasena="";
  constructor(private firestore:FirebaseService,public routing:Router) { }

  ngOnInit(): void {
  }
  AccesoRapido(){
    this.loginForm.controls['email'].setValue('JuanPerez@hotmail.com');
    this.loginForm.controls['contrasena'].setValue('JuanPerez@hotmail.com');
  }
  Login(email?:string,contraseña?:string,)
  {
    if(email!=undefined&&contraseña!=undefined)
    {
      this.email=email;
      this.contrasena=contraseña;
    }else{
      this.email=this.loginForm.get('email')?.value;
      this.contrasena=this.loginForm.get('email')?.value;
    }
    console.log("aaaaaaa");
    this.firestore.getCollection("pacientes").then((pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        if(this.email==paciente.data.paciente.email)
        {
            this.firestore.SignIn(this.email,this.contrasena).then((usuario)=>{
            //console.log("aaaaa "+this.firestore.enviarVerificacion());
            if(!usuario?.user?.emailVerified)
            {
              this.firestore.enviarVerificacion();
              console.log(usuario?.user?.emailVerified);
              this.firestore.LogOut();
              alert("verifique su mail");
            }else{
              console.log(usuario?.user?.emailVerified);
              alert("Logueado con exito");
            }
          });
        }
      })
    })
    this.firestore.getCollection("especialistas").then((pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        console.log(paciente.data.especialista);
        if(this.email==paciente.data.especialista.email)
        {
            this.firestore.SignIn(this.email,this.contrasena).then((usuario)=>{
            this.firestore.enviarVerificacion();
            if(usuario?.user?.emailVerified && paciente.data.especialista.verificado)
            {
              console.log(usuario?.user?.emailVerified);
              alert("Logueado con exito");

            }else if(paciente.data.especialista.verificado==false ||paciente.data.especialista.verificado=="false" ){
              console.log(usuario?.user?.emailVerified);
              this.firestore.LogOut();
              alert("Su cuenta no ha sido verificada por un admin");
            }
            else{
              console.log(usuario?.user?.emailVerified);
              this.firestore.LogOut();
              alert("verifique su mail");
            }
          });
        }
      })
    })
    this.firestore.getCollection("admins").then((pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        console.log(paciente.data.admin);
        if(this.email==paciente.data.admin.email)
        {
          this.firestore.SignIn(this.email,this.contrasena).then((usuario)=>{
            alert("Logueado con exito, ADMIN");
          })
        }
      })
    })
  }
  AccesoRapidoCustom(email:string,contraseña:string){
    this.Login(email,contraseña);
    /*this.firestore.SignIn(email,contraseña).then(()=>{
      alert("Logueado con exito");
    })*/
  }
}
