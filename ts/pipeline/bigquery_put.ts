
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
    const key = "bigquery_put";
         
    const columns = JSON.parse(step.bigquery_put.schema).fields.map(
      ({ name, type }: BQSchemaField) => ({ name, type })
    );

    format_meta_data({
      meta_data,
      step,
      key,
      attributes: {
        link: {
          text: "Big Query Table",
          url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.bigquery_put.table_name}`,
        },
        title: "BigQuery Table",
        description: `${step.bigquery_put.table_name}`,
        tables: [
          create_bq_table({
            pdfDoc,
            key,
            column_count: columns.length,
            title: "Output",
          }),
          create_example_table({
            pdfDoc,
            columns,
          }),
        ],
      },
    });
}