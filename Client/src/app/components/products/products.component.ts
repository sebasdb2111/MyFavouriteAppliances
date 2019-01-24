import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Favorite} from '../../models/favorite';
import {Product} from '../../models/product';
import {FavoriteService} from '../../services/favorites.service';
import {ProductService} from '../../services/products.service';

@Component({
  selector: 'product',
  templateUrl: './products.component.html',
  providers: [UserService, FavoriteService, ProductService]
})
export class ProductsComponent implements OnInit {
  public stats;
  public url;
  public status;
  public identity;
  public favorite: Favorite;
  public title: string;
  public products: Product[];

  constructor(
    private _userService: UserService,
    private _favoriteService: FavoriteService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService
  ) {
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.title = 'Wellcome to MyFavouriteAppliances';
    this.identity = this._userService.getIdentity();
  }

  ngOnInit() {
    this.getDishwasher();
  }

  userLogin() {
    const userLogin = localStorage.getItem('token');
    if (userLogin) {
      return true;
    }
  }

  getDishwasher() {
    this._productService.getDishwashers().subscribe(
      response => {
        this.products = response.products;
        console.log(response);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getSmallAppliances() {
    this._productService.getSmallAppliances().subscribe(
      response => {
        this.products = response.products;
        console.log(response);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  addFavorites(id) {
    const userToken = localStorage.getItem('token');
    this._favoriteService.addFavorite(userToken, id).subscribe();
  }
}
