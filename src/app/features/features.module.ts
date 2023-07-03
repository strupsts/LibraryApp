import { NgModule } from '@angular/core';

import {LibraryModule} from "./library/library.module";
import {LibraryService} from "./library/services/library.service";

@NgModule({
  imports: [
    LibraryModule
  ],
  providers: [
    LibraryService
  ],
  declarations: []
})
export class FeaturesModule {}
