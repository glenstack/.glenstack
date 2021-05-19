/* eslint-disable */
// @ts-nocheck
import { Expr, query as q } from "faunadb";
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
  GraphQLID,
} from "graphql";

import { getArgumentValues } from "graphql/execution/values";
export class GraphQLFaunaObjectType extends GraphQLObjectType {
  collectionName: string;
  metaSchema: object;
  constructor({
    name,
    fields,
    collectionName,
    interfaces = undefined,
    isTypeOf = undefined,
    fqlTypeCheck = undefined,
    metaSchema = {},
  }) {
    // if (interfaces?.length) validateInterfaces(interfaces)
    super({ name, fields, interfaces, isTypeOf });
    this.collectionName = collectionName;
    this.metaSchema = metaSchema;
  }
  static isFaunaGraphQLType: true;
}

const isFaunaObjectType = (obj) => obj instanceof GraphQLFaunaObjectType;

const CURRENT_DOC = "__CD__";
const CURRENT_DOC_VAR = q.Var(CURRENT_DOC);

const nestedQuery = (
  query: any,
  field: any,
  fieldObj: any,
  isList: boolean
) => {
  if (isList)
    return q.Select("data", q.Map(query, q.Lambda(CURRENT_DOC, fieldObj)));
  return q.Let(
    {
      [CURRENT_DOC]: query,
    },
    fieldObj
  );
};

const generateParseFn = (typeInfo, fieldName, gqlSchema) => (node) => {
  const name = node.name.value;
  const type = typeInfo.getType();
  const parentType = typeInfo.getParentType();
  const field = typeInfo.getFieldDef();
  if (!type && !field) {
    throw new Error(`No field ${name}`);
  }
  const isList = type instanceof GraphQLList;
  // @ts-ignore
  const typeInList = isList ? type.ofType : null;
  const isLeaf = isLeafType(type) || isLeafType(typeInList);
  const isQuery = parentType === gqlSchema.getQueryType();
  const isMutation = parentType === gqlSchema.getMutationType();
  const isRoot =
    parentType === gqlSchema.getQueryType() ||
    parentType === gqlSchema.getMutationType(); //TODO: Consider mutation and subscription type
  console.log("types" + gqlSchema.getQueryType() + parentType);
  const returnName = isRoot ? "rootFQL" : name;

  return {
    name,
    type,
    parentType,
    field,
    isList,
    typeInList,
    isLeaf,
    isRoot,
    isQuery,
    isMutation,
    returnName,
    selectionSet: node.selectionSet,
    isFaunaObjectType: isFaunaObjectType(typeInList || type),
  };
};

const generateSelector = (name: string, parentType: any, isLeaf = true) => {
  console.log("FQL" + JSON.stringify(parentType.fql));
  // if (c?.fields?.[name]) return [name, parentType.fql?.fields?.[name](CURRENT_DOC_VAR, q)]
  // if (name === "authors") return [name,q.Select(["data"], CURRENT_DOC_VAR)]

  if (isLeaf) {
    if (name === "id") return [name, q.Select(["ref", "id"], CURRENT_DOC_VAR)];
    if (name === "ref") return [name, q.Select(["ref"], CURRENT_DOC_VAR)];
    if (name === "ts") return [name, q.Select(["ts"], CURRENT_DOC_VAR)];
  }
  return [
    name,
    q.Select(["data", parentType.metaSchema[name].fieldId], CURRENT_DOC_VAR),
  ];
};

const defaultEmbedQuery = (fieldName, isList) => {
  return q.Let(
    {
      ref: q.Select(["data", `${fieldName}Ref`], CURRENT_DOC_VAR, null),
    },
    q.If(q.IsNull(q.Var("ref")), null, q.Get(q.Var("ref")))
  );
};

