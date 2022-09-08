

const {
    create_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    PipelineData,
  } from "../types";

export = ({step,name_space,meta_data}: PipelineData) => {
    meta_data["python_transform"] = {
        idx: `${step.idx + 1}. python_transform: `,
        link: {
          text: `${step.python_transform.source_file_path}`,
          url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.python_transform.source_file_path}`,
        },
      };
}