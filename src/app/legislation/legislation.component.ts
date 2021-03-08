import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Legislation } from '../legislation';

@Component({
  selector: 'app-legislation',
  templateUrl: './legislation.component.html',
  styleUrls: ['./legislation.component.sass'],
})
export class LegislationComponent implements OnInit {
  public legislationCollection$: Observable<Legislation[]>;
  public bill: Legislation = {
    name: `bill number not found.
      If your internet connection is slow it may show up in a sec, 
      otherwise please check the bill number & try again`,
    identifier: '',
    sponsorships: [],
  };

  constructor(
    public readonly db: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.legislationCollection$ = this.db
      .collection<Legislation>('legislation', (ref) =>
        ref.where(
          'identifier',
          '==',
          this.route.snapshot.paramMap.get('billId')
        )
      )
      .valueChanges();
    this.legislationCollection$.subscribe((data) => {
      if (data.length > 1) throw new Error('too many results');
      else this.bill = data[0];
    });
  }

  ngOnInit(): void {}
}
