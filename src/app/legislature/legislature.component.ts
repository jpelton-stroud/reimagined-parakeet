import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface test {
  name: string;
}

@Component({
  selector: 'app-legislature',
  templateUrl: './legislature.component.html',
  styleUrls: ['./legislature.component.sass'],
})
export class LegislatureComponent implements OnInit {
  public legislationCollection$: Observable<test[]>;
  public legislatorCollection$: Observable<test[]>;
  public legislation: test[] = [];
  public legislators: test[] = [];

  constructor(public readonly db: AngularFirestore) {
    this.legislationCollection$ = this.db
      .collection<test>('legislation')
      .valueChanges();
    this.legislatorCollection$ = this.db
      .collection<test>('legislators')
      .valueChanges();
    this.legislationCollection$.subscribe((data) => (this.legislation = data));
    this.legislatorCollection$.subscribe((data) => (this.legislators = data));
  }

  ngOnInit(): void {}
}
