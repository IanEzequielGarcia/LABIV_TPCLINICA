import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger("myAnimationTrigger", [
      state('shown', style({
        transform: 'translateY(0%)'})
      ), state('hidden', style({
        transform: 'translateY(100%)', display:'none', opacity: 0})
      ),
    ])
  ]
})
export class LoginComponent implements OnInit {
  state = 'shown';
  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.minLength(4),Validators.email]),
    contrasena : new FormControl('',[Validators.required,Validators.minLength(4)]),

    })
  email="";
  contrasena="";
  constructor(private firestore:FirebaseService,public routing:Router) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    setTimeout( () => {
      this.state = 'hidden';
    }, 1000);
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
              Swal.fire(
                'ATENCION!',
                'Verifique su mail',
                'info'
              );
            }else{
              console.log(usuario?.user?.emailVerified);
              Swal.fire(
                'Exito!',
                'Logueado correctamente',
                'success'
              );
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
              Swal.fire(
                'Exito!',
                'Logueado correctamente',
                'success'
              );

            }else if(paciente.data.especialista.verificado==false ||paciente.data.especialista.verificado=="false" ){
              console.log(usuario?.user?.emailVerified);
              this.firestore.LogOut();
              Swal.fire(
                'ERROR!',
                'Su cuenta no ha sido verificada por un admin',
                'question'
              );
            }
            else{
              console.log(usuario?.user?.emailVerified);
              this.firestore.LogOut();
              Swal.fire(
                'ATENCION!',
                'Verifique su mail',
                'info'
              );
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
            Swal.fire(
              'Exito!',
              'Logueado correctamente, ADMIN',
              'success'
            );
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
