import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegislatureComponent } from './legislature/legislature.component';
import { LegislationComponent } from './legislation/legislation.component';

const routes: Routes = [
  { path: '', component: LegislatureComponent },
  { path: 'bills/:billId', component: LegislationComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
