import { NgModule } from '@angular/core';
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {SqlBaseService} from "./services/sql-base.service";
import {SQLite} from "@ionic-native/sqlite/ngx";



@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ApiService,
    SqlBaseService,

    SQLite
  ],
  declarations: []
})
export class CoreModule {}
