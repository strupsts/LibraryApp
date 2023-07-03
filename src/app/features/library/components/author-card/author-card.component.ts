import {Component, ElementRef, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IAuthors, LibraryService} from "../../services/library.service";


@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss'],
})
export class AuthorCardComponent  implements OnInit {
  @Input() authorData: IAuthors
  @Input() editModeOut: boolean
  @Output() editModeChange = new EventEmitter<boolean>()

  editMode = false;

  localAuthorData: IAuthors;

  constructor(private libraryService: LibraryService) {

  }

  ngOnInit() {
    this.localAuthorData = { ...this.authorData }

  }


  editAuthor() {
    if(this.editMode) {
      if(this.localAuthorData.author === this.authorData.author) {
        this.editMode = !this.editMode;
        return console.log('[IGNORE] Внесение изменений не требуется')
      }
      console.log('[UPDATE] Обновление автора...')
      this.libraryService.updateAuthor(this.localAuthorData)
    }
      this.editMode = !this.editMode;
      this.editModeChange.emit(this.editMode)
  }

  change() {
    console.log(this.localAuthorData)
  }

  nothing(event: any) {
    event.stopPropagation()
  }
}
