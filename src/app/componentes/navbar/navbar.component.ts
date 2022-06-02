import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  estaLogueado = this.firestore.isLoggedIn();
  constructor(public firestore:FirebaseService) {
  }
  async logOut(){
    this.firestore.LogOut();
  }
  ngOnInit(): void {
  }

}
