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
  public showLoading: Boolean;
  public category: string;

  constructor(
    private _userService: UserService,
    private _favoriteService: FavoriteService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService
  ) {
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.title = 'Wellcome to MyFavoriteAppliances';
    this.identity = this._userService.getIdentity();
  }

  ngOnInit() {

  }

  userLogin() {
    const userLogin = localStorage.getItem('token');
    if (userLogin) {
      return true;
    }
  }

  orderBy(category, orderBy) {
    if (category === 'dishwashers') { this.getDishwasher(orderBy); }
    if (category === 'small-appliances') { this.getSmallAppliances(orderBy); }
  }

  getDishwasher(orderBy) {
    this.category = 'dishwashers';
    this.showLoading = true;
    this._productService.getDishwashers(orderBy).subscribe(
      response => {
        this.products = response.products;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getSmallAppliances(orderBy) {
    this.category = 'small-appliances';
    this.showLoading = true;
    this._productService.getSmallAppliances(orderBy).subscribe(
      response => {
        this.products = response.products;
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
