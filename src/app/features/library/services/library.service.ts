import { Injectable } from '@angular/core';
import {ApiService} from "../../../core/services/api.service";
import {StorageService} from "../../../core/services/storage.service";
import {IBook} from "../../../shared/interfaces/IBook";
import {Observable, BehaviorSubject,throwError} from "rxjs";
import {catchError, map, skip, skipWhile, take} from "rxjs/operators";
import {ILanguages} from "../../../shared/interfaces/ILanguages";
import {IMinMaxPages} from "../../../shared/interfaces/IMinMaxPages";



export interface IAuthors {
  id: number,
  author: string
}




@Injectable()
export class LibraryService {

  languages: ILanguages[] = [
    {key: "ru", value: "Русский"},
    {key: "en", value: "Английский"},
    {key: "de", value: "Немецкий"},
  ]
  allAuthors: string[] = [];
  minPage: number = 0;
  maxPage: number = 0;

  actuallyBooksArray: BehaviorSubject<IBook[]> = new BehaviorSubject<IBook[]>([]);
  actuallyAuthorsArray: BehaviorSubject<IAuthors[]> = new BehaviorSubject<IAuthors[]>([]);
  actuallyGenresArray: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  skipBooksSubBody: boolean = true;
  skipAuthorsSubBody: boolean = true;
  skipGenresSubBody: boolean = true;



  constructor(private api: ApiService, private storageService: StorageService) {

  }

  initLibrary() {
    this.storageService.initStorage().then(() => {

      // Оформляем 3 подписки на BehaviorSubject которые будут обновлять storage при изменении данных.
      // Пропускаем выполнение тела подписки при её объявлении, как и в случае получения данных из storage.
      this.actuallyBooksArray.pipe(skipWhile(() => this.skipBooksSubBody))
        .subscribe((books: IBook[]) => {
            this.storageService.setItemStorage('books', books)
              ?.then((refreshedArr: IBook[]) => {
                  console.log('[SUBSCRIBE] Книги были записаны/обновлены в storage', refreshedArr)
              })
      })
      this.actuallyAuthorsArray.pipe(skipWhile(() => this.skipAuthorsSubBody))
        .subscribe((authors: IAuthors[]) => {
        this.storageService.setItemStorage('authors', authors)
          ?.then((refreshedArr: IAuthors[]) => {
            console.log('[SUBSCRIBE] Авторы были записаны/обновлены в storage', refreshedArr)
          })
      })
      this.actuallyGenresArray.pipe(skipWhile(() => this.skipGenresSubBody))
        .subscribe((genres: string[]) => {
          this.storageService.setItemStorage('genres', genres)
            ?.then((refreshedArr: string[]) => {
              console.log('[SUBSCRIBE] Жанры были записаны/обновлены в storage', refreshedArr)
            })
        })

      // Делаем запрос в storage по массиву книг, если отсутствует - запрашиваем с "сервера".
      this.storageService.getItemStorage('books')
         ?.then((books: IBook[]) => {
              this.initBooksHandler(books)
                .then(() => {
                  // После того как книги были инициализированы - обрабатываем получение массивов Авторов и Жанров.
                    this.storageService.getItemStorage('authors')
                      ?.then((authors: IAuthors[]) => {
                          this.initAuthorsHandler(authors)
                      })
                    this.storageService.getItemStorage('genres')
                      ?.then((genres: string[]) => {
                        this.initGenresHandler(genres)
                      })
                })
         })
    })

  }


  initBooksHandler(books: IBook[]): Promise<void> {
    return new Promise<void>((resolve) => {
      if(!books) {
        this.api.getAllBooks()
          .pipe(
            take((1)),
            catchError((err) => {
              console.log('Не удалось получить книги с сервера!')
              return throwError(() => err)
            })
          )
          .subscribe((books: IBook[]) => {
            this.skipBooksSubBody = false;
            this.actuallyBooksArray.next(books)
            resolve()
          })
      }
      else {
        this.actuallyBooksArray.next(books)
        this.skipBooksSubBody = false;
        console.log('[INIT] Книги были получены из storage: ', books)
        resolve()
      }
    })
  }

  initAuthorsHandler(authors: IAuthors[]) {
      let authorsArr: IAuthors[] = [];
      if(!authors) {
         const booksArr: IBook[] = this.actuallyBooksArray.getValue()

         booksArr.forEach(({id, author}) => {
           let found: boolean = false;
           authorsArr.forEach((a) => {
              if (author == a.author) {
                console.log(`'${author}' автор уже существует.`)
                found = true;
              }
           })
           if(!found) authorsArr.push({ id, author })
         })
          this.skipAuthorsSubBody = false;
          this.actuallyAuthorsArray.next(authorsArr);
      }
      else {
        this.actuallyAuthorsArray.next(authors);
        this.skipAuthorsSubBody = false;
        console.log('[INIT] Авторы были получены из storage: ', authors)
      }
  }

