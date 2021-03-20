import {StorageLayer} from './fauna/' 

export class DataLayer {
    db: {}
    
  constructor() {
    this.db = new StorageLayer()
    
  }

}
