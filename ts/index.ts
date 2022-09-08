const fs = require("fs");
const yaml = require("js-yaml");
const PDFDocument = require("pdfkit-table");

const fetch = require("./fetch/file_fetcher");
const { build_doc } = require("../utils");

import { MetaData, PipelineSteps } from "./types";
const pipeline_steps: PipelineSteps = require("./pipeline/index");

let pdfDoc = new PDFDocument({
  margins: {
    top: 50,
    bottom: 50,
    left: 30,
    right: 30,
  },
  size: "A4",
});
pdfDoc.pipe(fs.createWriteStream("SampleDocument.pdf"));

const name_space = process.argv[2];

const main = async () => {
  const chrono_text = await fetch("chrono.yaml", name_space);

  const obj = yaml.load(chrono_text);
  let meta_data: MetaData = {};

  const chrono_jobs = obj["data_sync"];
  let i = 0;
  const low = -1;
  const high = Infinity;
  job_loop: for (const job of chrono_jobs) {
    const { name, description, pipeline, schedule, timezone } = job;

    console.log(`${++i} of ${chrono_jobs.length}`);
    if (i < low || i > high) continue job_loop;
    for (const step of pipeline) {
      if (step.hasOwnProperty("bigquery_query")) {
        await pipeline_steps.bigquery_query!({
          step,
          name_space,
          meta_data,
          pdfDoc,
        });
      } else if (step.hasOwnProperty("standardsql_query")) {
        await pipeline_steps.standardsql_query!({
          step,
          name_space,
          meta_data,
          pdfDoc,
        });
      } else if (step.hasOwnProperty("ftp_put")) {
        pipeline_steps.ftp_put!({ step, meta_data, pdfDoc });
      } else if (step.hasOwnProperty("ftp_get")) {
        pipeline_steps.ftp_get!({ step, meta_data, pdfDoc });
      } else if (step.hasOwnProperty("encrypt")) {
        pipeline_steps.encrypt!({ step, name_space, meta_data, name });
      } else if (step.hasOwnProperty("decrypt")) {
        pipeline_steps.decrypt!({ step, name_space, meta_data, name });
      } else if (step.hasOwnProperty("reduce_to_delta")) {
        pipeline_steps.reduce_to_delta!({ step, name_space, meta_data, name });
      } else if (step.hasOwnProperty("python_transform")) {
        pipeline_steps.python_transform!({ step, name_space, meta_data });
      } else if (step.hasOwnProperty("bigquery_put")) {
        await pipeline_steps.bigquery_put!({
          step,
          name_space,
          meta_data,
          pdfDoc,
        });
      } else if (step.hasOwnProperty("mapper")) {
        await pipeline_steps.mapper!({ step, name_space, meta_data });
      }
    }

    build_doc({
      pdfDoc,
      meta_data,
      name,
      description,
      schedule,
      timezone,
      current_idx: i - 1,
    });
    meta_data = {};
    pdfDoc.addPage();
  }
  pdfDoc.end();
};

main();