  initGenresHandler(genres: string[]) {
     if(!genres) {
       const genresBase: string[] = [
         "IT",
         "Психология",
         "Научпоп",
         "Разработка (DEV)",
         "Драма",
         "Классика"
       ]
       this.skipGenresSubBody = false;
       this.actuallyGenresArray.next(genresBase);
     }
     else {
       this.actuallyGenresArray.next(genres);
       console.log('[INIT] Жанры были получены из storage: ', genres)
       this.skipGenresSubBody = false;
     }
  }


  getBooks(): Observable<IBook[]>{
    return this.actuallyBooksArray.asObservable()
  }

  getAuthors(): Observable<IAuthors[]>{
    return this.actuallyAuthorsArray.asObservable()
  }

  getGenresList(): Observable<string[]> {
    return this.actuallyGenresArray.asObservable()
  }

      getNewBookID() {
        let books = this.actuallyBooksArray.getValue();
        return books.length + 1
      }

      getNewAuthorID() {
        let authors = this.actuallyAuthorsArray.getValue();
        return authors.length + 1
      }

      getNewGenreID() {
        let genres = this.actuallyGenresArray.getValue()
        return genres.length
      }

       getCurrentBookGenres (genreNums: number[]): string {
        // Метод обрабатывает массив с числами, которые являются ключами жанров
        // и возвращает строку по типу "Психология, Драма".
        const genreBase = this.actuallyGenresArray.getValue()
        let genreArr = genreNums.map(genreNum=>{
          return genreBase
            .find((genre, index) => ((index + 1) === genreNum))
        })
         console.log('Массив с жанрами: ',genreArr)
         let genreString = genreArr.join(', ');
         console.log('Строка с жанрами: ', genreString);
         return genreString
       };

      getLanguagesList(): ILanguages[]  {
          return this.languages
      }

  addBook(newBook: any) {
    let booksArr:IBook[] = this.actuallyBooksArray.getValue()
    // let exist = booksArr.find(a => a.bookName === newBook.bookName && a.author === newBook.author)
    // if(exist) {
    //   console.log('Идентичная указанной книга уже существует: ', exist)
    //   return []
    // }
    let handledGenres = this.genreHandler(newBook.genre)
    console.log('Готовый массив цифр жанра: ', handledGenres)
    booksArr = [{...newBook, genre: handledGenres}, ...booksArr]
    return this.actuallyBooksArray.next(booksArr)
  }
      genreHandler(roughGenreStr: string) {
        let formattedStringArray: string[] = this.formatGenresStringToArray(roughGenreStr);
        let genresBase = this.actuallyGenresArray.getValue();

        let readyGenreArray: number[] = formattedStringArray.map((genreFromCreator: string)=> {
            if(genresBase.includes(genreFromCreator)) {

              let indexed = genresBase.indexOf(genreFromCreator) + 1;
              console.log('Этот жанр уже есть в базе жанров: ', indexed + " " + genreFromCreator)
              return indexed
            }
            else {
              genresBase.push(genreFromCreator)
              console.log('Этого жанра нет в базе жанров. Он добавляется в нее: ', genreFromCreator + ' ' + this.getNewGenreID())
              this.actuallyGenresArray.next(genresBase)
              return this.getNewGenreID()
            }
        })
        return readyGenreArray
      }
            formatGenresStringToArray(roughGenreStr: string) {
              // Суть этого нечитабельного кода - фильтр. Преобразование строки, которую пользователь ввёл указывая жанр, при
              // создании книги, в отформатированный массив строк , который убирает пробелы, выравнивает жанр
              // по регистру: 1я буква заглавная - остальные строчные, сохраняет пробел для жанров из нескольких слов.
              // ("  нАуЧная     ФанТастИка    ,криМинаЛ   " >>Становится>> arr[0] = "Научная фантастика", arr[1] = "Криминал")
              let spacelessForm: string[] = roughGenreStr.split(',').map((genre) => genre.trim())
              let letterCaseForm: string[] = spacelessForm.map((genre) => {
                   let spaceIsExist = false;
                   return  genre.split('')
                   .map((char,index) => {
                        if (index === 0) {
                          return char.toUpperCase()
                        }
                        else {
                          if(char === ' ') {
                            if(!spaceIsExist) {
                              spaceIsExist = true
                              return char
                            }
                            else if(spaceIsExist) {
                              return ''
                            }
                          }
                          if(spaceIsExist) spaceIsExist = false;
                          return char.toLowerCase();
                        }
                      }).join('')
                })
              let emptynessElemForm: string[] = letterCaseForm.filter((newGenre: string) => newGenre.trim() !== '')
              return emptynessElemForm;
            }

