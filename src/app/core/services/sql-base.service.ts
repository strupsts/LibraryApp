import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {IBook} from "../../shared/interfaces/IBook";

@Injectable()
export class SqlBaseService {

  databaseObj!: SQLiteObject;
  tables = {
     books: "books",
     authors: "authors"
  }

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: "library_sqlite_db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db
      }).catch((e) => {
        console.log("error Library DB " + JSON.stringify(e))
      })
    await this.createTables()
  }

  async createTables() {
    await this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.tables.books} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookName TEXT,
      author TEXT,
      description TEXT,
      pages INTEGER,
      language TEXT,
      genre TEXT
    )
  `);
    await this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.tables.books} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
    )
  `);
  }
  async addBook(book:IBook) {
    const { id, bookName, author, description, pages, language, genre } = book;
    return this.databaseObj.executeSql(
      `INSERT INTO ${this.tables.books} (id, bookName, author, description, pages, language, genre) VALUES (?, ?, ?, ?, ?, ?, ?)`
    , [id, bookName, author, description, pages, language, JSON.stringify(genre)])
      .then(() => {
        return "Книга сохранена"
      }).catch((e) => {
        if(e.code === 6){
          return "Эта книга уже существует"
        }
        return "Ошибка при сохранении книги: " + JSON.stringify(e)
      })
  }
  async getBooks() {
    return this.databaseObj.executeSql(
      `SELECT * FROM ${this.tables.books} ORDER BY bookName ASC`,
      []
    )
      .then ((res) => {
        return res;
      }).catch((e) => {
        return "Ошибка при получении книг " + JSON.stringify(e);
      })
  }
  async deleteBook(id: number) {
    return this.databaseObj.executeSql(`
       DELETE FROM ${this.tables.books} WHERE id = ${id}
    `, [])
      .then(() => {
        return 'Книга удалена'
      })
      .catch((e) => {
        return "Ошибка при удалении: " + JSON.stringify(e)
      })
  }
  async editBookAuthor(author: string, id: number) {
    return this.databaseObj.executeSql(`
        UPDATE ${this.tables.books} SET author = ${author} WHERE id = ${id}
    `, [])
      .then(() => {
        return "Автор обновлен"
      }).catch((e) => {
        if (e.code === 6) return "Указан существующий автор"
        return "Ошибка при обновлении автора " + JSON.stringify(e)
      })
  }

}
