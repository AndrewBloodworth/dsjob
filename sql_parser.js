const { Parser } = require("node-sql-parser");
const parser = new Parser();
const fs = require("fs");
const fetch = require("./fetch");
module.exports = async (file_name, name_space) => {
  let text = await fetch(file_name, name_space);
  try {
    text = text.replace(/(:|\*)/gm, ".");
    if (text.includes("JOIN")) {
      const match = text.match(/^SELECT (.*) FROM/m);

      if (match) {
        return match.length
          ? match[1].split(",").map((s) => ({ name: s.trim(), type: "N/A" }))
          : [{ name: "Any", type: "N/A" }];
      }
      return [{ name: "Any", type: "N/A" }];
    }
    // console.log("fetrch", text);
    const { tableList, columnList, ast } = parser.parse(text, {
      database: "BigQuery",
      type: "column",
    });

    return ast.select.columns.map((c) => {
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
