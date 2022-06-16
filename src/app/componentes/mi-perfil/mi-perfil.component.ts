import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  tipoLogueado:string="";
  infoUsuario:any;
  infoPerfil:any;
  idUsuario:string="";
  horaForm = new FormGroup({
    horaMin : new FormControl('',[Validators.required]),
    horaMax : new FormControl('',[Validators.required]),
  });
  turnoList:any[] = [];
  constructor(private firestore:FirebaseService) {
    this.GetTipo();
    this.GetTurnos();
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
          this.infoPerfil=paciente.data.paciente;
          this.infoUsuario=paciente;
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
            this.infoPerfil=paciente.data.especialista;
            this.infoUsuario=paciente;
            this.idUsuario=paciente.id;
            console.log(this.infoUsuario);
            this.tipoLogueado="especialista";
            console.log("especialista");
            encontrado=true;
          }
        })
      })
    }
    if(!encontrado)
    {
      this.firestore.getCollection("admins").then(async (pacientesAux)=>{
        let usuario = await this.firestore.InfoUsuario();
        pacientesAux.forEach((paciente:any)=>{
          if(usuario?.email==paciente.data.admin.email.toLowerCase())
          {
            this.infoPerfil=paciente.data.admin;
            this.idUsuario=paciente.id;
            this.infoUsuario=paciente;
            console.log(this.infoUsuario);
            this.tipoLogueado="admin";
            console.log("ninguno/admin");
          }
        })
      })
    }
  }
  CargarHoras(){
    this.infoUsuario.data.especialista.horaMin=this.horaForm.get('horaMin')?.value;
    this.infoUsuario.data.especialista.horaMax=this.horaForm.get('horaMax')?.value;
    /*let horas={
      horaMin:"",
      horaMax:"",
      especialidad:"",
      especialista:""
      
    }
    horas.horaMin=this.horaForm.get('horaMin')?.value;
    horas.horaMax=this.horaForm.get('horaMax')?.value;
    horas.especialidad=this.infoUsuario.especialidad;
    horas.especialista=this.idUsuario;*/
    this.firestore.VerificarEspecialista("especialistas",this.infoUsuario.data.especialista,this.infoUsuario.id);
    console.log(this.infoUsuario);
  }
  GetTurnos(){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        console.log(this.tipoLogueado);
        if(this.tipoLogueado=="especialista")
        {
          console.log(paciente);
          console.log(this.infoUsuario);
          if(this.infoUsuario.id==paciente.data.data.especialista)
          {
            this.turnoList.push(paciente);
            console.log(paciente);
          }
        }else if(this.tipoLogueado=="paciente"){
          if(this.infoUsuario.id==paciente.data.data.paciente&&paciente.data.data.estado=="finalizado")
          {
            this.turnoList.push(paciente);
            console.log(paciente);
          }
        }else if(this.tipoLogueado=="admin"&&paciente.data.data.estado=="finalizado"){
          this.turnoList.push(paciente);
          console.log(paciente);
        }
      })
    })
  }
  async AlertaHistorial(data:any){

  }
  downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('PACIENTE PDF', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    var data:any[]=[];
    var head:any[]=[["ESPECIALIDAD","ESPECIALISTA","PACIENTE","FECHA"]]
    this.turnoList.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.data.data.especialidad);
      tempObj.push(e.data.data.especialista);
      tempObj.push(e.data.data.paciente);
      tempObj.push(e.data.data.fecha);
      data.push(tempObj);
    });
    (doc as any).autoTable({
      head: head,
      body: data,
      theme: 'plain',
      didDrawCell: (data:any) => {
        console.log(data.column.index)
      }
    });
    doc.output('dataurlnewwindow');
  }
}

