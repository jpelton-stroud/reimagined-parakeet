import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.sass'],
})
export class ListViewComponent implements OnInit {
  @Input() items: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
