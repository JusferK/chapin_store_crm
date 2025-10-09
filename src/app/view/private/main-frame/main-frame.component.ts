import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-frame',
  standalone: false,
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.scss'
})
export class MainFrameComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  items: WritableSignal<MenuItem[]> = signal([]);

  ngOnInit(): void {
    this.initMenuList();
  }

  private initMenuList(): void {
    const menuList = this._activatedRoute.snapshot.data['menuList'] as MenuItem[];
    this.items.set(menuList);
    console.log(menuList);
  }

}
