import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'

@Injectable()
export class StorageService {

  _storage: Storage | null = null;

  constructor(private storage: Storage) {
  }

  initStorage() {
    return new Promise<void>((resolve) => {
      this.storage.create().then((storageInstance) => {
        this._storage = storageInstance;
        resolve()
      })
    })
  }

  getItemStorage(key:string) {
    return this._storage?.get(key)
  }

  setItemStorage(key:string, value:any) {
    return this._storage?.set(key, value)
  }

}
