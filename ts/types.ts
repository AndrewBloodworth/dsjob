import { GoogleAPI } from "./googleapis";

export interface TableData {
  headers: TableHeader[];
  datas: any[];
  options: any;
}
export interface CreateTable {
  (data: Table): TableData;
}

export interface TableHeader {
  label: string;
  property: string;
  width: number;
  renderer: null;
}

export interface Table {
  pdfDoc: any;
}

export interface FTPTable extends Table {
  key: string;
  dirname: string;
  filename: string;
  title: string;
}

export interface BQTable extends Table {
  key: string;
  column_count: number;
  title: string;
}

export interface EXTable extends Table {
  columns: TableColumn[];
}

export interface TableColumn {
  name: string;
  type: string;
}

export interface Link {
  text: string;
  url: string;
}

export interface BQSchemaField {
  name: string;
  type: string;
}

export interface ListItem {
  [index: number]: string | string[];
}

export interface MetaData {
  [key: string]: {
    idx: string;
    link?: Link;
    tables?: TableData[];
    list?: ListItem[];
    [key: string]: undefined | string | Link | TableData[] | ListItem[];
  };
}
export interface MetaDataFormat {
  meta_data: MetaData;
  step: any;
  key: string;
  attributes: {
    [key: string]: any;
  };
}

export interface BuildJobFormat {
  pdfDoc: any;
  meta_data: MetaData;
  name: string;
  description: string;
  schedule: string;
  timezone: string;
  current_idx: number;
}

export interface MapperProp {
  [key: string]: string;
}

export interface MapperPropArr {
  array: string[];
}
export interface MapperCustomer {
  customer: MapperProp;
}

export interface MapperProducts {
  products: MapperProp;
}
export interface MapperProperties {
  customer?: MapperProp;
  products?: MapperProp[];
  distinct_id: string;
  source: string;
  mp_lib: string;
  token: string;
}
export interface MapperEvent {
  event: string;
  properties: MapperProperties;

  [key: string]: string | MapperProperties;
}

export interface PipelineSteps {
  bigquery_query?: (data: PipelineData) => Promise<void>;
  standardsql_query?: (data: PipelineData) => Promise<void>;
  ftp_put?: (data: PipelineData) => void;
  ftp_get?: (data: PipelineData) => void;
  encrypt?: (data: PipelineData) => void;
  decrypt?: (data: PipelineData) => void;
  reduce_to_delta?: (data: PipelineData) => void;
  python_transform?: (data: PipelineData) => void;
  bigquery_put?: (data: PipelineData) => Promise<void>;
  mapper?: (data: PipelineData) => Promise<void>;
}

export interface PipelineData {
  step: any;
  name_space?: string;
  meta_data: MetaData;
  pdfDoc?: any;
  name?: string;
}

export interface TextInsert {
  text: string;
  newline: boolean;
}

export interface LinkInsert {
  header: string;
  text: string;
  url: string;
  newline: boolean;
}

export interface TableInsert {
  rows: number;
  columns: number;
  count: number;
}

export interface TableCellTextInsert {
  text: string;
  endOfRow: boolean;
  endOfTable: boolean;
}

export interface TableRowData {
  text: string;
  style: string;
}

export interface TableRowInsert {
  data: TableRowData[];
  endOfTable: boolean;
}

export interface GoogleAPIConstructor {
  shared_folder_id: string;
}

export interface JobFormat {
  api: any;
  meta_data: MetaData;
  name: string;
  description: string;
  schedule: string;
  timezone: string;
  current_idx: number;
}
