import * as Fauna from 'faunadb';
import { query as q } from 'faunadb';
import { client } from "./fauna/client";
import { collection } from './fauna/collection';
import { Query } from './fauna/query'




export class DataLayer {
    client: Fauna.Client
    query: any
    organizations: any
    projects: any

  constructor() {
    this.client = client
    this.query = (query: any) => this.client.query(query).catch((e)=>console.log(e))
    this.organizations  = organizations.call(this)
    this.projects = projects.call(this)
  }
  
}

function index(name: string): any {
  const ref = q.Index(name)

  return {
  
    findMany(terms: Array<any>){
      const inputs = { ref, terms };
      return Query(inputs,q.Map(
          q.Paginate(q.Match(q.Var('ref'),q.Var('terms'))),
          q.Lambda(x => q.Get(x))
        ))
  },
  }
}

function organizations(this: any): any {
  const _collection = collection("organizations")
  const self = this
  return {
  ..._collection,
  
  async create(name: string) {
    return self.query(_collection("organizations").insert({name}))
  }
  }
}

// function organization(id: string): any {
//   const _collection = collection("organizations")

//   return {
//   ..._collection,
  
//   create(name: string) {
//     return _collection("organizations").insert({name})
//   },
//   projects: {}
//   }
// }

function projects(this: any): any {
  const self = this
  return {

  async create(organizationId: any, name: string) {
    return self.query(collection("projects").insert({name, organizationRef: q.Select('ref',self.organizations.findById(organizationId))}))
  },

  async findMany(options: any) {
    const {where} =  options
    if (where.organizationId) {
      return self.query(index("projects_by_organization").findMany([q.Ref(q.Collection("organizations"), where.organizationId)]))
    }
  }

  }
}

function fields() {
  return {

    create(tableRef: any, name: string) {
      return collection("fields").insert({name, tableRef})
    }
  
    }
}

function tables() {

  return {

    create(projectRef: any, name: string) {
      return collection("tables").insert({name, projectRef})
    }


  }
}


function entities() {

  return {

    create(tableRef: any, name: string) {
      return collection("entities").insert({name, tableRef})
    }


  }

}

async function main() {
  console.log("start")
  const gdl = new DataLayer()
  // console.log(await gdl.query(table("hagen").get_ref()))
  console.log(await gdl.projects.findMany({where: {organizationId:"293581585915052547" }}))
  console.log("end")
  // console.log(await gdl.projects.create("293581585915052547","testproj5"))

}
main().catch((e)=>console.log(e))
