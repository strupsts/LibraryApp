import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';



import {BooksMainPage} from "./pages/books-main/books-main.page";
import {BookPage} from "./pages/book/book.page";
import {BookCardComponent} from "./components/book-card/book-card.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {BookCreatorPage} from "./pages/book-creator/book-creator.page";
import {AuthorsListPage} from "./pages/authors-list/authors-list.page";
import {AuthorCardComponent} from "./components/author-card/author-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,

    SharedModule,
  ],
  declarations: [
    BookPage,
    BooksMainPage,
    BookCardComponent,
    BookCreatorPage,
    AuthorsListPage,
    AuthorCardComponent
  ]
})
export class LibraryModule {}
