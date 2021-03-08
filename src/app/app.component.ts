import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface test {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'legislative-tracker';

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
}
