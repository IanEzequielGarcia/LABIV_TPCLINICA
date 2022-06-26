import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations: [
    trigger("myAnimationTrigger", [
      state('shown', style({
        transform: 'translateY(0%)'})
      ), state('hidden', style({
        transform: '', display:'none', opacity: 0})
      ),
    ])
  ]
})
export class UsuariosComponent implements OnInit {
  listaPacientes:any[]=[];
  listaTurnos:any[]=[];
  listaTurnosPdf:any[]=[];
  pacientePdf:any;
  state = 'shown';

  ngAfterViewInit() {
    setTimeout( () => {
    this.state = 'hidden';
    }, 500);
  }

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
    this.GetTipo();
    this.getUsuarios();
  }
  infoUsuario:any;
  tipoLogueado:string="";
  listaTodosPacientes:any[]=[];
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
  getTodosPacientes()
  {

  }
  getUsuarios(){
    this.firestore.getCollection("especialistas").then((adminsAux)=>{
      adminsAux.forEach((especialista:any)=>{
      this.listaEspecialistas.push(especialista);
    })
    });
    this.firestore.getCollection("turnos").then((adminsAux)=>{
      adminsAux.forEach((admins:any)=>{
        //console.log(admins.data.data.fecha);
      this.listaTurnos.push(admins);
    })
    })
    console.log(this.listaTurnos);
    this.listaTurnos.sort((a,b)=>{
      console.log(a.data.data.fecha);
      let aAux= new Date(a.data.data.fecha);
      let bAux= new Date(b.data.data.fecha);
      if(aAux>bAux)
      {
        return 1;
      }else if(aAux<bAux)
      {
        return -1;
      }else{
        return 0;
      }
    });
    console.log(this.listaTurnos);
    this.firestore.getCollection("pacientes").then((adminsAux)=>{
      adminsAux.forEach((admins:any)=>{
        this.listaTodosPacientes.push(admins);
        this.listaTurnos.forEach((turno)=>{

          //console.log(turno.data.data.paciente);
          //console.log(admins.id);
          if(turno.data.data.paciente!=undefined&&turno.data.data.paciente==admins.id)
          {
            console.log("entro");
            if(this.tipoLogueado=="especialista")
            {
              this.listaTurnos.forEach((turno)=>{
                if(turno.data.data.especialista==this.infoUsuario.id&&!this.listaPacientes.includes(admins))
                {
                  this.listaPacientes.push(admins);
                }
              })
              //this.listaPacientes.push(admins);
            }
            else if(!this.listaPacientes.includes(admins))
            {
              this.listaPacientes.push(admins);
            }
          }
        })
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
  DescargarExcelTodos(){
    //getting data from our table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('table_with_data');
    var table_html = table_div!.outerHTML.replace(/ /g, '%20');
    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'Pacientes.xls';
    a.click();
  }
  DescargarExcel(paciente:any){
    this.listaTurnosPdf=[];
    this.listaTurnos.forEach((turno)=>{
      if(turno.data.data.paciente==paciente.id)
      {
        turno.data.data.paciente=paciente.data.paciente.nombre+" "+paciente.data.paciente.apellido;
        this.listaEspecialistas.forEach((especialista)=>{
          if(especialista.id==turno.data.data.especialista)
          {
            turno.data.data.especialista=especialista.data.especialista.nombre+" "+especialista.data.especialista.apellido;
            this.listaTurnosPdf.push(turno);
          }
        })
      }
    })
    console.log(this.listaTurnosPdf);
    this.pacientePdf=paciente;
    setTimeout(()=>{
      //getting data from our table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('table_excel');
    var table_html = table_div!.outerHTML.replace(/ /g, '%20');
    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = `${this.pacientePdf.data.paciente.apellido}.xls`;
    a.click();
    },50)
  }
  GetTipo(){
    let encontrado=false;

    this.firestore.getCollection("especialistas").then(async (pacientesAux)=>{
      let usuario = await this.firestore.InfoUsuario();
      //console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.especialista.email)
        {
          this.infoUsuario=paciente;
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
            this.infoUsuario=paciente;
            console.log(this.infoUsuario);
            this.tipoLogueado="admin";
            console.log("ninguno/admin");
          }
        })
      })
    }
  }
}
