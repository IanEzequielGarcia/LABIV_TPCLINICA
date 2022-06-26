import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartItem,ChartType,registerables } from 'chart.js';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
Chart.register(...registerables);
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {
  listaLogger:any[]=[];
  listaTurnos:any[]=[];
  label:any[]=[];
  datos:any[]=[];
  especialistaClaveValor: {[key: string]: number}= {};
  constructor(private firestore:FirebaseService) { }
  ngOnInit(): void {
    this.GetLogs();
    this.GetTurnos();
    
    this.pieChartData.labels=[];
    this.pieChartData.labels?.push(this.label);
    for (let i = 0; i < this.pieChartData.labels.length; i++) {
      
      //this.pieChartData.datasets[i].data.push(this.datos[i]);
    }
    this.chart?.update();

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
  GetTurnos()
  {
    this.firestore.getCollection("turnos").then(async (turnos)=>{
      turnos.forEach((turnosAux:any)=>{
        //console.log(data.data.data.especialista);
        this.firestore.getCollection("especialistas").then(async (especialistas)=>{
          especialistas.forEach((especialistasAux:any)=>{
            //console.log(data.data.data.especialista);
            let especialista= especialistasAux.data.especialista.nombre+" "+especialistasAux.data.especialista.apellido;
            if(turnosAux.data.data.especialista==especialistasAux.id)
            {
              turnosAux.data.data.especialista=especialista;
              this.listaTurnos.push(turnosAux);
              
              if(!this.label.includes(especialista))
              {
                this.label.push(especialista);
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
                this.especialistaClaveValor[`${especialista}`]+=1;
              }

              //console.log(this.especialistaClaveValor);
              //this.turnoList.push(paciente);
              //console.log(paciente);
            }
          })
        })
      })
    })
    setTimeout(()=>{
      console.log(this.label);
      console.log(this.datos);
    },50);
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: []
    } ]
  };
  public pieChartType: ChartType = 'pie';
  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeLabels(): void {
    const words = [ 'hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
      'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
      'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
      'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
      'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny' ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartData.labels = new Array(3).map(_ => randomWord());

    this.chart?.update();
  }

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push([ 'Line 1', 'Line 2', 'Line 3' ]);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position = this.pieChartOptions.plugins.legend.position === 'left' ? 'top' : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display = !this.pieChartOptions.plugins.legend.display;
    }
    this.chart?.render();
  }
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
