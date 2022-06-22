import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../servicios/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaGuardGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private firestore:FirebaseService,private router:Router){

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>{
        let esAdmin = false;
        this.firestore.getCollection("especialistas").then(async(pacientesAux)=>
        {
          let user = await this.firestore.InfoUsuario();
          pacientesAux.forEach(async (paciente:any)=>{
          //console.log(paciente.data.admin);
          //console.log(paciente.data.admin.email);
          //console.log(user?.email);
          if(paciente.data.especialista.email.toLowerCase()==user?.email)
          {
            //console.log("entro");
            esAdmin=true;
          }
        }
        )
      }
      )
        this.firestore.getCollection("admins").then(async(pacientesAux)=>
        {
          let user = await this.firestore.InfoUsuario();
          //let esAdmin = false;
          pacientesAux.forEach(async (paciente:any)=>{
          //console.log(paciente.data.admin);
          //console.log(paciente.data.admin.email);
          //console.log(user?.email);
          if(paciente.data.admin.email.toLowerCase()==user?.email)
          {
            //console.log("entro");
            esAdmin=true;
          }
        }
        )
        if(!esAdmin){
          this.router.navigateByUrl('bienvenido');
        }
      })
      
      return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
