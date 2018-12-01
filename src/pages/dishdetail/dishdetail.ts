import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController  } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';
import { DishProvider } from '../../providers/dish/dish';
import { SocialSharing } from '@ionic-native/social-sharing';



/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
    private favoriteservice: FavoriteProvider,
    private actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private dishservice: DishProvider,
    private socialSharing: SocialSharing,
    @Inject('BaseURL') private BaseURL) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites(){
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as a favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  moreOptions(){
    const actionSheet = this.actionsheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add a Comment',
          handler: () => {
            this.openComment();
          }
        },
        {
          text: 'Share via Facebook'.
          handler: () => {
            this.socialSharing.shareViaFacebook(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter'.
          handler: () => {
            this.socialSharing.shareViaTwitter(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked.");
          }
        }
      ]
    });
    actionSheet.present();
  }

  openComment(){
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(data => {
      this.dish.comments.push(data);
      this.dishservice.putDish(this.dish)
        .subscribe(dish => {
          this.dish = dish;
        },
        errmess => { this.dish = null; this.errMess = <any>errmess; });
    });
    modal.present();
  }

}
