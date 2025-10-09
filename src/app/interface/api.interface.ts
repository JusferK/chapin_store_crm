import { Administrator } from './model.interface';

export interface Login {
  username:             string;
  password:             string;
}

export interface LoginResponse {
  token:                string;
  data:                 Administrator;
}

export interface MenuListResponse {
  routerLink:           string;
  label:                string;
  icon:                 string;
  id:                   string;
  items:                MenuListResponse[];
}
