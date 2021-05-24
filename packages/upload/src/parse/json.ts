import { Field, Instance, ParsedFile } from ".";

type JSONValue =
  | string
  | number
  | Record<string, unknown>
  | JSONValue[]
  | boolean
  | null;

const parseFields = (json: JSONValue[]) => {
  if (json.length < 1) throw new Error("No data in JSON file");

  const fields: Field[] = [];

  for (let i = 0; i < json.length; i++) {
    const instance = json[i] as Record<string, JSONValue>;

    if (
      typeof instance !== "object" &&
      (instance === null || Array.isArray(instance))
    )
      throw new Error(`Element ${i} of JSON file is not an object`);

    for (const name of Object.keys(instance)) {
      const field = fields.find((field) => field.name === name);
      if (field !== undefined && field.type === "string") continue;

      const value = instance[name];
      if (value === undefined || typeof value === "object") {
        if (field !== undefined) {
          field.type = "string";
        } else {
          fields.push({ name, type: "string" });
        }
        continue;
      }

      const type = typeof value as Field["type"];
      if (field !== undefined) {
        field.type = type;
      } else {
        fields.push({ name, type });
      }
    }
  }

  return fields;
};

const enforceFieldTypes = (json: JSONValue[], fields: Field[]) => {
  const instances: Instance[] = [];

  for (let i = 0; i < json.length; i++) {
    const _instance = json[i] as Record<string, JSONValue>;
    const instance: Instance = {};

    for (const { name, type } of fields) {
      const value = _instance[name];

      if (value === null || value === undefined) {
        instance[name] = "";
      } else if (typeof value === "object") {
        instance[name] = JSON.stringify(value);
      } else if (type === "string") {
        instance[name] = value.toString();
      } else {
        instance[name] = value;
      }
    }

    instances.push(instance);
  }

  return instances;
};

export const parseJSON = async (file: File): Promise<ParsedFile> => {
  const text = await file.text();

  try {
    const json = JSON.parse(text);

    if (!Array.isArray(json))
      throw new TypeError("Uploaded JSON file is not an array");

    const fields = parseFields(json);
    const instances = enforceFieldTypes(json, fields);

    return {
      fields,
      instances,
    };
  } catch (error) {
    return {
      errors: [{ message: error.message }],
    };
  }
};
