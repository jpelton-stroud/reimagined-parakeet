import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface test {
  name: string;
}

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.sass'],
})
export class ListViewComponent implements OnInit {
  @Input() target: string = 'legislation';
  items: test[] = [];

  constructor(public readonly db: AngularFirestore) {}

  ngOnInit(): void {
    let collection$: Observable<any>;

    collection$ = this.db.collection(this.target).valueChanges();
    collection$.subscribe((data) => (this.items = data));
  }
}
