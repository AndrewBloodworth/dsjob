const docs = require("@googleapis/docs");
const drive = require("@googleapis/drive");
const path = require("path");
import {
  GoogleAPIConstructor,
  TextInsert,
  TableInsert,
  TableCellTextInsert,
  TableRowInsert,
  LinkInsert,
} from "../types";

export class GoogleAPI {
  client: {
    docs: any;
    drive: any;
  };
  current_index: number;
  shared_folder_id: string;
  constructor({ shared_folder_id }: GoogleAPIConstructor) {
    this.client = { docs, drive };
    this.current_index = 0;
    this.shared_folder_id = shared_folder_id;
  }
  async authenticate() {
    const docs_auth = new docs.auth.GoogleAuth({
      keyFilename: path.join(__dirname, "datasync-360-a102b6946967.json"),
      scopes: ["https://www.googleapis.com/auth/documents"],
    });
    const drive_auth = new drive.auth.GoogleAuth({
      keyFilename: path.join(__dirname, "datasync-360-a102b6946967.json"),
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    this.client.docs = await docs.docs({
      version: "v1",
      auth: await docs_auth.getClient(),
    });
    this.client.drive = await drive.drive({
      version: "v3",
      auth: await drive_auth.getClient(),
    });
  }
  async create_document(name: string, requests: any[]) {
    const response = await this.client.docs.documents.create({
      requestBody: {
        title: `${name} - ${Date.now()}`,
      },
    });
    await this.client.docs.documents.batchUpdate({
      documentId: response.data.documentId,
      requestBody: {
        requests,
      },
    });

    const file = await this.client.drive.files.get({
      fileId: response.data.documentId,
      fields: "parents",
    });

    const previousParents = file.data.parents
      .map(function (parent: any) {
        return parent.id;
      })
      .join(",");
    await this.client.drive.files.update({
      fileId: response.data.documentId,
      addParents: this.shared_folder_id,
      removeParents: previousParents,
      fields: "id, parents",
    });
  }
  insertJobName({ text, newline }: TextInsert) {
    const startIndex = this.current_index || 1;
    const endIndex = startIndex + text.length;
    const txt = `${text}${newline ? "\n" : ""}`;
    this.current_index += txt.length;
    return [
      {
        insertText: {
          endOfSegmentLocation: {},
          text: txt,
        },
      },
      {
        updateTextStyle: {
          textStyle: {
            bold: true,
            fontSize: {
              magnitude: 20,
              unit: "PT",
            },
            foregroundColor: {
              color: {
                rgbColor: {
                  red: 0.0,
                  green: 0.0,
                  blue: 1.0,
                },
              },
            },
          },
          fields: "bold, fontSize, foregroundColor",
          range: {
            startIndex,
            endIndex,
          },
        },
      },
    ];
  }
  insertTextEndofSegment({ text, newline }: TextInsert) {
    const startIndex = this.current_index || 1;
    const endIndex = this.current_index + text.indexOf(":");
    const txt = `${text}${newline ? "\n" : ""}`;
    this.current_index += txt.length;
    return [
      {
        insertText: {
          endOfSegmentLocation: {},
          text: txt,
        },
      },
      {
        updateTextStyle: {
          textStyle: {
            bold: true,
          },
          fields: "bold",
          range: {
            startIndex,
            endIndex,
          },
        },
      },
    ];
  }
  insertTextLocation({ text, newline }: TextInsert) {
    const idx = this.current_index + 1;
    const startIndex = this.current_index;
    const endIndex = startIndex + text.indexOf(":") + 1;
    const txt = `${text}${newline ? "\n" : ""}`;
    this.current_index += txt.length;
    return [
      {
        insertText: {
          endOfSegmentLocation: {},
          //   location: {
          //     index: idx,
          //   },
          text: txt,
        },
      },
      {
        updateTextStyle: {
          textStyle: {
            bold: true,
          },
          fields: "bold",
          range: {
            startIndex,
            endIndex,
          },
        },
      },
    ];
  }
  insertNewLine({ text, newline }: TextInsert) {
    this.current_index += 1;
    return {
      insertText: {
        endOfSegmentLocation: {},
        text: "\n",
      },
    };
  }
  insertPageBreak() {
    this.current_index += 2;
    return {
      insertPageBreak: {
        endOfSegmentLocation: {},
      },
    };
  }
  insertLink({ header, text, url, newline }: LinkInsert) {
    const idx = this.current_index + 1;
    const startIndex = this.current_index + header.length;
    const endIndex = startIndex + text.length + 1;
    const txt = `${header}${text}${newline ? "\n" : ""}`;
    this.current_index += txt.length;
    return [
      {
        insertText: {
          //   location: {
          //     index: idx,
          //   },
          endOfSegmentLocation: {},
          text: txt,
        },
      },
      {
        updateTextStyle: {
          textStyle: {
            link: {
              url,
            },
          },
          range: {
            startIndex,
            endIndex,
          },
          fields: "link",
        },
      },
    ];
  }
  insertTable({ rows, columns, count }: TableInsert) {
    this.current_index += count;
    return {
      insertTable: {
        rows,
        columns,
        endOfSegmentLocation: {
          segmentId: "",
        },
      },
    };
  }
  insertTableCellText({ text, endOfRow, endOfTable }: TableCellTextInsert) {
    const padding = endOfRow ? (endOfTable ? 2 : 3) : 2;
    const idx = this.current_index;
    this.current_index += text.length + padding;
    return {
      insertText: {
        location: {
          index: idx,
        },
        // endOfSegmentLocation: {},
        text: text,
      },
    };
  }
  insertTableRow({ data, endOfTable }: TableRowInsert) {
    return data.flatMap(({ text, style }, index, { length }) => {
      const startIndex = this.current_index;
      const cell = this.insertTableCellText({
        text,
        endOfRow: index + 1 === length,
        endOfTable,
      });
      const endIndex = startIndex + text.length;
      if (endOfTable) {
        //  this.current_index += 2;
      }
      return style === "bold"
        ? [
            cell,
            {
              updateTextStyle: {
                textStyle: {
                  bold: true,
                },
                fields: "bold",
                range: {
                  startIndex,
                  endIndex,
                },
              },
            },
          ]
        : cell;
    });
  }
  flatten_requests(requests: any[]) {
    return requests.flatMap((request) => request);
  }
}
