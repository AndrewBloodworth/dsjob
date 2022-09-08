"use strict";
const { create_table, create_example_table, format_meta_data, } = require("../utils");
module.exports = ({ step, name_space, meta_data }) => {
    meta_data["python_transform"] = {
        idx: `${step.idx + 1}. python_transform: `,
        link: {
            text: `${step.python_transform.source_file_path}`,
            url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.python_transform.source_file_path}`,
        },
    };
};
