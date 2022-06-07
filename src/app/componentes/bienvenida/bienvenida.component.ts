import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {
  estaLogueado = this.firestore.isLoggedIn();
  constructor(public firestore:FirebaseService) {
   }

  ngOnInit(): void {
  }


}
