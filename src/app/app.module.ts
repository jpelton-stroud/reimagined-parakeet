import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// AngularFire modules
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListViewComponent } from './list-view/list-view.component';

@NgModule({
  declarations: [AppComponent, ListViewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    {
      provide: SETTINGS,
      useValue: environment.emulator
        ? {
            host: 'localhost:8080',
            ssl: false,
          }
        : undefined,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
