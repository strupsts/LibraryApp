import { NgModule } from '@angular/core';
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage-angular";
import {StorageService} from "./services/storage.service";




@NgModule({
  imports: [
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    ApiService,
    StorageService,

  ],
  declarations: []
})
export class CoreModule {}
