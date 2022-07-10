import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartItem,ChartType,registerables } from 'chart.js';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { EspecialistaPipePipe } from 'src/app/pipes/especialista-pipe.pipe';
Chart.register(...registerables);
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {
  listaLogger:any[]=[];
  listaTurnos:any[]=[];
  label:string[]=[];
  labelArray:string[][]=[];
  datos:number[]=[];
  constructor(private firestore:FirebaseService) { }
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
          console.log(valor);
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
    console.log(labels);
    console.log(datos);
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

}
