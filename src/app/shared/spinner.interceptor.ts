import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { SpinnerService } from "../servicios/spinner.service";
@Injectable({
    providedIn:'root'
})
export class SpinnerInterceptor implements HttpInterceptor{
    private totalRequests = 0;
    constructor(private spinnerSvc:SpinnerService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /*
                console.log('caught')
        this.totalRequests++;
        this.spinnerSvc.mostrar();
        return next.handle(req).pipe(
        finalize(() => {
            this.totalRequests--;
            if (this.totalRequests == 0) {
                this.spinnerSvc.esconder();
            }
        })
        );
    
    }
        */
        this.spinnerSvc.mostrar();
        return next.handle(req).pipe(
            finalize(()=>{
                this.spinnerSvc.esconder();
            })
        );
    }

}