export interface Administrator {
  username:               string;
  isActive:               boolean;
}

export type AdministratorData = Administrator & {
  jwt:                    string;
};

export type LogoutResponse = {
  logout:                 boolean;
};

export interface IProduct {
  description:              string;
  productId?:               number;
  price:                    number;
  image:                    string;
  stock:                    number;
  name:                     string;
}
export interface ICategory {
  categoryId?:           number;
  name:                 string;
  description:          string;
}
