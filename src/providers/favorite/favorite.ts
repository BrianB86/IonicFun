import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dish } from '../../shared/dish';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { DishProvider } from '../dish/dish';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { map, filter } from 'rxjs/operators';
/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;

  constructor(public http: HttpClient,
    private dishservice: DishProvider,
    private storage: Storage,
    private localNotifications: LocalNotifications) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];

    storage.forEach((value, key, index) => {
      storage.get(key).then(favorites => {
        if (favorites) {
          this.favorites.push(favorites);
        } else {
          console.log('no favorites defined');
        }
      });
    }).then( () => {
      console.log("finished");
    });
  }

  addFavorite(id: number): boolean {
    if (!this.isFavorite(id)) {
      this.favorites.push(id);
      this.storage.set('favorites ' + this.favorites.indexOf(id), this.favorites[this.favorites.length - 1]);

      this.localNotifications.schedule({
        id: id,
        text: 'Dish ' + id +' added as a favorite successfully'
      });
    }
    return true;
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
      .pipe(map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id))));
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if (index >= 0) {
      this.storage.remove('favorites ' + this.favorites.indexOf(id));
      this.favorites.splice(index, 1);
      return this.getFavorites();
    } else {
      console.log("Deleting non-existant favorite", id);
      return Observable.throw('Deleting non-exisitant favorite' + id);
    }
  }

}
