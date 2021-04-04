import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import { DataLayer } from '../../data/';
import { collection } from '../../data/fauna/collection';
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { Expr, query as q } from 'faunadb';
import {
  TypeInfo,
  visit,
  visitWithTypeInfo,
  isLeafType,
  GraphQLList,
  GraphQLResolveInfo,
  defaultFieldResolver,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID
} from "graphql"

// import { SchemaDirectiveVisitor } from '@graphql-tools/utils';

// export class renameField extends SchemaDirectiveVisitor {
//   visitFieldDefinition(field: any) {
//     const { name } = this.args;
//     const { resolve = defaultFieldResolver } = field;
//     field.resolve = async (object: any, args:  any, context: any, info: any) => {
//       object[field.name] = object[name];
//       delete object[name];
//       return resolve.call(this, object, args, context, info);
//     };
//   }
// }


const gdl = new DataLayer();

// s

// const typeDefs = gql`

// directive @renameField(name: String = "abc") on FIELD_DEFINITION | OBJECT

//   type Query {
//     hello: String!
//     books: [Book]
//   }
//   type Book {
//     id: String!
//     titleo: String @renameField(name: "title")
//     authors: [Author]
//   }
//   type Author {
//     name: String
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: async () => JSON.stringify("hello"),
//     books: async (obj: any, args: any, context: any, info: any) => {
//       console.log("hello")
//       console.log("res"+JSON.stringify(await gdl.query(generateFaunaQuery(info))))
//       return [{title: 'Harry Potter'}]
//       // q.Select("data",collection("books").findMany()) 
//   }
//   // Book: {
//   //   authors(book: any) {
//   //     return [{"name": "jo"}]
//   //     }
//   //   }
// }
// };

// const generateFaunaQuery = (resolveInfo: GraphQLResolveInfo) => {
//   // let query = parseResolveInfo(resolveInfo)
//   const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
//   const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
//     parsedResolveInfoFragment,
//     resolveInfo.returnType
//   );
//   console.log(JSON.stringify(resolveInfo))
//   const {fields, name} = simplifiedFragment
//   // console.log("hi" + JSON.stringify(Object.values(fields)))
//   let nested = {}
//   for (let field of Object.values(fields)) {
//     console.log(JSON.stringify(field))
//       nested[field.name] = q.Select(["data",field.name],q.Var("doc"))
//   }
//   // console.log(JSON.stringify(simplifiedFragment))

//   // let entity = resolveInfo.fieldNodes[0]; //if multiple queries in graphql query, should iterate rather than taking first element
//   // console.log("nested"+JSON.stringify(nested))
//   // console.log("name"+name)
//   return q.Map(q.Paginate(q.Documents(q.Collection(name))),q.Lambda("docRef",q.Let({"doc": q.Get(q.Var("docRef"))}, nested)))
  

//   // console.log(JSON.stringify(resolveInfo.fieldNodes[0].selectionSet.selections))

// }






class GraphQLFaunaObjectType extends GraphQLObjectType {
  collectionName: string
  mappings: object
  constructor({
      name,
      fields,
      collectionName,
      interfaces = undefined,
      isTypeOf = undefined,
      fqlTypeCheck = undefined,
      mappings = {},
  }) {
      // if (interfaces?.length) validateInterfaces(interfaces)
      super({ name, fields, interfaces, isTypeOf })
      this.collectionName = collectionName
      this.mappings = mappings
  }
  static isFaunaGraphQLType: true
}

const bookType = new GraphQLFaunaObjectType({
  name: 'Book',
  collectionName: "books",
  fields: () => ({
    id: {type: GraphQLID},
    userTitle: { type: GraphQLString }
  }),
  mappings:  {userTitle: "title"}
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    books: {
      type: GraphQLList(bookType),
      // `args` describes the arguments that the `user` query accepts
      
      resolve: async (obj: any, { size }, context: any, info: any) => {
        console.log("hello")
        let result = await gdl.query(generateFaunaQuery(info, q.Map(
          q.Paginate(q.Documents(q.Collection("books")), {
              size,
          }),
          q.Lambda("ref", q.Get(q.Var("ref")))
      )))
        console.log("res"+JSON.stringify(result))
      
        // console.log("ref"+JSON.stringify())
        return result.data
        return [{title: 'Harry Potter'}]
        // q.Select("data",collection("books").findMany()) 
    }
    }
  }
});

const isFaunaObjectType = obj =>
    obj instanceof GraphQLFaunaObjectType 

