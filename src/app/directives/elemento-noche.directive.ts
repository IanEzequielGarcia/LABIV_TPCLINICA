import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[setNoche]'
})
export class ElementoNocheDirective {

  constructor(private element : ElementRef) 
  { 
    element.nativeElement.style.color="#000000";
  }

  cambiarColor(color:string)
  {
    this.element.nativeElement.style.color = color;
  }

  @HostListener('mouseenter') onMouseEnter() 
  {
    this.cambiarColor('#ff0000');
  }
  
  @HostListener('mouseleave') onMouseLeave() 
  {
    this.cambiarColor("#000000");
  }
}
