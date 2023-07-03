import { Component } from '@angular/core';
import {StorageService} from "./core/services/storage.service";
import {LibraryService} from "./features/library/services/library.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private libraryService: LibraryService) {
    this.libraryService.initLibrary()
  }
}
