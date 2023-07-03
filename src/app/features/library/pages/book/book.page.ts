import { Component, OnInit } from '@angular/core';
import {IBook} from "../../../../shared/interfaces/IBook";
import {ApiService} from "../../../../core/services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LibraryService} from "../../services/library.service";

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  genres: string = ''
  book!: IBook

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService
  ) {
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.book = navigation.extras.state['book']
    }
    this.genres = this.libraryService.getCurrentBookGenres(this.book.genre)
         // Ещё один вариант прокинуть пропсы в компонент:
      // this.route.queryParams.subscribe(params => {
      //   this.book = {
      //     id: params['id'],
      //     bookName: params['bookName'],
      //     author: params['author'],
      //     description: params['description'],
      //     pages: params['pages'],
      //     language: params['language'],
      //     genre: params['genre']
      //   }
      // })
  }
}
