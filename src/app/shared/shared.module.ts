import { NgModule } from '@angular/core';
import {SearchPipe} from "./pipes/search.pipe";



@NgModule({
  imports: [],
  providers: [],
  exports: [
    SearchPipe
  ],
  declarations: [SearchPipe]
})
export class SharedModule {}
