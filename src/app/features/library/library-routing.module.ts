import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BooksMainPage} from "./pages/books-main/books-main.page";
import {BookPage} from "./pages/book/book.page";


const routes: Routes = [
  {
    path: '',
    component: BooksMainPage
  },
  {
    path: ':id',
    component: BookPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
