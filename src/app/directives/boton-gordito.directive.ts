import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appBotonGordito]'
})
export class BotonGorditoDirective {
  constructor(private element : ElementRef) 
  { 
    element.nativeElement.style.transform = ("none");
  }

  cambiarEscala(escala:string)
  {
    this.element.nativeElement.style.transform = (escala);
  }
  @HostListener('mouseenter') onMouseEnter() 
  {
    this.cambiarEscala("scale(0.95)");
  }
  
  @HostListener('mouseleave') onMouseLeave() 
  {
    this.cambiarEscala("none"); 
  }
}
