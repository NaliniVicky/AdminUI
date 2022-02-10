import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUiComponent } from './admin-ui/admin-ui.component';

const routes: Routes = [
  { path: '', component: AdminUiComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
