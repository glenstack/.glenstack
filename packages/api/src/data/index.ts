import * as Fauna from "faunadb";
import { query as q } from "faunadb";
import { client } from "./fauna/client";
import { collection } from "./fauna/collection";
import { Query } from "./fauna/query";

export class DataLayer {
  client: Fauna.Client;
  query: any;
  tables: any;
  table: any;

  constructor() {
    this.client = client;
    this.query = (query: any) =>
      this.client.query(query).catch((e) => console.log(e));
    this.tables = tables.bind(this);
    this.table = table.bind(this);
    // this.organizations  = organizations.call(this)
    // this.projects = projects.call(this)
  }
}

function index(name: string): any {
  const ref = q.Index(name);

  return {
    findMany(terms: Array<any>) {
      const inputs = { ref, terms };
      return Query(
        inputs,
        q.Map(
          q.Paginate(q.Match(q.Var("ref"), q.Var("terms"))),
          q.Lambda((x) => q.Get(x))
        )
      );
    },
  };
}

// function organizations(this: any): any {
//   const _collection = collection("organizations")
//   const self = this
//   return {
//   ..._collection,

//   async create(name: string) {
//     return self.query(_collection("organizations").insert({name}))
//   }
//   }
// }

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

// function projects(this: any): any {
//   const self = this
//   return {

//   async create(organizationId: any, name: string) {
//     return self.query(collection("projects").insert({name, organizationRef: q.Select('ref',self.organizations.findById(organizationId))}))
//   },

//   async findMany(options: any) {
//     const {where} =  options
//     if (where.organizationId) {
//       return self.query(index("projects_by_organization").findMany([q.Ref(q.Collection("organizations"), where.organizationId)]))
//     }
//   }

//   }
// }

// function fields() {
//   return {

//     create(tableRef: any, name: string) {
//       return collection("fields").insert({name, tableRef})
//     }

//     }
// }

function tables(this: any): any {
  const self = this;
  return {
    async create(/*projectRef: any,*/ name: string) {
      // self.query(table.create("random"))
      let table_id = (await self.query(collection("tables").insert({ name })))
        .ref.id;
      console.log(table_id);
      await self.table(table_id).scaffold();
      return self.table(table_id);
    },
  };
}

function table(this: any, id: string): any {
  const self = this;
  const _store = collection(id);
  const tableRef = q.Ref(collection("tables").get_ref(), id);

  return {
    scaffold() {
      console.log("id" + id);
      return self.query(_store.create());
    },

    createOne(data: object) {
      // let types = fields.findMany()
      return self.query(_store.insert(data));
    },

    findMany(/*projectRef: any,*/ name: string) {
      return self
        .query(q.Select(["data"], _store.findMany()))
        .catch((err: any) => console.log(err));
    },

    fields() {
      const _store = collection("fields");
      const _store_index = index("fields_by_table");
      return {
        findMany() {
          return self.query(
            q.Select(["data"], _store_index.findMany([tableRef]))
          );
        },
        createOne(name: string, type: string) {
          return self.query(_store.insert({ name, type, tableRef }));
        },
      };
    },
  };
}

function relations() {
  return {
    create(projectRef: any, name: string) {
      return collection("relations").insert({ name, projectRef });
    },
  };
}

// function entities() {

//   return {

//     create(tableRef: any, name: string) {
//       return collection("entities").insert({name, tableRef})
//     }

//   }

// }

async function main() {
  console.log("start");
  const gdl = new DataLayer();
  // console.log(await gdl.query(table("hagen").get_ref()))
  // console.log(await gdl.projects.findMany({where: {organizationId:"293581585915052547" }}))
  // let table = await gdl.tables().create("blublus")
  // let table = await gdl.table("294767091644367367")
  // console.log(await table.createOne({
  //   title: "Harry Potter 4",
  //   year: 2020
  // }))
  // console.log(await table.fields().createOne("year","int"))
  console.log(await gdl.table("books").findMany());
  console.log("end");
  // console.log(await gdl.projects.create("293581585915052547","testproj5"))
}
main().catch((e) => console.log(e));
