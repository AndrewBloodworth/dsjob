

const { Parser } = require("node-sql-parser");
const parser = new Parser();
const fs = require("fs");

export = async (file_name:string, name_space:string) => {
  const fetch = require("../fetch/file_fetcher");
  let text = await fetch(file_name, name_space);
  try {
    text = text.replace(/(:|\*)/gm, ".");
    if (text.includes("JOIN")) {
      const match = text.match(/^SELECT (.*) FROM/m);

      if (match) {
        return match.length
          ? match[1].split(",").map((s:any) => ({ name: s.trim(), type: "N/A" }))
          : [{ name: "Any", type: "N/A" }];
      }
      return [{ name: "Any", type: "N/A" }];
    }
    // console.log("fetrch", text);
    const { tableList, columnList, ast } = parser.parse(text, {
      database: "BigQuery",
      type: "column",
    });

    return ast.select.columns.map((c: any) => {
      // console.log(c);

      return c.expr.type === "column_ref"
        ? { name: c.expr.column, type: "N/A" }
        : { name: c.as, type: "N/A" };
    });
  } catch (error) {
    //   console.log(error);
    return [{ name: "Any", type: "N/A" }];
  }
};
