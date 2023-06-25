import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'library',
    loadChildren: () => import('./library/library-routing.module').then(m => m.LibraryRoutingModule)
  },
  {
    path: '',   redirectTo: '/library', pathMatch: 'full'
  },
  {
    path: '**',   redirectTo: '/library'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