  addAuthor(newAuthor:IAuthors) {
    let authorsArr:IAuthors[] = this.actuallyAuthorsArray.getValue()
    let exist = authorsArr.find(a => a.author === newAuthor.author)
    if(exist) {
      console.log('Указанный автор уже существует: ', exist)
      return []
    }
    authorsArr.push(newAuthor);
    return this.actuallyAuthorsArray.next(authorsArr)
  }

  updateAuthor(editedAuthor: IAuthors): void {
    let authorsArr:IAuthors[] = this.actuallyAuthorsArray.getValue()
    let updatedAuthorsArr = authorsArr.map((a) => {
      if (a.id === editedAuthor.id) {
        console.log(`[COMPLETE] Автор обновлен. Старое значение ${a.author}, новое значение: ${editedAuthor.author} `)
        this.updateAuthorInBooks(a, editedAuthor)
        return editedAuthor
      }
      return a
    })
    this.actuallyAuthorsArray.next(updatedAuthorsArr)
  }
      updateAuthorInBooks(prev: IAuthors, curr: IAuthors): void {
        let booksArr:IBook[] = this.actuallyBooksArray.getValue()
        booksArr = booksArr.map((b) => {
          if (b.author === prev.author) {
            return { ...b, author: curr.author}
          }
          return b
        })
        console.log('[COMPLETE] Новое значение автора обновлено и в книгах')
        this.actuallyBooksArray.next(booksArr)
      }







  setMinMaxPages(): Observable<void> {
    return new Observable ((observer) => {
      this.actuallyBooksArray.pipe(
        map((arr: IBook[]) => arr.map((book) => book.pages))
      )
        .subscribe((pages: number[]) => {
          for (let i = 0; i < pages.length; i++) {
            if (pages[i] > this.maxPage || this.maxPage === 0) this.setMaxPage(pages[i]);
            if (pages[i] < this.minPage || this.minPage === 0) this.setMinPage(pages[i]);
          }
          console.log(this.maxPage)
          observer.next()
        })
    })
  }

  setMinPage(pages: number): void {
    this.minPage = pages
  }
  setMaxPage(pages: number): void {
    this.maxPage = pages
  }

  getMinMaxPages(): Observable<IMinMaxPages>  {
    return new Observable ((observer) => {
      observer.next({ min: this.minPage, max: this.maxPage })
    })
  }





}
// this.storageService.getItemStorage('books')
//   ?.then((books:IBook[] ) => {
//     if(!books) {
//       let sub = this.api.getAllBooks().subscribe((books:IBook[]) => {
//         this.actuallyBooksArray.next(books);
//         console.log('Первонач')
//         sub.unsubscribe()
//       })
//     }
//     else {
//           this.actuallyBooksArray.next(books)
//           console.log('[INIT] Книги загружены из storage');
//     }
//
//     this.actuallyBooksArray.subscribe((books: IBook[]) => {
//       console.log('Вызвана подписка, а books: ', books)
//         if(!this.actuallyAuthorsArray.getValue().length) {
//           console.log('[INIT] Объявление первоначальной подписки на массив с авторами');
//           this.actuallyAuthorsArray.subscribe((nextAuthors: IAuthors[]) => {
//             if(this.startGetAuthors && nextAuthors.length) {
//               this.startGetAuthors = false;
//             }
//             else if(!this.startGetAuthors) {
//               this.storageService.setItemStorage('authors', nextAuthors)
//                 ?.then((resAutors: IBook[]) => {
//                   console.log('[SUBSCRIBE] Автор добавлен в массив', resAutors);
//                 })
//             }
//           });
//           console.log('[INIT] Массив с авторами отсутствует. Начинается инициализация данных')
//           this.storageService.getItemStorage('authors')
//             ?.then((authors: IAuthors[]) => {
//               if (authors && authors.length) {
//                 console.log('[INIT] Авторы загружены из storage')
//                 this.actuallyAuthorsArray.next(authors)
//               }
//               else {
//                 const authorsArr = this.initAuthorsHandler(books);
//                 if (authorsArr && authorsArr.length) {
//                   console.log('[INIT] Авторы добавлены в storage ', authorsArr)
//                   this.actuallyAuthorsArray.next(authorsArr)
//                 }
//               }
//             });
//         }
//         if(!this.actuallyBooksArray.getValue().length) {
//           this.storageService.setItemStorage('books', books)?.then((resBooks: IBook[]) => {
//             console.log('[INIT] Книги добавлены в storage', resBooks)
//           })
//         }
//     });
//   })
