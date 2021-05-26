import { File } from "@web-std/file";
import { parseCSV } from "../csv";

describe("parseCSV", () => {
  it("parses files", async () => {
    const input = `shouldBeString,shouldBeNumber,shouldBeBoolean,shouldFallbackToString,shouldBeEmptyString
test,5,true,2
undefined,6,false,true,
spacey string, -1, true, 1.2,""
"wrapped string",1.23,false,
null,    12, true, "some string"`;
    const { fields, instances, errors } = await parseCSV(
      new File([input], "input.csv", { type: "text/css" })
    );

    expect(errors).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Object {
            "instanceIndex": 0,
          },
          "message": "Too few fields: expected 5 fields but parsed 4",
        },
        Object {
          "location": Object {
            "instanceIndex": 3,
          },
          "message": "Too few fields: expected 5 fields but parsed 4",
        },
        Object {
          "location": Object {
            "instanceIndex": 4,
          },
          "message": "Too few fields: expected 5 fields but parsed 4",
        },
      ]
    `);
    expect(fields).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "shouldBeString",
          "type": "string",
        },
        Object {
          "name": "shouldBeNumber",
          "type": "number",
        },
        Object {
          "name": "shouldBeBoolean",
          "type": "boolean",
        },
        Object {
          "name": "shouldFallbackToString",
          "type": "string",
        },
        Object {
          "name": "shouldBeEmptyString",
          "type": "string",
        },
      ]
    `);
    expect(instances).toMatchInlineSnapshot(`
      Array [
        Object {
          "shouldBeBoolean": true,
          "shouldBeEmptyString": "",
          "shouldBeNumber": 5,
          "shouldBeString": "test",
          "shouldFallbackToString": "2",
        },
        Object {
          "shouldBeBoolean": false,
          "shouldBeEmptyString": "",
          "shouldBeNumber": 6,
          "shouldBeString": "undefined",
          "shouldFallbackToString": "true",
        },
        Object {
          "shouldBeBoolean": true,
          "shouldBeEmptyString": "",
          "shouldBeNumber": -1,
          "shouldBeString": "spacey string",
          "shouldFallbackToString": "1.2",
        },
        Object {
          "shouldBeBoolean": false,
          "shouldBeEmptyString": "",
          "shouldBeNumber": 1.23,
          "shouldBeString": "wrapped string",
          "shouldFallbackToString": "",
        },
        Object {
          "shouldBeBoolean": true,
          "shouldBeEmptyString": "",
          "shouldBeNumber": 12,
          "shouldBeString": "null",
          "shouldFallbackToString": "\\"some string\\"",
        },
      ]
    `);
  });
});
