import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartItem,ChartType,registerables } from 'chart.js';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { EspecialistaPipePipe } from 'src/app/pipes/especialista-pipe.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { trigger, state, style } from '@angular/animations';
Chart.register(...registerables);
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
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
export class InformesComponent implements OnInit {
  state = 'shown';
  ngAfterViewInit() {
    setTimeout( () => {
    this.state = 'hidden';
    }, 500);
  }

  listaLogger:any[]=[];
  listaEncuestas:any[]=[];
  listaTurnos:any[]=[];
  listaPacientes:any[]=[];
  label:string[]=[];
  labelArray:string[][]=[];
  datos:number[]=[];

  formaFechasFinalizado:FormGroup;
  fechaInicioTurnosFinalizado:Date = new Date();
  fechaFinalTurnosFinalizados:Date = new Date();
  
  formaFechasSolicitado:FormGroup;
  fechaInicioTurnosSolicitado:Date = new Date();
  fechaFinalTurnosSolicitado:Date = new Date();

  @ViewChild('informe', {static: true}) element!: ElementRef<HTMLImageElement>;
  @ViewChild('informe2', {static: true}) element2!: ElementRef<HTMLImageElement>;
  @ViewChild('informeTurnosFinalizados', {static: true}) element3!: ElementRef<HTMLImageElement>;


  chartMedicoEspecialidad:any=null;
  chartVisitas:any=null;
  chartInformesVisitas:any=null;
  chartAprobado:any=null;
  chartAtencion:any=null;
  chartEstrellas:any=null;
  chartRapidez:any=null;
  chartPaciente:any=null;


