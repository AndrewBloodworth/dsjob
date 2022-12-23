import { PipelineData } from "../types";
import bigquery_put from "./bigquery_put";
export = {
  bigquery_query: async (data: PipelineData) =>
    await require("./bigquery_query")(data),
  standardsql_query: async (data: PipelineData) =>
    await require("./standardsql_query")(data),
  ftp_put: (data: PipelineData): void => require("./ftp_put")(data),
  ftp_get: (data: PipelineData): void => require("./ftp_get")(data),
  encrypt: (data: PipelineData): void => require("./encrypt")(data),
  decrypt: (data: PipelineData): void => require("./decrypt")(data),
  reduce_to_delta: (data: PipelineData): void =>
    require("./reduce_to_delta")(data),
  python_transform: (data: PipelineData): void =>
    require("./python_transform")(data),
  bigquery_put: async (data: PipelineData) =>
    await require("./bigquery_put")(data),
  mapper: async (data: PipelineData) => await require("./mapper")(data),
};
