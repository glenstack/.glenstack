import * as Fauna from 'faunadb';
import { client } from "./client";
import { collection } from './collection';
import { table } from './table';


export class StorageLayer {
    client: Fauna.Client
    collection: any
    query: any
    table: any

  constructor() {
    this.client = client
    this.query = (query: any) => this.client.query(query).catch((e)=>console.log(e))

    this.collection = collection.bind(this)
    this.table = table.bind(this)
  }

}

async function main() {
  console.log("hi")
  const gdl = new StorageLayer()
  console.log(await gdl.table("123ssa").create())
}
main().catch((e)=>console.log(e))
