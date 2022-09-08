

const {
    create_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    PipelineData,
  } from "../types";

export = ({step,name_space,meta_data,name}: PipelineData) => {
    meta_data["decrypt"] = {
        idx: `${step.idx + 1}. decrypt: `,
        link: {
          text: "Chrono Admin",
          url: `https://bluecore.com/admin/chrono/${name_space}?job_runs=10&name=${name}&page_size=10`,
        },
      };
}