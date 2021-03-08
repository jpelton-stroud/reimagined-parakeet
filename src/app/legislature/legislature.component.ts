import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Legislation } from '../legislation';
import { Legislator } from '../legislator';

@Component({
  selector: 'app-legislature',
  templateUrl: './legislature.component.html',
  styleUrls: ['./legislature.component.sass'],
})
export class LegislatureComponent implements OnInit {
  public legislationCollection$: Observable<Legislation[]>;
  public legislatorCollection$: Observable<Legislator[]>;
  public legislation: Legislation[] = [];
  public legislators: Legislator[] = [];

  constructor(public readonly db: AngularFirestore) {
    this.legislationCollection$ = this.db
      .collection<Legislation>('legislation')
      .valueChanges();
    this.legislatorCollection$ = this.db
      .collection<Legislator>('legislators')
      .valueChanges();
    this.legislationCollection$.subscribe((data) => (this.legislation = data));
    this.legislatorCollection$.subscribe((data) => (this.legislators = data));
  }

  ngOnInit(): void {}
}
