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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
const PDFDocument = require("pdfkit-table");
const googleapis_1 = require("./googleapis");
const fetch = require("./fetch/file_fetcher");
const { build_doc, build_job } = require("./utils");
const pipeline_steps = require("./pipeline/index");
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const requests = [];
    const api = new googleapis_1.GoogleAPI({
        shared_folder_id: "1UUSX8xj-JGo6DM1z6YQ0-lQSFSl6sS14",
    });
    yield api.authenticate();
    const chrono_text = yield fetch("chrono.yaml", name_space);
    const obj = yaml.load(chrono_text);
    let meta_data = {};
    const chrono_jobs = obj["data_sync"];
    let i = 0;
    const low = -1;
    const high = 2;
    job_loop: for (const job of chrono_jobs) {
        const { name, description, pipeline, schedule, timezone } = job;
        console.log(`${++i} of ${chrono_jobs.length}`);
        if (i < low || i > high)
            continue job_loop;
        for (const step of pipeline) {
            if (step.hasOwnProperty("bigquery_query")) {
                yield pipeline_steps.bigquery_query({
                    step,
                    name_space,
                    meta_data,
                    pdfDoc,
                });
            }
            else if (step.hasOwnProperty("standardsql_query")) {
                yield pipeline_steps.standardsql_query({
                    step,
                    name_space,
                    meta_data,
                    pdfDoc,
                });
            }
            else if (step.hasOwnProperty("ftp_put")) {
                pipeline_steps.ftp_put({ step, meta_data, pdfDoc });
            }
            else if (step.hasOwnProperty("ftp_get")) {
                pipeline_steps.ftp_get({ step, meta_data, pdfDoc });
            }
            else if (step.hasOwnProperty("encrypt")) {
                pipeline_steps.encrypt({ step, name_space, meta_data, name });
            }
            else if (step.hasOwnProperty("decrypt")) {
                pipeline_steps.decrypt({ step, name_space, meta_data, name });
            }
            else if (step.hasOwnProperty("reduce_to_delta")) {
                pipeline_steps.reduce_to_delta({ step, name_space, meta_data, name });
            }
            else if (step.hasOwnProperty("python_transform")) {
                pipeline_steps.python_transform({ step, name_space, meta_data });
            }
            else if (step.hasOwnProperty("bigquery_put")) {
                yield pipeline_steps.bigquery_put({
                    step,
                    name_space,
                    meta_data,
                    pdfDoc,
                });
            }
            else if (step.hasOwnProperty("mapper")) {
                yield pipeline_steps.mapper({ step, name_space, meta_data });
            }
        }
        // build_doc({
        //   pdfDoc,
        //   meta_data,
        //   name,
        //   description,
        //   schedule,
        //   timezone,
        //   current_idx: i - 1,
        // });
        requests.push(build_job({
            api,
            meta_data,
            name,
            description,
            schedule,
            timezone,
            current_idx: i - 1,
        }));
        meta_data = {};
        pdfDoc.addPage();
    }
    pdfDoc.end();
    // console.log(
    //   requests.flatMap((r) => (Array.isArray(r) ? r.flatMap((r) => r) : r))
    // );
    yield api.create_document("tester", requests.flatMap((r) => (Array.isArray(r) ? r.flatMap((r) => r) : r)));
});
main();
