import { HttpClient} from '@angular/common/http';
import { Promotion } from '../../shared/promotion';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { baseURL } from '../../shared/baseurl';
import { ProcessHttpmsgProvider } from '../process-httpmsg/process-httpmsg';
import { map, catchError } from 'rxjs/operators';

/*
  Generated class for the PromotionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PromotionProvider {

  constructor(public http: HttpClient, private processHttpmsgService: ProcessHttpmsgProvider) {
    console.log('Hello PromotionProvider Provider');
  }

  getPromotions(): Observable<Promotion[] | any> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHttpmsgService.handleError));
  }

  getPromotion(id: number): Observable<Promotion | any> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
      .pipe(catchError(this.processHttpmsgService.handleError));

  }

  getFeaturedPromotion(): Observable<Promotion | any>{
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
      .pipe(map(res => res[0]))
      .pipe(catchError(this.processHttpmsgService.handleError));
  }

}
