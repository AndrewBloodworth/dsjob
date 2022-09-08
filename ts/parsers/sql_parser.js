"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Parser } = require("node-sql-parser");
const parser = new Parser();
const fs = require("fs");
module.exports = (file_name, name_space) => __awaiter(void 0, void 0, void 0, function* () {
    const fetch = require("../fetch/file_fetcher");
    let text = yield fetch(file_name, name_space);
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
    }
    catch (error) {
        //   console.log(error);
        return [{ name: "Any", type: "N/A" }];
    }
});
