import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {
  @Output() completadoEvent = new EventEmitter<string>();
  @Input() captchaInput: string="";

  constructor() {
    this.CargarCaptcha();
  }
  allCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
  'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
  't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  ngOnInit(): void {
  }
  getCaptcha(){
    for (let i = 0; i < 6; i++) { //getting 6 random characters from the array
      let randomCharacter = this.allCharacters[Math.floor(Math.random() * this.allCharacters.length)];
      (<HTMLInputElement> document.querySelector(".captcha")).innerText += ` ${randomCharacter}`; //passing 6 random characters inside captcha innerText
      //console.log(this.captcha.innerText);
    }
  }
  CheckButton(){
    //e.preventDefault(); //preventing button from it's default behaviour
    (<HTMLInputElement> document.querySelector(".status-text")).style.display  = "block";
    //adding space after each character of user entered values because I've added spaces while generating captcha
    let inputVal =(<HTMLInputElement> document.querySelector(".input-area input")).value.split('').join(' ');
    if(inputVal == (<HTMLInputElement> document.querySelector(".captcha")).innerText){ //if captcha matched
      (<HTMLInputElement> document.querySelector(".status-text")).style.color = "#4db2ec";
      (<HTMLInputElement> document.querySelector(".status-text")).innerText = "CAPTCHA Ingresado Correctamente";
      let rta={
        tipo:"especialista",
        resultado:"true"
      }
      if(this.captchaInput=="especialista")
      {
        rta.tipo="especialista",
        rta.resultado="true"
      }else{
        rta.tipo="paciente",
        rta.resultado="true"
      }
      console.log(rta);
      console.log(this.captchaInput);
      this.completadoEvent.emit("true");
    }else{
      (<HTMLInputElement> document.querySelector(".status-text")).style.color = "#ff0000";
      (<HTMLInputElement> document.querySelector(".status-text")).innerText = "ERROR, Reingrese";
    }
  }
  CargarCaptcha(){
    setTimeout(()=>{
      this.ReloadButton();
    },50);
  }
   //calling getCaptcha when the page open
  //calling getCaptcha & removeContent on the reload btn click
  ReloadButton(){
    this.removeContent();
    this.getCaptcha();
  }
  
  removeContent()
  {
    (<HTMLInputElement> document.querySelector(".input-area input")).value = "";
    (<HTMLInputElement> document.querySelector(".captcha")).innerText = "";
    (<HTMLInputElement> document.querySelector(".status-text")).style.display = "none";
  }
  CerrarCaptcha(){
    let rta={
      tipo:"especialista",
      resultado:"true"
    }
    if(this.captchaInput=="especialista")
    {
      rta.tipo="especialista",
      rta.resultado="true"
    }else{
      rta.tipo="paciente",
      rta.resultado="true"
    }
    const el = document.getElementById('captchaMostrar')!;
    if(el.style.display=='block')
    {
      el.style.display = 'none';

      this.completadoEvent.emit(JSON.stringify(rta));
    }else{
      el.style.display = 'block';
    }
  }
}
