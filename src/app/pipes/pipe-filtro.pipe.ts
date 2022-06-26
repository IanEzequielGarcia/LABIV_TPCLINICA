import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFiltro'
})
export class PipeFiltroPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value)return null;
    if(!args)return value;
    args = args.toLowerCase();
    console.log(args);
    return value.filter(function(data:any){
        console.log(data);
        return JSON.stringify(data).toLowerCase().includes(args);
    });
}

}
