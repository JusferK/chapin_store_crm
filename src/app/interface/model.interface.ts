import { Country, Department, Status } from '../enum/model.enum';

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

export interface ICustomer {
  email:                 string;
  name:                  string;
  lastName:              string;
  dateOfBirth:           Date;
  profilePhoto:          string;
  creationDate:          Date;
  addresses:             IAddress[];
}

export interface IAddress {
  street:                string;
  house:                 string;
  city:                  Department;
  country:               Country;
  neighborhood:          string;
}

export interface IOrder {
  orderRequestId:         number;
  shippingAddress:        string;
  totalAmount:            number;
  status:                 Status;
  estimatedDeliveryDate:  Date;
  orderDate:              Date;
  paymentInfo:            PaymentPublic;
  orderDetail:            IDetail[];
}

export type PaymentPublic = {
  cardHolder:             string;
  lastFourDigits:         number;
}

export interface IDetail {
  detailId:               number;
  subtotal:               number;
  quantity:               number;
  product:                ProductSummary;
}

export type ProductSummary = Omit<IProduct, 'productId' | 'stock'>
