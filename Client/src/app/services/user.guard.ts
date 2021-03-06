import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {UserService} from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private _router: Router, private _userService: UserService) {
  }

  canActivate() {
    const identity = this._userService.getIdentity();
    if (
      identity
      && (identity.role === 'ROLE_USER' || identity.role === 'ROLE_ADMIN'
        || identity.role === 'role_admin' || identity.role === 'role_user'
      )) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
