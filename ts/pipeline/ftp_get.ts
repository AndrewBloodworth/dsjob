

const {
    create_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    PipelineData,
  } from "../types";

export = ({step,meta_data,pdfDoc}: PipelineData) => {
    const { dirname, glob } = step.ftp_get;
    const key = "ftp_get";
    const columns = [{ name: "Any", type: "N/A" }];
    format_meta_data({
      meta_data,
      step,
      key,
      attributes: {
        dirname,
        link: {
          text: "Input Exavault Directory",
          url: `https://triggermail.exavault.com/files/${dirname}`,
        },
        filename: glob,
        zipped: glob.indexOf(".gzip") > -1,
        encrypted: glob.indexOf(".pgp") > -1,
        tables: [
          create_table({
            pdfDoc,
            key,
            dirname,
            filename: glob,
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