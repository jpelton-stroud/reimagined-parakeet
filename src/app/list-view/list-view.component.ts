import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.sass'],
})
export class ListViewComponent implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() items: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
