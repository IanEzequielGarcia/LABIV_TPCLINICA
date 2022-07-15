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
  listaTurnos:any[]=[];
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
          this.ChartTurnosMedico();
          this.ChartEspecialidades();
          this.ChartDia();
        })
      })
    })
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

    //RECORRO TODOS LOS TURNOS Y VOY COMPARANDO POR LOS ESPECIALISTAS YA FILTRADOS
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

    // console.log('turnos fechas indicadas')
    // console.log(listaEspecialistasTurno)


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
    /*html2canvas(this.element2.nativeElement).then((canvas)=>{
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
    })*/
    let pdf = new jsPDF('p','pt','a4');
    pdf.html(this.element2.nativeElement,{
      callback:(pdf)=>{
        pdf.save(`grafico3.pdf`);
      }
    })
  } 
}
