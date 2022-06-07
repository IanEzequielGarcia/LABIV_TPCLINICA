import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  tipoLogueado:string="";
  esEspecialista:boolean=false;
  infoUsuario:any;
  constructor(private firestore:FirebaseService) {
    this.GetTipo();
  }

  ngOnInit(): void {
  }
  async GetTipo(){
    let encontrado=false;
    this.firestore.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.paciente.email)
        {
          this.infoUsuario=paciente.data.paciente;
          console.log(this.infoUsuario);
          this.tipoLogueado="paciente";
          console.log("paciente");
          encontrado=true;
        }
      })
    })
    if(!encontrado)
    {
      this.firestore.getCollection("especialistas").then(async (pacientesAux)=>{
        let usuario = await this.firestore.InfoUsuario();
        //console.log(usuario);
        pacientesAux.forEach((paciente:any)=>{
          if(usuario?.email==paciente.data.especialista.email)
          {
            this.infoUsuario=paciente.data.especialista;
            console.log(this.infoUsuario);
            this.tipoLogueado="especialista";
            console.log("especialista");
            this.esEspecialista=true;
          }
        })
      })
    }
    if(!encontrado)
    {
      this.firestore.getCollection("admin").then(async (pacientesAux)=>{
        let usuario = await this.firestore.InfoUsuario();
        //console.log(usuario);
        pacientesAux.forEach((paciente:any)=>{
          if(usuario?.email==paciente.data.admin.email)
          {
            this.infoUsuario=paciente.data.especialista;
            console.log(this.infoUsuario);
            this.tipoLogueado="admin";
            console.log("ninguno/admin");
          }
        })
      })
    }
  }
}
