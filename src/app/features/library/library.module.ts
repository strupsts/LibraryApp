import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



import {BooksMainPage} from "./pages/books-main/books-main.page";
import {BookPage} from "./pages/book/book.page";
import {BookCardComponent} from "./components/book-card/book-card.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [BookPage, BooksMainPage, BookCardComponent]
})
export class LibraryModule {}
