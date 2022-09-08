
const sql_parser = require("../parsers/sql_parser");
const {

    create_bq_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    MapperEvent,
    MetaData,
    PipelineData,
    BQSchemaField,
    MapperProperties,
    MapperProp,
  } from "../types";

export = async ({step,name_space,meta_data,pdfDoc}: PipelineData) => {
    
    const key = "standardsql_query";
    const columns = await sql_parser(
      step.standardsql_query.source_file_path,
      name_space
    );
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
}