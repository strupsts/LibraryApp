import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BooksMainPage} from "./pages/books-main/books-main.page";
import {BookPage} from "./pages/book/book.page";
import {BookCreatorPage} from "./pages/book-creator/book-creator.page";
import {AuthorsListPage} from "./pages/authors-list/authors-list.page";


const routes: Routes = [
  {
    path: '',
    component: BooksMainPage
  },
  {
    path: 'create-book',
    component: BookCreatorPage
  },
  {
    path: 'authors',
    component: AuthorsListPage
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
