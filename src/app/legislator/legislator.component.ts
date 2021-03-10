import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Legislator } from '../types/legislator';

@Component({
  selector: 'app-legislator',
  templateUrl: './legislator.component.html',
  styleUrls: ['./legislator.component.sass'],
})
export class LegislatorComponent implements OnInit {
  public legislatorCollection$: Observable<Legislator[]>;
  public legislator: Legislator = {
    name: `legislator not found.
      If your internet connection is slow it may show up in a sec, 
      otherwise please check the bill number & try again`,
    identifier: '',
    chamber: '',
    sponsorships: [],
  };

  constructor(
    public readonly db: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.legislatorCollection$ = this.db
      .collection<Legislator>('legislators', (ref) =>
        ref.where(
          'identifier',
          '==',
          this.route.snapshot.paramMap.get('legislatorId')
        )
      )
      .valueChanges();
    this.legislatorCollection$.subscribe((data) => {
      if (data.length > 1) throw new Error('too many results');
      else this.legislator = data[0];
    });
  }

  ngOnInit(): void {}
}
