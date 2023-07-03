import { Pipe, PipeTransform } from '@angular/core';
import {IBook} from "../interfaces/IBook";

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(
    books: IBook[],
    search: string,
    genre: number | false,
    languages: string[],
    authors: string[],
    minPage: number, maxPage: number
  ): IBook[]
  {

    if (genre) {
      books = books.filter(f => f.genre.includes(genre))
    }
    if (authors.length) {
      books = books.filter(f => authors.includes(f.author) )
    }
    if (languages.length) {
      books = books.filter(f => languages.includes(f.language) )
    }

    books = books.filter((b) => b.pages >= minPage && b.pages <= maxPage)

    if(!search.trim()) {
      return books;
    }


    return books.filter(f => {
      const bookNameLower = f.bookName.toLowerCase();
      const descriptionLower = f.description.toLowerCase();
      const searchLower = search.toLowerCase();

      return bookNameLower.includes(searchLower) || descriptionLower.includes(searchLower)
    })


  }
}
