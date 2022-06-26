import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[setNoche]'
})
export class ElementoNocheDirective {

  constructor(element:ElementRef) {
    element.nativeElement.style.backgroundColor='#72A0C1';
  }
}
