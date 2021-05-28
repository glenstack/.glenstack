import Papa, { ParseResult } from "papaparse";
import { Field, ParseError, ParsedFile, Instance } from ".";

type CSV = ParseResult<
  Record<string, string | number | boolean | null | undefined>
>;

const parseFields = (csv: CSV) => {
  const fieldNames = csv.meta.fields as string[];
  const firstRow = csv.data[0];

  if (fieldNames.length < 1 || csv.data.length < 1)
    throw new Error("No data in CSV file");

  const fields = fieldNames.map((name): Field => {
    const value = firstRow[name];
    if (value === null || value === undefined) return { name, type: "string" };

    const type = typeof value as Field["type"];

    return { name, type };
  });

  for (let i = 1; i < csv.data.length; i++) {
    const instance = csv.data[i];

    // TODO: Could make fractionally more efficient by not even looping over string type fields
    for (const field of fields) {
      if (field.type === "string") continue;

      const value = instance[field.name];
      if (value === null || value === undefined) {
        field.type = "string";
        continue;
      }

      if (typeof value !== field.type) {
        field.type = "string";
      }
    }
  }

  return fields;
};

const enforceFieldTypes = (csv: CSV, fields: Field[]) => {
  const stringFields = fields.filter(({ type }) => type === "string");

  for (let i = 0; i < csv.data.length; i++) {
    const instance = csv.data[i];

    for (const field of stringFields) {
      const value = instance[field.name];

      if (value === undefined || value === null) {
        instance[field.name] = "";
      } else {
        instance[field.name] = value.toString();
      }
    }
  }

  return csv.data as Instance[];
};

const generateErrors = (csv: CSV): ParseError[] =>
  csv.errors.map((error) => ({
    location: { instanceIndex: error.row },
    message: error.message,
  }));

export const parseCSV = async (file: File): Promise<ParsedFile> => {
  // TODO: Would be much nicer if we could pass the File directly to Papa Parse,
  // but FileReader/FileReaderSync isn't available inside Workers.
  // Maybe we could shim it?
  const text = await file.text();

  const csvPromise = new Promise<
    ParseResult<Record<string, string | number | boolean>>
  >((complete, error) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      preview: 5,
      error,
      complete,
      transform: (value) => value.trim(),
    });
  });

  try {
    const csv = await csvPromise;

    const fields = parseFields(csv);
    const instances = enforceFieldTypes(csv, fields);
    const errors = generateErrors(csv);

    return {
      fields,
      instances,
      errors,
    };
  } catch (error) {
    return {
      errors: [{ message: error.message }],
    };
  }
};
