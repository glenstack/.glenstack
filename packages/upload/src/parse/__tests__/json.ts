import { File } from "@web-std/file";
import { parseJSON } from "../json";

describe("parseJSON", () => {
  it("rejects invalid files", async () => {
    const inputs = ["", "null", "undefined", "5", "x", "true", "{}", "[]"].map(
      (text) => new File([text], "input.json", { type: "application/json" })
    );
    for (const input of inputs) {
      const output = await parseJSON(input);
      expect(output.fields).toBeUndefined();
      expect(output.instances).toBeUndefined();
      expect(output.errors?.length).toBeGreaterThan(0);
    }
  });
  it("parses files", async () => {
    const input = new File(
      [
        `[{"shouldBeString":"test", "shouldBeNumber": 5, "shouldBeBoolean": true, "shouldFallbackToString": 2},
{"shouldBeString": "undefined", "shouldBeNumber":6, "shouldBeBoolean": false, "shouldFallbackToString": true, "shouldBeEmptyString": null},
{"shouldBeString": "spacey string", "shouldBeNumber": -1, "shouldBeBoolean": true, "shouldFallbackToString": 1.2, "shouldBeEmptyString": ""},
{"shouldBeString": "wrapped string", "shouldBeNumber": 1.23, "shouldBeBoolean": false, "shouldFallbackToString": null, "shouldBeEmptyString": null},
{"shouldBeString": "null",            "shouldBeNumber": 12, "shouldBeBoolean":true, "shouldFallbackToString":"\\"some string\\""}]`,
      ],
      "input.json",
      { type: "application/json" }
    );
    const output = await parseJSON(input);

    expect(output.errors).toBeUndefined();
    expect(output.fields).toMatchInlineSnapshot(`
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
    expect(output.instances).toMatchInlineSnapshot(`
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
