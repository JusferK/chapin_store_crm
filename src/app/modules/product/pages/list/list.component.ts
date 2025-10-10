import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Pagination } from '../../../../interface/pagination.interface';
import { IProduct } from '../../../../interface/model.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  paginationProducts!: WritableSignal<Pagination<IProduct[]>>;
  products: WritableSignal<IProduct[]> = signal<IProduct[]>([]);

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    const data: Pagination<IProduct[]> = this._activatedRoute.snapshot.data['products'];
    this.paginationProducts = signal<Pagination<IProduct[]>>(data);
    this.products.set(data.content);
  }
}
