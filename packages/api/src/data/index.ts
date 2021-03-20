import * as Fauna from 'faunadb';
import { client } from "./fauna/client";
import { collection } from './fauna/collection';
import { table } from './fauna/table';


export class DataLayer {
    client: Fauna.Client
    query: any

  constructor() {
    this.client = client
    this.query = (query: any) => this.client.query(query).catch((e)=>console.log(e))
  }

}

async function main() {
  console.log("hi")
  const gdl = new DataLayer()
  // console.log(await gdl.query(table("hagen").get_ref()))
  console.log(await gdl.query(table("hagen2").fields.insert({name: "hagenRelation", type: "relation", to: table("hagen")})))
}
main().catch((e)=>console.log(e))
