import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Favorite} from '../../models/favorite';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {FavoriteService} from '../../services/favorites.service';

@Component({
  selector: 'favorites',
  templateUrl: './favorites.component.html',
  providers: [UserService, FavoriteService]
})
export class FavoritesComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page;
  public favorites: Favorite[];
  public showImage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _favoriteService: FavoriteService
  ) {
    this.title = 'Favorites';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit() {
    this.getFavorites(this.page);
  }

  getFavorites(page, adding = false) {
    this._favoriteService.getFavorites(this.token, page).subscribe(
      response => {
        if (response.favorites) {
          if (!adding) {
            this.favorites = response.favorites;
          } else {
            const arrayA = this.favorites;
            const arrayB = response.favorites;
            this.favorites = arrayA.concat(arrayB);
            $('html, body').animate(
              {scrollTop: $('body').prop('scrollHeight')},
              500
            );
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  refresh(event = null) {
    this.getFavorites(1);
  }

  deleteFavorite(id) {
    this._favoriteService.deleteFavorite(this.token, id).subscribe(
      response => {
        this.refresh();
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
