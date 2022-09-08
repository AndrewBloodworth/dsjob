

const {
    create_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    PipelineData,
  } from "../types";

export = ({step,meta_data,pdfDoc}: PipelineData) => {
    
    const { dirname, filename } = step.ftp_put;
    const key = "ftp_put";
    const columns = [{ name: "Any", type: "N/A" }];
    format_meta_data({
      meta_data,
      step,
      key,

      attributes: {
        dirname,
        link: {
          text: "Output Exavault Directory",
          url: `https://triggermail.exavault.com/files/${dirname}`,
        },
        filename,
        zipped: !!filename && filename.indexOf(".gzip") > -1,
        encrypted: !!filename && filename.indexOf(".pgp") > -1,
        tables: [
          create_table({ pdfDoc, key, dirname, filename, title: "Output" }),
          create_example_table({
            pdfDoc,
            columns,
          }),
        ],
      },
    });
}