const CURRENT_DOC = "__CD__"
const CURRENT_DOC_VAR = q.Var(CURRENT_DOC)

const nestedQuery = (query: any, field:any, fieldObj:any, isList: boolean) => {
    if (isList) return q.Map(query, q.Lambda(CURRENT_DOC, fieldObj))
    return q.Let(
        {
            [CURRENT_DOC]: query,
        },
        fieldObj
    )
}

const generateParseFn = (typeInfo, fieldName) => node => {
  const name = node.name.value
  const type = typeInfo.getType()
  const parentType = typeInfo.getParentType()
  const field = typeInfo.getFieldDef()

  if (!type && !field) {
      throw new Error(`No field ${name}`)
  }
  const isList = type instanceof GraphQLList
  // @ts-ignore
  const typeInList = isList ? type.ofType : null
  const isLeaf = isLeafType(type) || isLeafType(typeInList)
  const isRoot = name === fieldName
  const returnName = isRoot ? "rootFQL" : name

  return {
      name,
      type,
      parentType,
      field,
      isList,
      typeInList,
      isLeaf,
      isRoot,
      returnName,
      selectionSet: node.selectionSet,
      isFaunaObjectType: isFaunaObjectType(typeInList || type),
  }
}

const generateSelector = (name: string, parentType:any, isLeaf = true) => {
  console.log("FQL"+JSON.stringify(parentType.fql))
  // if (c?.fields?.[name]) return [name, parentType.fql?.fields?.[name](CURRENT_DOC_VAR, q)]
  if (isLeaf) {
      if (name === "id" )
          return [name, q.Select(["ref","id"], CURRENT_DOC_VAR)]
      if (name === "ref")
          return [name, q.Select(["ref"], CURRENT_DOC_VAR)]
      if (name === "ts")
          return [name, q.Select(["ts"], CURRENT_DOC_VAR)]
  }
  return [name, q.Select(["data", parentType.mappings[name]], CURRENT_DOC_VAR)]
}

const defaultEmbedQuery = (fieldName, isList) => {
  return q.Let(
      {
          ref: q.Select(["data", `${fieldName}Ref`], CURRENT_DOC_VAR, null),
      },
      q.If(q.IsNull(q.Var("ref")), null, q.Get(q.Var("ref")))
  )
}


const generateFaunaQuery = (resolveInfo: GraphQLResolveInfo, query: Expr) => {
  const { operation, schema: querySchema, fieldName } = resolveInfo
  const typeInfo = new TypeInfo(querySchema)

  const parseFieldNode = generateParseFn(typeInfo, fieldName)
  console.log(JSON.stringify("pn"+parseFieldNode))

  const visitor = {
    enter: {
        Field: node => {
            if (!typeInfo.getFieldDef())
                throw new Error(`No field ${node.name.value} defined`)
        },
    },
    leave: {
      SelectionSet: ({ selections, ...rest }) => {
        const fragments = selections.filter(i => i instanceof Expr)
        const maps = selections.filter(i => i instanceof Array)

        const result = maps.reduce(
            (acc, [key, val]) => ({ ...acc, [key]: val }),
            {}
        )

        if (fragments.length) {
            return q.Reduce(
                q.Lambda(
                    ["acc", "val"],
                    q.Merge(q.Var("acc"), q.Var("val"))
                ),
                result,
                fragments
            )
        }
        return result
    },

      Field: (node, ...rest) => {
      const {
          name,
          field,
          type,
          parentType,
          isList,
          isLeaf,
          isRoot,
          isFaunaObjectType,
          returnName,
          selectionSet,
          typeInList
      } = parseFieldNode(node)

      if (isRoot && !isFaunaObjectType)
          throw new Error("Invalid root type. Must be a FaunaGraphQL type")
      if (isLeaf)
          return generateSelector(returnName, parentType)
      console.log("parse"+JSON.stringify(parseFieldNode(node)))
      if (isRoot)  {
        console.log("coll"+JSON.stringify(typeInList.collectionName))
        return [
          returnName,
          nestedQuery(query, field, selectionSet, isList),
      ]
      }
      return {}
  },}
  }
  
  try {
    const res = visit(operation, visitWithTypeInfo(typeInfo, visitor))
    console.log(res.selectionSet.rootFQL.raw)
    return res.selectionSet.rootFQL
  } catch (err) {
    console.error(err)
    throw err
  }
  return q.ToDate("2020-03-12")
}


export const schema  = new GraphQLSchema({query: queryType});
// export const schema = makeExecutableSchema({ typeDefs, resolvers,  schemaDirectives: {
//   renameField
// } });
