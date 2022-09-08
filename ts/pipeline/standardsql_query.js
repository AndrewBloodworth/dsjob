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
const sql_parser = require("../parsers/sql_parser");
const { create_bq_table, create_example_table, format_meta_data, } = require("../utils");
module.exports = ({ step, name_space, meta_data, pdfDoc }) => __awaiter(void 0, void 0, void 0, function* () {
    const key = "standardsql_query";
    const columns = yield sql_parser(step.standardsql_query.source_file_path, name_space);
    format_meta_data({
        meta_data,
        step,
        key,
        attributes: {
            link: {
                text: `${step.standardsql_query.source_file_path}`,
                url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.standardsql_query.source_file_path}`,
            },
            title: "Input",
            description: "Bluecore SQL query",
            tables: [
                create_bq_table({
                    pdfDoc,
                    key,
                    column_count: columns.length,
                    title: "Input",
                }),
                create_example_table({
                    pdfDoc,
                    columns,
                }),
            ],
        },
    });
});