  dataLabelGraficoTurnoxEspecialidades:any;
  auxValuesGraficoTurnoxEspecialidades:any;
  dataLabelVisitasPorPaciente:any;
  auxValuesdataLabelVisitasPorPaciente:any;
  dataLabelInformeVisitas:any;
  auxValuesInformeVisitas:any;
  dataLabelAprobados:any;
  auxValuesAprobados:any;
  dataLabelAtencion:any;
  auxValuesAtencion:any;
  dataLabelEstrellas:any;
  auxValuesEstrellas:any;
  dataLabelRapidez:any;
  auxValuesRapidez:any;
  dataLabelPaciente:any;
  auxValuesPaciente:any;
  constructor(private firestore:FirebaseService,private fb:FormBuilder) {
    this.formaFechasSolicitado = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })
    this.formaFechasFinalizado = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })
    }
  ngOnInit(): void {
    this.GetLogs();
    this.GetEncuestas();
    this.GetPacientes();
    this.GetTurnos();
  }
  GetLogs()
  {
    this.firestore.getCollection("logger").then(async (logs)=>{
      logs.forEach((logsAux:any)=>{
        //console.log(data.data.data.especialista);
        //console.log(logsAux);
        this.listaLogger.push(logsAux);
      })
    })
  }
  GetPacientes()
  {
    this.firestore.getCollection("pacientes").then(async (logs)=>{
      logs.forEach((logsAux:any)=>{
        //console.log(data.data.data.especialista);
        //console.log(logsAux);
        this.listaPacientes.push(logsAux);
      })
    })
  }
  GetEncuestas()
  {
    this.firestore.getCollection("encuestas").then(async (logs)=>{
      logs.forEach((logsAux:any)=>{
        //console.log(data.data.data.especialista);
        //console.log(logsAux);
        this.listaEncuestas.push(logsAux);
      })
    })
  }
  ChartEspecialidades()
  {
      //let valoresPorPuntaje:Array<any> = [];
      let labels:string[]=[];
      let datos:number[]=[];
      for(let esp of this.listaTurnos)
      {
        if(labels.length>0)
        {
          let encontrado=false;
          for (let i = 0; i < labels.length; i++) {
            if(labels[i]==esp.data.data.especialidad)
            {
              encontrado=true;
              break;
            }
          }
          if(!encontrado)
          {
              labels.push(esp.data.data.especialidad);
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
          }
        }else{
          labels.push(esp.data.data.especialidad);
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
        }
      }
      this.listaTurnos.forEach( (turno:any) => {
        let i=0;
        for(let valor of labels)
        {
          //console.log(valor);
          if(turno.data.data.especialidad == valor)
          {
            if(datos[i]==undefined)
            {
              datos[i]=0;
            }
            datos[i]++;
          }
          i++;
        }
      });
      //labels = labels.filter(e=> e != 0);
      this.barChartDataEspecialidad.labels=[];
      this.barChartDataEspecialidad.datasets[0].data=[];
      for (let i = 0; i < labels.length; i++) 
      {
        this.barChartDataEspecialidad.labels?.push(labels[i]);
        this.barChartDataEspecialidad.datasets[0].data.push(datos[i]);
      }
      this.chartEspecialidad?.update();
  }
  ChartDia()
  {
    //let valoresPorPuntaje:Array<any> = [];
    let labels:string[]=[];
    let datos:number[]=[];
    for(let esp of this.listaTurnos)
    {
      if(labels.length>0)
      {
        let encontrado=false;
        for (let i = 0; i < labels.length; i++) {
          if(labels[i]==esp.data.data.fecha)
          {
            encontrado=true;
            break;
          }
        }
        if(!encontrado)
        {
            labels.push(esp.data.data.fecha);
          //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
        }
      }else{
        labels.push(esp.data.data.fecha);
          //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
      }
    }
    this.listaTurnos.forEach( (turno:any) => {
      let i=0;
      for(let valor of labels)
      {
        //console.log(valor);
        if(turno.data.data.fecha == valor)
        {
          if(datos[i]==undefined)
          {
            datos[i]=0;
          }
          datos[i]++;
        }
        i++;
      }
    });
    //console.log(labels);
    //console.log(datos);
    setTimeout(()=>{
      this.lineChartDataDia.labels=[];
      this.lineChartDataDia.datasets[0].data=[];
      for (let i = 0; i < labels.length; i++) 
      {
        this.lineChartDataDia.labels?.push(labels[i]);
        this.lineChartDataDia.datasets[0].data.push(datos[i]);
      }
      this.chartDia?.update();
      },50);
  }
  ChartTurnosMedico()
  {
    let valoresPorPuntaje:Array<any> = [];
    for(let esp of this.listaTurnos)
    {
      if(valoresPorPuntaje.length>0)
      {
        let encontrado=false;
        for (let i = 0; i < valoresPorPuntaje.length; i++) {
          if(valoresPorPuntaje[i].label==esp.data.data.especialista)
          {
            encontrado=true;
            break;
          }
        }
        if(!encontrado)
        {
          valoresPorPuntaje.push({pie: esp.data.data.especialista, data: 0});
        }
      }else{
          valoresPorPuntaje.push({pie: esp.data.data.especialista, data: 0});
      }
    }
    this.listaTurnos.forEach( (turno:any) => {
      for(let valor of valoresPorPuntaje)
      {
        if(turno.data.data.especialista == valor.pie)
        {
          valor.y++;
        }
      }
    });
    valoresPorPuntaje = valoresPorPuntaje.filter(e=> e.y != 0);
    setTimeout(()=>{
    this.pieChartDataEspecialista.labels=[];
    this.pieChartDataEspecialista.datasets[0].data=[];
    for (let i = 0; i < this.label.length; i++) {
      this.pieChartDataEspecialista.labels?.push(this.label[i]);
      this.pieChartDataEspecialista.datasets[0].data.push(this.datos[i]);
    }
    this.chartEspecialista?.update();
    },50);
  }
  GetTurnos()
  {
    let arrayAux:string[]=[];
    this.firestore.getCollection("turnos").then((turnos)=>{
      turnos.forEach((turnosAux:any)=>{
        //console.log(data.data.data.especialista);
        this.firestore.getCollection("especialistas").then((especialistas)=>{
          especialistas.forEach((especialistasAux:any)=>{
            //console.log(data.data.data.especialista);
            let especialista= especialistasAux.data.especialista.nombre+" "+especialistasAux.data.especialista.apellido;
            if(turnosAux.data.data.especialista==especialistasAux.id)
            {
              turnosAux.data.data.especialista;
              this.listaTurnos.push(turnosAux);
              if(!this.label.includes(especialista))
              {

                this.labelArray.push(arrayAux);
                this.label.push(especialista);
                //this.labelArray.push(arrayAux);

                if(this.datos[this.label.indexOf(especialista)]==undefined)
                {
                  this.datos[this.label.indexOf(especialista)]=0;
                }else{
                  this.datos[this.label.indexOf(especialista)]+=1;
                }
              }else{
                if(this.datos[this.label.indexOf(especialista)]==undefined)
                {
                  this.datos[this.label.indexOf(especialista)]=0;
                }else{
                  this.datos[this.label.indexOf(especialista)]+=1;
                }
              }
              arrayAux=[];
              //this.turnoList.push(paciente);
              //console.log(paciente);
            }
          })
          this.ChartMedicosEspecialidad();
          this.ChartInformeVisitas();
          this.ChartVisitas();
          this.ChartAprobados();
          this.ChartAtencion();
          this.ChartEstrellas();
          this.ChartRapidez();
          this.ChartPaciente();

          this.ChartTurnosMedico();
          this.ChartEspecialidades();
          this.ChartDia();
          this.GetMedicosEspecialidad();
          this.GetVisitas();
          this.GetInformeVisitas();
          this.GetAprobados();
          this.GetAtencion();
          this.GetEstrellas();
          this.GetRapidez();
          this.GetPaciente();
        })
      })
    })
  }
  GetMedicosEspecialidad()
  {
    let listaEspecialistas:any[]=[];
    this.firestore.getCollection("especialistas").then((especialistas)=>{
      especialistas.forEach((especialistasAux:any)=>{
        listaEspecialistas.push(especialistasAux);
      })
    })
    //console.log(listaEspecialistas);
    let auxListaEspecialidades:any[]=[];
    for(let esp of this.listaTurnos)
      {
        if(auxListaEspecialidades.length>0)
        {
          let encontrado=false;
          for (let i = 0; i < auxListaEspecialidades.length; i++) {
            if(auxListaEspecialidades[i].name==esp.data.data.especialidad)
            {
              encontrado=true;
              break;
            }
          }
          if(!encontrado)
          {
            auxListaEspecialidades.push({id:esp.id,name:esp.data.data.especialidad,cantidad:0});
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
          }
        }else{
          auxListaEspecialidades.push({id:esp.id,name:esp.data.data.especialidad,cantidad:0});
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
        }
      }
    
    //recorro los turnos
    this.listaTurnos.forEach(turno=>{
      //console.log(turno);
      auxListaEspecialidades.forEach(especialidad=>{
        if(especialidad.name === turno.data.data.especialidad){
          especialidad.cantidad++
        }
      })
    })


    let auxLabelsGraficoTurnoxEspecialidades:any[]=[]
    let auxValuesGraficoTurnoxEspecialidades:number[]=[]

    auxListaEspecialidades.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name)
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad)
    })

    this.dataLabelGraficoTurnoxEspecialidades = auxLabelsGraficoTurnoxEspecialidades
    this.auxValuesGraficoTurnoxEspecialidades = auxValuesGraficoTurnoxEspecialidades
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartMedicosEspecialidad(){
    if(this.chartMedicoEspecialidad!=null)
    {
      this.chartMedicoEspecialidad.destroy();
    }
    this.chartMedicoEspecialidad = new Chart('chartMedicoEspecialidad', {
      type: 'bar',
      data: {
          labels: this.dataLabelGraficoTurnoxEspecialidades,
          datasets: [{
              label: '# medicos por especialidad',
              data: this.auxValuesGraficoTurnoxEspecialidades,
      borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  ChartVisitas(){
    if(this.chartVisitas!=null)
    {
      this.chartVisitas.destroy();
    }
    this.chartVisitas = new Chart('chartVisitas', {
      type: 'pie',
      data: {
          labels: this.dataLabelVisitasPorPaciente,
          datasets: [{
              label: '#visitas por paciente',
              data: this.auxValuesdataLabelVisitasPorPaciente,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetVisitas()
  {
    let auxListaPacientes:any[]=[];
    for(let esp of this.listaLogger)
      {
        if(auxListaPacientes.length>0)
        {
          let encontrado=false;
          for (let i = 0; i < auxListaPacientes.length; i++) {
            if(auxListaPacientes[i].name==esp.data.email)
            {
              encontrado=true;
              break;
            }
          }
          if(!encontrado)
          {
            auxListaPacientes.push({id:esp.id,name:esp.data.email,cantidad:0});
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
          }
        }else{
          auxListaPacientes.push({id:esp.id,name:esp.data.email,cantidad:0});
            //valoresPorPuntaje.push({pie: esp.data.data.especialidad, data: 0});
        }
      }
    
    this.listaLogger.forEach(turno=>{
      //console.log(turno);
      auxListaPacientes.forEach(especialidad=>{
        if(especialidad.id === turno.id){
          especialidad.cantidad++
        }
      })
    })
    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelVisitasPorPaciente = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesdataLabelVisitasPorPaciente = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartInformeVisitas(){
    if(this.chartInformesVisitas!=null)
    {
      this.chartInformesVisitas.destroy();
    }
    this.chartInformesVisitas = new Chart('chartInformeVisitas', {
      type: 'pie',
      data: {
          labels: this.dataLabelInformeVisitas,
          datasets: [{
              label: '#visitas vs informes',
              data: this.auxValuesInformeVisitas,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetInformeVisitas()
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"visitas",cantidad:0});
    auxListaPacientes.push({id:1,name:"encuestas",cantidad:0});
    this.listaLogger.forEach(turno=>{
      auxListaPacientes[0].cantidad++;
    })
    this.listaEncuestas.forEach(turno=>{
      auxListaPacientes[1].cantidad++;
    })

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelInformeVisitas = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesInformeVisitas = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartAprobados(){
    if(this.chartAprobado!=null)
    {
      this.chartAprobado.destroy();
    }
    this.chartAprobado = new Chart('chartAprobado', {
      type: 'pie',
      data: {
          labels: this.dataLabelAprobados,
          datasets: [{
              label: '#aprobado vs desaprobado',
              data: this.auxValuesAprobados,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetAprobados()
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"aprobado",cantidad:0});
    auxListaPacientes.push({id:1,name:"desaprobado",cantidad:0});
    this.listaEncuestas.forEach(turno=>{
      //console.log(turno);
      if(turno.data.data.aprobado=="true")
      {
        auxListaPacientes[0].cantidad++;
      }else{
        auxListaPacientes[1].cantidad++;
      }
    })

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelAprobados = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesAprobados = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartAtencion(){
    if(this.chartAtencion!=null)
    {
      this.chartAtencion.destroy();
    }
    this.chartAtencion = new Chart('chartAtencion', {
      type: 'pie',
      data: {
          labels: this.dataLabelAtencion,
          datasets: [{
              label: '#puntaje atencion',
              data: this.auxValuesAtencion,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetAtencion()
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"Mala",cantidad:0});
    auxListaPacientes.push({id:1,name:"Media",cantidad:0});
    auxListaPacientes.push({id:2,name:"Excelente",cantidad:0});

    this.listaEncuestas.forEach(turno=>{
      //console.log(turno);
      if(turno.data.data.atencion==0)
      {
        auxListaPacientes[0].cantidad++;
      }else if(turno.data.data.atencion==1){
        auxListaPacientes[1].cantidad++;
      }else{
        auxListaPacientes[2].cantidad++;
      }
    })

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelAtencion = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesAtencion = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  GetEstrellas()
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"1 Estrellas",cantidad:0});
    auxListaPacientes.push({id:1,name:"2 Estrellas",cantidad:0});
    auxListaPacientes.push({id:2,name:"3 Estrellas",cantidad:0});
    auxListaPacientes.push({id:3,name:"4 Estrellas",cantidad:0});
    auxListaPacientes.push({id:4,name:"5 Estrellas",cantidad:0});

    this.listaEncuestas.forEach(turno=>{
      //console.log(turno);
      if(turno.data.data.estrellas==1)
      {
        auxListaPacientes[0].cantidad++;
      }else if(turno.data.data.estrellas==2){
        auxListaPacientes[1].cantidad++;
      }else if(turno.data.data.estrellas==3){
        auxListaPacientes[2].cantidad++;
      }else if(turno.data.data.estrellas==4){
        auxListaPacientes[3].cantidad++;
      }else{
        auxListaPacientes[4].cantidad++;
      }
    })

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelEstrellas = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesEstrellas = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartEstrellas(){
    if(this.chartEstrellas!=null)
    {
      this.chartEstrellas.destroy();
    }
    this.chartEstrellas = new Chart('chartEstrellas', {
      type: 'pie',
      data: {
          labels: this.dataLabelEstrellas,
          datasets: [{
              label: '#estrellas atencion',
              data: this.auxValuesEstrellas,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetRapidez()
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"1",cantidad:0});
    auxListaPacientes.push({id:1,name:"2",cantidad:0});
    auxListaPacientes.push({id:2,name:"3",cantidad:0});
    auxListaPacientes.push({id:2,name:"4",cantidad:0});
    auxListaPacientes.push({id:2,name:"5",cantidad:0});
    auxListaPacientes.push({id:2,name:"6",cantidad:0});
    auxListaPacientes.push({id:2,name:"7",cantidad:0});
    auxListaPacientes.push({id:2,name:"8",cantidad:0});
    auxListaPacientes.push({id:2,name:"9",cantidad:0});
    auxListaPacientes.push({id:2,name:"10",cantidad:0});


    this.listaEncuestas.forEach(turno=>{
      //console.log(turno);
      switch(turno.data.data.rapidez)
      {
        case "1":
          auxListaPacientes[0].cantidad++;
          break;
        case "2":
          auxListaPacientes[1].cantidad++;
          break;
        case "3":
          auxListaPacientes[2].cantidad++;
          break;
        case "4":
          auxListaPacientes[3].cantidad++;
          break;
        case "5":
          auxListaPacientes[4].cantidad++;
          break;
        case "6":
          auxListaPacientes[5].cantidad++;
          break;
        case "7":
          auxListaPacientes[6].cantidad++;
          break;
        case "8":
          auxListaPacientes[7].cantidad++;
          break;
        case "9":
          auxListaPacientes[8].cantidad++;
          break;
        default:
          auxListaPacientes[9].cantidad++;
          break;
      }
    })

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelRapidez = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesRapidez = auxValuesGraficoTurnoxEspecialidades;
    //console.log(this.dataLabelGraficoTurnoxEspecialidades);
    //console.log(this.auxValuesGraficoTurnoxEspecialidades)

    //this.data.series=auxSerie

    //this.datosListosTurnosxEspecialidades=true
  }
  ChartRapidez(){
    if(this.chartRapidez!=null)
    {
      this.chartRapidez.destroy();
    }
    this.chartRapidez = new Chart('chartRapidez', {
      type: 'pie',
      data: {
          labels: this.dataLabelRapidez,
          datasets: [{
              label: '#puntaje atencion',
              data: this.auxValuesRapidez,
              borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }
  GetPaciente(id?:string)
  {
    let auxListaPacientes:any[]=[];
    auxListaPacientes.push({id:0,name:"pendientes",cantidad:0});
    auxListaPacientes.push({id:1,name:"cancelado",cantidad:0});
    auxListaPacientes.push({id:2,name:"finalizado",cantidad:0});

    this.listaTurnos.forEach(turno=>{
      //console.log(turno);
      if(id!=undefined)
      {
        if(turno.data.data.paciente==id)
        {
          switch(turno.data.data.estado)
          {
            case "":
              auxListaPacientes[0].cantidad++;
              break;
            case "cancelado":
              auxListaPacientes[1].cantidad++;
              break;
            case "finalizado":
              auxListaPacientes[2].cantidad++;
              break;
          }
        }
      }else{
        switch(turno.data.data.estado)
        {
          case "":
            auxListaPacientes[0].cantidad++;
            break;
          case "cancelado":
            auxListaPacientes[1].cantidad++;
            break;
          case "finalizado":
            auxListaPacientes[2].cantidad++;
            break;
        }
      }
    })

  this.dataLabelPaciente=[];
  this.auxValuesPaciente=[];


    console.log(auxListaPacientes[0].cantidad);
    console.log(auxListaPacientes[1].cantidad);
    console.log(auxListaPacientes[2].cantidad);

    let auxLabelsGraficoTurnoxEspecialidades:any[]=[];
    let auxValuesGraficoTurnoxEspecialidades:number[]=[];

    auxListaPacientes.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name);
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad);
    })

    this.dataLabelPaciente = auxLabelsGraficoTurnoxEspecialidades;
    this.auxValuesPaciente = auxValuesGraficoTurnoxEspecialidades;
    this.ChartPaciente();
  }
  ChartPaciente(){
    if(this.chartPaciente!=null)
    {
      this.chartPaciente.destroy();
      this.chartPaciente = new Chart('chartPaciente', {
        type: 'pie',
        data: {
            labels: this.dataLabelPaciente,
            datasets: [{
                label: '#puntaje atencion',
                data: this.auxValuesPaciente,
                borderColor: 'rgb(75, 192, 192)',
          }]
        }
      });
      (<Chart>this.chartPaciente).draw();
    }else{
      this.chartPaciente = new Chart('chartPaciente', {
        type: 'pie',
        data: {
            labels: this.dataLabelPaciente,
            datasets: [{
                label: '#puntaje atencion',
                data: this.auxValuesPaciente,
                borderColor: 'rgb(75, 192, 192)',
          }]
        }
      });
    }
  }
  ElegirPersona(evento:any)
  {
    this.GetPaciente(evento.target.value);
    console.log(evento.target.value);
  }
  @ViewChild(BaseChartDirective) chartEspecialista: BaseChartDirective | undefined;
  public pieChartDataEspecialista: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {data: []} ]
  };

  @ViewChild(BaseChartDirective) chartEspecialistaFinalizado: BaseChartDirective | undefined;
  public pieChartDataEspecialistaFinalizado: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {data: []} ]
  };

  @ViewChild(BaseChartDirective) chartEspecialidad: BaseChartDirective | undefined;
  public barChartDataEspecialidad: ChartData<'bar', number[], string | string[]> = {
    labels: [],
    datasets: [ {data: []} ]
  };

  @ViewChild(BaseChartDirective) chartDia: BaseChartDirective | undefined;
  public lineChartDataDia: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {data: []} ]
  };


  DescargarExcelLogs(){
    //getting data from our table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('logsTabla');
    var table_html = table_div!.outerHTML.replace(/ /g, '%20');
    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'Pacientes.xls';
    a.click();
  }

  turnosRealizadosTemp(fechaInicio:Date,fechaFinal:Date){

    let retorno = false;

    let auxTurnos = this.listaTurnos;

    let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.data.data.fecha);
      fechaFinal.setHours(23);
      fechaFinal.setMinutes(59);
      fechaFinal.setSeconds(59);
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal&&turno.data.data.estado=="finalizado";
    })

    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
      return {especialista:`${value.data.data.especialista}`,cantidad:0} ;
    })

    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
    arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = hash[current.especialista?current.especialista:''] = true;
      return exists;
    });

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.data.data.especialista === especialstaSinRepetir.especialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    this.pieChartDataEspecialistaFinalizado.labels=[];
    this.pieChartDataEspecialistaFinalizado.datasets[0].data=[];

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      this.firestore.getCollection("especialistas").then((especialistas)=>{
        especialistas.forEach((especialistasAux:any)=>{

          let especialista= especialistasAux.data.especialista.nombre+" "+especialistasAux.data.especialista.apellido;
          if(value.especialista==especialistasAux.id)
          {
            value.especialista=especialista;
            console.log(value);
          }
        })
        this.pieChartDataEspecialistaFinalizado.labels?.push(`${value.especialista}(${value.cantidad})`);
        this.pieChartDataEspecialistaFinalizado.datasets[0].data.push(value.cantidad);
        this.chartEspecialistaFinalizado?.update();
      })
    })
    return retorno
  }

  turnosSolicitadosTemp(fechaInicio:Date,fechaFinal:Date){

    let auxTurnos = this.listaTurnos

    console.log('Todos los turnos:')
    console.log(auxTurnos)

    
    let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.data.data.fecha)
      // console.log("fecha actual", auxFechaTurnoActual)
      // console.log("fecha final", fechaFinal)
      fechaFinal.setHours(23)
      fechaFinal.setMinutes(59)
      fechaFinal.setSeconds(59)
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal
    })


    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
    
      return {especialista:`${value.data.data.especialista}`,cantidad:0} 
    })

    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
    arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = !hash[current.especialista?current.especialista:''];
      hash[current.especialista?current.especialista:''] = true;
      return exists;
    });
    

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.data.data.especialista === especialstaSinRepetir.especialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    this.pieChartDataEspecialista.labels=[];
    this.pieChartDataEspecialista.datasets[0].data=[];

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      this.firestore.getCollection("especialistas").then((especialistas)=>{
        especialistas.forEach((especialistasAux:any)=>{

          let especialista= especialistasAux.data.especialista.nombre+" "+especialistasAux.data.especialista.apellido;
          if(value.especialista==especialistasAux.id)
          {
            value.especialista=especialista;
            console.log(value);
          }
        })
        this.pieChartDataEspecialista.labels?.push(`${value.especialista}(${value.cantidad})`);
        this.pieChartDataEspecialista.datasets[0].data.push(value.cantidad);
        this.chartEspecialista?.update();
      })
    })


    //this.dataLabel4 = auxLabelsTurnosSolicitados
    //this.serie4=auxValuesTurnosSolicitados

    //this.turnosSolicitadosTempGrafico()

    return true
  }

  seleccionarFechas(){
    let newFechaInicio = new Date(this.formaFechasSolicitado.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechasSolicitado.value.fechaFinal)
  
    this.fechaInicioTurnosSolicitado=newFechaInicio
    this.fechaFinalTurnosSolicitado=newFechaFinal

    let rtaCargarGrafico =this.turnosSolicitadosTemp(newFechaInicio,newFechaFinal)
    
    if(rtaCargarGrafico){
      //this.showFechasTurnoSolicitados = false
      //this.especialistaSelected = new Especialista()
    }
  }
  seleccionarFechasTurnoFinalizado(){

    let newFechaInicio = new Date(this.formaFechasFinalizado.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechasFinalizado.value.fechaFinal)
  
    this.fechaInicioTurnosFinalizado=newFechaInicio
    this.fechaFinalTurnosFinalizados=newFechaFinal
    
    let rtaCargarGrafico =  this.turnosRealizadosTemp(newFechaInicio,newFechaFinal)
    //this.showFechasTurnoFinalizado = false

    //this.hayDatosTurnoFinalizado = rtaCargarGrafico
  }
  generatePDF() { 
    document.getElementById("formFechaSolicitado")!.style.display="none";
    document.getElementById("formFechaFinalizado")!.style.display="none";

    html2canvas(this.element.nativeElement).then((canvas)=>{
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });
      const imageProps = pdf.getImageProperties(imgData);
      console.log(imageProps.height);
      const pdfw = pdf.internal.pageSize.getWidth();
      const pdfh = (imageProps.height* pdfw)/ imageProps.width;
      console.log(pdfw);
      console.log(pdfh);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);
      pdf.output('dataurlnewwindow');
    })
    let pdf2 = new jsPDF('p','pt','a4');
    pdf2.html(this.element.nativeElement,{
      callback:(pdf)=>{
        pdf.save(`grafico.pdf`);
      }
    })
    
    document.getElementById("formFechaSolicitado")!.style.display="block";
    document.getElementById("formFechaFinalizado")!.style.display="block";
  }
  generatePDF2() { 
    html2canvas(this.element2.nativeElement).then((canvas)=>{
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });
      const imageProps = pdf.getImageProperties(imgData);
      console.log(imageProps.height);
      const pdfw = pdf.internal.pageSize.getWidth();
      const pdfh = (imageProps.height* pdfw)/ imageProps.width;
      console.log(pdfw);
      console.log(pdfh);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);
      pdf.output('dataurlnewwindow');
    })
    /*let pdf = new jsPDF('p','pt','a4');
    pdf.html(this.element2.nativeElement,{
      callback:(pdf)=>{
        pdf.save(`grafico3.pdf`);
      }
    })*/
  }
  generatePDFFinalizados(){
    html2canvas(this.element3.nativeElement).then((canvas)=>{
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });
      const imageProps = pdf.getImageProperties(imgData);
      console.log(imageProps.height);
      const pdfw = pdf.internal.pageSize.getWidth();
      const pdfh = (imageProps.height* pdfw)/ imageProps.width;
      console.log(pdfw);
      console.log(pdfh);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);
      pdf.output('dataurlnewwindow');
    })
  }
}
