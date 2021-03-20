import {StorageLayer} from '.' 

export class DataLayer {
    db: {}
    
  constructor() {
    this.db = new StorageLayer()
    
  }

}