export const generateFaunaQuery = (
  resolveInfo: GraphQLResolveInfo,
  query?: Expr
) => {
  const { operation, schema: gqlSchema, fieldName } = resolveInfo;
  const typeInfo = new TypeInfo(gqlSchema);

  const parseFieldNode = generateParseFn(typeInfo, fieldName, gqlSchema);
  console.log(JSON.stringify("pn" + parseFieldNode));

  const visitor = {
    enter: {
      Field: (node) => {
        if (!typeInfo.getFieldDef())
          throw new Error(`No field ${node.name.value} defined`);
      },
    },
    leave: {
      SelectionSet: ({ selections, ...rest }) => {
        const fragments = selections.filter((i) => i instanceof Expr);
        const maps = selections.filter((i) => i instanceof Array);

        const result = maps.reduce(
          (acc, [key, val]) => ({ ...acc, [key]: val }),
          {}
        );

        if (fragments.length) {
          return q.Reduce(
            q.Lambda(["acc", "val"], q.Merge(q.Var("acc"), q.Var("val"))),
            result,
            fragments
          );
        }
        return result;
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
          isQuery,
          isMutation,
          isFaunaObjectType,
          returnName,
          selectionSet,
          typeInList,
        } = parseFieldNode(node);

        let nextQuery;

        if (isRoot && !isFaunaObjectType)
          throw new Error("Invalid root type. Must be a FaunaGraphQL type.");
        if (isLeaf) return generateSelector(returnName, parentType);

        // if (selectionSet && !isRoot) {
        //       return generateSelector(returnName, parentType)
        //   }

        console.log(
          "arguments:" + JSON.stringify(getArgumentValues(field, node))
        );

        if (isMutation && isRoot) {
          const bookType = type;
          let data = {};
          let relationQueries;
          const args = getArgumentValues(field, node);
          for (let [key, value] of Object.entries(args.input)) {
            if (bookType.metaSchema[key].type === "relation") {
              console.log("side:" + bookType.metaSchema[key].from);
              let relatedType = bookType.getFields()[key].type;
              if (relatedType instanceof GraphQLList) {
                relatedType = relatedType.ofType;
              }
              console.log(relatedType.collectionName);
              relationQueries = q.Create(q.Collection("relations"), {
                data: {
                  relationshipRef: bookType.metaSchema[key].relationshipRef,
                  [bookType.metaSchema[key].from]: q.Var("docRef"),
                  [bookType.metaSchema[key].to]: q.Ref(
                    q.Collection(relatedType.collectionName),
                    value.connect[0] //TODO: Allow multiple connects
                  ),
                },
              });
            } else {
              data[bookType.metaSchema[key].fieldId] = value;
            }
          }
          nextQuery = q.Select(
            ["doc"],
            q.Let(
              {
                docRef: q.Select(
                  ["ref"],
                  q.Create(q.Collection(bookType.collectionName), { data })
                ),
              },
              { doc: q.Get(q.Var("docRef")), relationQueries }
            )
          );
        } else if (isRoot) {
          nextQuery = query;
        }
        if (!nextQuery) {
          if (parentType.metaSchema[name].type !== "relation") {
            throw new Error("Current node should be a relation.");
          }
          nextQuery = q.Map(
            q.Paginate(
              q.Match(q.Index("relations" + parentType.metaSchema[name].from), [
                parentType.metaSchema[name].relationshipRef,
                q.Select(["ref"], CURRENT_DOC_VAR),
              ])
            ),
            q.Lambda("ref", q.Get(q.Var("ref")))
          );
        }

        return [
          returnName,
          nestedQuery(nextQuery, field, selectionSet, isList),
        ];
      },
    },
  };

  try {
    // Filter operation in order to only consider the current field and not all neighbours.
    let filtered_operation = JSON.parse(JSON.stringify(operation));
    filtered_operation.selectionSet.selections = filtered_operation.selectionSet.selections.filter(
      (x) => x.name.value === resolveInfo.fieldName
    );
    const res = visit(filtered_operation, visitWithTypeInfo(typeInfo, visitor));

    return res.selectionSet.rootFQL;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
