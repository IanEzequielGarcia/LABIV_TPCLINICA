import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../servicios/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private firestore:FirebaseService,private router:Router){

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>{
      let user = await this.firestore.isLoggedIn();
      let esAdmin = false;

        this.firestore.getCollection("admins").then(async(pacientesAux)=>{
        pacientesAux.forEach((paciente:any)=>{
          console.log(paciente.data.admin);
          if(paciente.data.admin.tipo=="admin")
          {
            console.log("entro");
            esAdmin=true;
          }
        }
        )
      })
      console.log(esAdmin);
      let loggeado = user? true:false;
      if(loggeado&&esAdmin){
        return true;
      }else
      {
        this.router.navigateByUrl('bienvenido');
        return false;
      }
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
