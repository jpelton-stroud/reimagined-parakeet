import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// @angular/fire
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';

// @angular/material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';

// app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListViewComponent } from './list-view/list-view.component';
import { LegislationComponent } from './legislation/legislation.component';
import { LegislatureComponent } from './legislature/legislature.component';

@NgModule({
  declarations: [AppComponent, ListViewComponent, LegislationComponent, LegislatureComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatTableModule,
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
