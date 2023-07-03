import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IAuthors, LibraryService} from "../../services/library.service";
import {AuthorCardComponent} from "../../components/author-card/author-card.component";

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.page.html',
  styleUrls: ['./authors-list.page.scss'],
})
export class AuthorsListPage implements OnInit {

  @ViewChildren(AuthorCardComponent) authorCardInstances: QueryList<AuthorCardComponent>;

  authors: IAuthors[] = [];


  firstName: string = '';
  lastName: string = '';

  outEditMode: boolean = false;

  constructor(private libraryService: LibraryService) {
    this.libraryService.getAuthors().subscribe((authorsArr: IAuthors[]) => {
      this.authors = authorsArr
    })
  }


  ngOnInit() {

  }

  toggleEditMode() {
    if(this.outEditMode) {

    }
    setTimeout(() => {
      this.outEditMode = !this.outEditMode
    }, 100)
  }

  change() {

  }

  hasEditMode():boolean {
    return this.authorCardInstances.some(card => card.editMode);
  }

  createNewAuthor() {
    setTimeout(() => {
    this.libraryService.addAuthor({id: this.libraryService.getNewAuthorID(), author: `${this.firstName} ${this.lastName}`})
    this.firstName = '';
    this.lastName = '';
    },100)
  }

}
