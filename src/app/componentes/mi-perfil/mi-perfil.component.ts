import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PipeFiltroPipe } from 'src/app/pipes/pipe-filtro.pipe';
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
  especialidadesList:any[]=[];
  pacientesList:any[]=[];
  especialistasList:any[]=[];
  filtroString:string="";

  horaForm = new FormGroup({
    horaMin : new FormControl('',[Validators.required]),
    horaMax : new FormControl('',[Validators.required]),
  });
  turnoList:any[] = [];
  todasEspecialidadesList:any[]=[];
  constructor(private firestore:FirebaseService) {
    this.GetTipo();
    this.GetTurnos();
    this.GetEspecialidades();
    this.GetEspecialidadesList();
  }

  ngOnInit(): void {
  }
  getEspecialistas(id?:string){
    this.firestore.getCollection("especialistas").then(async (pacientesAux)=>{
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(id==paciente.data.especialista.id)
        {
          this.infoUsuario=paciente;
          console.log("encontrado");
          return paciente;
        }
      })
    })
  }
  GetTipo(){
    let encontrado=false;
    this.firestore.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        this.pacientesList.push(paciente);
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
    this.firestore.getCollection("especialistas").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        this.especialistasList.push(paciente);
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
    this.firestore.VerificarEspecialista("especialistas",this.infoUsuario.data.especialista,this.infoUsuario.id);
    console.log(this.infoUsuario);
  }
  GetTurnos(turnoPdf?:string){
    this.turnoList = [];
    this.firestore.getCollection("turnos").then(async (pacientesAux)=>{
      pacientesAux.forEach((paciente:any)=>{
        //console.log(paciente);
        //console.log(this.infoUsuario);
        //console.log(this.tipoLogueado);
        if(this.tipoLogueado=="especialista")
        {
          this.getEspecialistas(this.infoUsuario.id);
          this.GetEspecialidadesList();
          if(this.infoUsuario.id==paciente.data.data.especialista)
          {
            for (const pacienteAux of this.pacientesList) {
              if(pacienteAux.id==paciente.data.data.paciente)
              {
                //paciente.data.data.especialista = this.infoUsuario.data.especialista.nombre+" "+this.infoUsuario.data.especialista.apellido
                paciente.data.data.paciente=pacienteAux.data.paciente.nombre+" "+pacienteAux.data.paciente.apellido;
                break;
              }
            }
            for (const especialistaAux of this.especialistasList) {
              if(especialistaAux.id==paciente.data.data.especialista)
              {
                paciente.data.data.especialista = especialistaAux.data.especialista.nombre+" "+especialistaAux.data.especialista.apellido
                //paciente.data.data.paciente=pacienteAux.data.paciente.nombre+" "+pacienteAux.data.paciente.apellido;
                break;
              }
            }
            if(turnoPdf!=undefined)
            {
              console.log(turnoPdf);
              console.log(paciente.data.data.especialidad);
              if(paciente.data.data.especialidad==turnoPdf)
              {
                this.turnoList.push(paciente);
              }
            }else{
              this.turnoList.push(paciente);
            }
          }
        }else if(this.tipoLogueado=="paciente"){
          //console.log(this.infoUsuario.id);
          //console.log(paciente.data.data.paciente);
          //console.log(paciente.data.data.estado);
          if(this.infoUsuario.id==paciente.data.data.paciente&&paciente.data.data.estado=="finalizado")
          {
            for (const pacienteAux of this.pacientesList) {
              if(pacienteAux.id==paciente.data.data.paciente)
              {
                //paciente.data.data.especialista = this.infoUsuario.data.especialista.nombre+" "+this.infoUsuario.data.especialista.apellido
                paciente.data.data.paciente=pacienteAux.data.paciente.nombre+" "+pacienteAux.data.paciente.apellido;
                break;
              }
            }
            for (const especialistaAux of this.especialistasList) {
              if(especialistaAux.id==paciente.data.data.especialista)
              {
                paciente.data.data.especialista = especialistaAux.data.especialista.nombre+" "+especialistaAux.data.especialista.apellido
                //paciente.data.data.paciente=pacienteAux.data.paciente.nombre+" "+pacienteAux.data.paciente.apellido;
                break;
              }
            }
            this.turnoList.push(paciente);
            console.log(paciente);
          }
        }else if(this.tipoLogueado=="admin"&&paciente.data.data.estado=="finalizado"){
          if(turnoPdf!=undefined)
            {
              if(paciente.data.data.especialidad==turnoPdf)
                this.turnoList.push(paciente);
            }else{
              this.turnoList.push(paciente);
            }
          console.log(paciente);
        }
      })
    })
    
  }
  async AlertaHistorial(data:any){
  }
  async AgregarEspecialidad(){
    let encontrado:boolean=false;
    let especialidadInput:string = (<HTMLInputElement>document.getElementById("especialidadInput")).value;
    for await (const especialidad of this.todasEspecialidadesList) {
      //console.log(especialidad.data.data);
      //console.log(especialidadInput);
      if(especialidad.data.data==especialidadInput){
        encontrado=true;
        console.log("encontrado");
        //this.firestore.ActualizarEspecialidadArray(this.infoUsuario.data.especialista,this.infoUsuario.id);
        break;
      }
    }
    if(!encontrado){
      console.log("no encontrado");
      this.firestore.AñadirColeccion(especialidadInput,"especialidades");
    }
    this.infoUsuario.data.especialista.especialidad.push(especialidadInput);
    this.firestore.ActualizarEspecialidadArray(this.infoUsuario.data.especialista,this.infoUsuario.id);
    this.GetEspecialidades();
    this.GetEspecialidadesList();
  }
  EliminarEspecialidad(especialidadAux:any){
    const index = this.infoUsuario.data.especialista.especialidad.indexOf(especialidadAux, 0);
    if (index > -1) {
      this.infoUsuario.data.especialista.especialidad.splice(index, 1);
      console.log(this.infoUsuario.data.especialista.especialidad);
      this.firestore.ActualizarEspecialidadArray(this.infoUsuario.data.especialista,this.infoUsuario.id);
      this.GetEspecialidadesList();
    }
  }
  GetEspecialidadesList()
  {
    this.especialidadesList=[];
    this.getEspecialistas(this.idUsuario);
    if(this.infoUsuario!=undefined)
    {
      //console.log(this.infoUsuario);
      //console.log(this.infoUsuario.data.especialista.especialidad);
      for(let especialidad of this.infoUsuario.data.especialista.especialidad)
      {
          //console.log(especialidad);
          this.especialidadesList.push(especialidad);
      }
    }
  }
  GetEspecialidades(){
    this.todasEspecialidadesList=[];
    this.firestore.getCollection("especialidades").then((data)=>{
      data.forEach((dataAux:any)=>{
        this.todasEspecialidadesList.push(dataAux);
        //let arrayAux = JSON.stringify(this.infoUsuario.data.especialidades);
        //console.log(this.infoUsuario.data.especialista);
    })
    });
  }
  pdfEspecialidad(data:any){
    this.GetTurnos(data);
    setTimeout(()=>{this.downloadPdf()},500);
  }
  downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('PACIENTE PDF', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    var data:any[]=[];
    var head:any[]=[["ESPECIALIDAD","ESPECIALISTA","PACIENTE","FECHA","ALTURA","PESO","PRESION","TEMPERATURA"]]
    this.turnoList.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.data.data.especialidad);
      tempObj.push(e.data.data.especialista);
      tempObj.push(e.data.data.paciente);
      tempObj.push(e.data.data.fecha);
      if(e.data.data.historia!=undefined)
      {
        tempObj.push(e.data.data.historia.altura);
        tempObj.push(e.data.data.historia.peso);
        tempObj.push(e.data.data.historia.presion);
        tempObj.push(e.data.data.historia.temperatura);
      }
      data.push(tempObj);
    });
    (doc as any).autoTable({
      head: head,
      body: data,
      theme: 'plain',
      didDrawPage(data:any) {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFont('normal');
          //#region imagen
          doc.addImage("data:image/png;base64,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"
          , 'JPEG', 65, 0, 10, 10);
          //#endregion
        doc.setFontSize(10);
        let fecha = new Date();
        doc.text(fecha.toDateString(), 75, 6);
      },
      
    
      didDrawCell: (data:any) => {
        //console.log(data.column.index)
      }
      
    });
    doc.output('dataurlnewwindow');
  }
}

