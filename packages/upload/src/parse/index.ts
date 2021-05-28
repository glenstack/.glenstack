import { parseCSV } from "./csv";
import { parseJSON } from "./json";

export interface Field {
  name: string;
  type: "string" | "number" | "boolean";
}

interface Location {
  instanceIndex?: number;
}

export interface ParseError {
  location?: Location;
  message: string;
}

export type Instance = Record<string, string | number | boolean>;

interface SuccessfulParsedFile {
  fields: Field[];
  instances: Instance[];
  errors?: ParseError[];
}

interface FailedParsedFile {
  fields?: undefined;
  instances?: undefined;
  errors: ParseError[];
}

export type ParsedFile = SuccessfulParsedFile | FailedParsedFile;

export const parseFile = async (file: File): Promise<ParsedFile> => {
  switch (file.type) {
    case "text/csv":
      return await parseCSV(file);

    case "application/json":
      return await parseJSON(file);
  }

  return {
    errors: [{ message: "Could not determine the file type." }],
  };
};
