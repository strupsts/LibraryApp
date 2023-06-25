import { NgModule } from '@angular/core';
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ApiService
  ],
  declarations: []
})
export class CoreModule {}
