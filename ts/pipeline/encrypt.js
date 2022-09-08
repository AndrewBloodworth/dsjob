"use strict";
const { create_table, create_example_table, format_meta_data, } = require("../utils");
module.exports = ({ step, name_space, meta_data, name }) => {
    meta_data["encrypt"] = {
        idx: `${step.idx + 1}. encrypt: `,
        link: {
            text: "Chrono Admin",
            url: `https://bluecore.com/admin/chrono/${name_space}?job_runs=10&name=${name}&page_size=10`,
        },
    };
};
