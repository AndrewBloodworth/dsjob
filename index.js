const fs = require("fs");
const yaml = require("js-yaml");
const PDFDocument = require("pdfkit-table");

const sql_parser = require("./sql_parser");
const yaml_parser = require("./yaml_parser");
const fetch = require("./fetch");
const {
  create_table,
  create_bq_table,
  create_example_table,
  format_meta_data,
  capitalize,
  build_meta_data,
  build_doc,
} = require("./utils.js");

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

const pipeline_steps = {
  bigquery_query: "bigquery_query",
  encrypt: "encrypt",
  ftp_put: "ftp_put",
};
const name_space = process.argv[2];
const main = async () => {
  const chrono_text = await fetch("chrono.yaml", name_space);
  console.log(chrono_text);
  const obj = yaml.load(
    chrono_text
    // fs.readFileSync("test_chrono.yaml", { encoding: "utf-8" })
  );
  let meta_data = {};

  const chrono_jobs = obj["data_sync"];
  let i = 0;
  const low = -1;
  const high = Infinity;
  job_loop: for (const job of chrono_jobs) {
    const { name, description, pipeline, schedule, timezone } = job;

    console.log(`${++i} of ${chrono_jobs.length}`);
    if (i < low || i > high) continue job_loop;
    pipeline_loop: for (const step of pipeline) {
      if (step.hasOwnProperty("bigquery_query")) {
        const key = "bigquery_query";
        const columns = await sql_parser(
          step.bigquery_query.source_file_path,
          name_space
        );

        format_meta_data({
          meta_data,
          step,
          key,
          attributes: {
            link: {
              text: `${step.bigquery_query.source_file_path}`,
              url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.bigquery_query.source_file_path}`,
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
      } else if (step.hasOwnProperty("standardsql_query")) {
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
      } else if (step.hasOwnProperty("ftp_put")) {
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
      } else if (step.hasOwnProperty("ftp_get")) {
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
      } else if (step.hasOwnProperty("encrypt")) {
        meta_data["encrypt"] = {
          idx: `${step.idx + 1}. encrypt: `,
          link: {
            text: "Chrono Admin",
            url: `https://bluecore.com/admin/chrono/${name_space}?job_runs=10&name=${name}&page_size=10`,
          },
        };
      } else if (step.hasOwnProperty("decrypt")) {
        meta_data["decrypt"] = {
          idx: `${step.idx + 1}. decrypt: `,
          link: {
            text: "Chrono Admin",
            url: `https://bluecore.com/admin/chrono/${name_space}?job_runs=10&name=${name}&page_size=10`,
          },
        };
      } else if (step.hasOwnProperty("reduce_to_delta")) {
        meta_data["reduce_to_delta"] = {
          idx: `${step.idx + 1}. reduce_to_delta: `,
          link: {
            text: "Chrono Admin",
            url: `https://bluecore.com/admin/chrono/${name_space}?job_runs=10&name=${name}&page_size=10`,
          },
        };
      } else if (step.hasOwnProperty("python_transform")) {
        meta_data["python_transform"] = {
          idx: `${step.idx + 1}. python_transform: `,
          link: {
            text: `${step.python_transform.source_file_path}`,
            url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.python_transform.source_file_path}`,
          },
        };
      } else if (step.hasOwnProperty("bigquery_put")) {
        const key = "bigquery_put";
        const columns = JSON.parse(step.bigquery_put.schema).fields.map(
          ({ name, type }) => ({ name, type })
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
      } else if (step.hasOwnProperty("mapper")) {
        try {
          const mapper_obj = yaml.load(
            await yaml_parser(step.mapper.field_def_file, name_space)
          );

          const clean_mapper_value = (value) => {
            const trimmed = `${value}`.replace(/({|})/g, "").trim();
            const type_cast = trimmed.indexOf("|");
            return trimmed.substring(
              0,
              type_cast > -1 ? type_cast : trimmed.length
            );
          };
          let effected_props = [];
          let event_names = [];
          let direct = [];
          let modify = [];
          let hardcode = [];
          let type = "";
          mapper_obj.events.map((evnt) => {
            const { event, properties } = evnt;
            event_names.push(event);
            Object.keys(properties).forEach((prop) => {
              if (prop === "products") {
                type = prop;
                effected_props = properties[prop].map((product) => {
                  return Object.entries(product).map(([attribute, value]) => {
                    // console.log(product);
                    const cleaned = clean_mapper_value(value);
                    return `${value}`.indexOf("{{") > -1 &&
                      cleaned === attribute
                      ? direct.push(attribute)
                      : `${value}`.indexOf("{{") > -1
                      ? modify.push(`${attribute}: ` + cleaned)
                      : hardcode.push(`${attribute}: ${value}`);
                  });
                });
              } else if (prop === "customer") {
                type = prop;
                console.log(properties[prop]);
                effected_props = Object.entries(properties[prop]).map(
                  ([attribute, value]) => {
                    // console.log(attribute, value);
                    const cleaned = clean_mapper_value(value);
                    return `${value}`.indexOf("{{") > -1 &&
                      cleaned === attribute
                      ? direct.push(attribute)
                      : `${value}`.indexOf("{{") > -1
                      ? modify.push(`${attribute}: ` + cleaned)
                      : hardcode.push(`${attribute}: ${value}`);
                  }
                );
              }
            });
          });

          meta_data["mapper"] = {
            idx: `${step.idx + 1}. mapper: `,
            link: {
              text: `${step.mapper.field_def_file}`,
              url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.mapper.field_def_file}`,
            },
            title: "Mapper",
            description: `Fire ${event_names.join(
              ", "
            )} event for each ${type}.`,
            list: [
              "Attributes",
              [
                "Directly from Input",
                direct,
                "Modified (output: input)",
                modify,
                "Hard Coded",
                hardcode,
              ],
            ],
          };
        } catch (error) {}
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
