import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IAuthors, LibraryService} from "../../services/library.service";
import {Observable} from "rxjs";
import {ILanguages} from "../../../../shared/interfaces/ILanguages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-book-creator',
  templateUrl: './book-creator.page.html',
  styleUrls: ['./book-creator.page.scss'],
})
export class BookCreatorPage implements OnInit {

  authors$: Observable<IAuthors[]>;
  languages: ILanguages[] = [];

  bookForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private libraryService: LibraryService,
              private router: Router
  ) {
    this.bookForm = this.formBuilder.group({
      bookName: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      pages: ['', Validators.required],
      language: ['', Validators.required],
      genre: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.authors$ = this.libraryService.getAuthors();
    this.languages = this.libraryService.getLanguagesList();
  }


  createBook() {
    if (this.bookForm.valid) {
      // Получение значений формы
      const id = this.libraryService.getNewBookID();
      const bookName = this.bookForm.value.bookName;
      const author = this.bookForm.value.author;
      const description = this.bookForm.value.description;
      const pages = this.bookForm.value.pages;
      const language = this.bookForm.value.language;
      const genre = this.bookForm.value.genre;
      let DTO: {}  = {
        id,
        bookName,
        author,
        description,
        language,
        pages,
        genre

        // bookName,
        // author,
        // description,
        // pages,
        // language,
        // genre
      }
      this.libraryService.addBook(DTO)
      this.router.navigate(['/'])

      this.bookForm.reset();
    }
  }

}
