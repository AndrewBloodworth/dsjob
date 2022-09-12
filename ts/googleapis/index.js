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
exports.GoogleAPI = void 0;
const docs = require("@googleapis/docs");
const drive = require("@googleapis/drive");
const path = require("path");
class GoogleAPI {
    constructor({ shared_folder_id }) {
        this.client = { docs, drive };
        this.current_index = 0;
        this.shared_folder_id = shared_folder_id;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs_auth = new docs.auth.GoogleAuth({
                keyFilename: path.join(__dirname, "datasync-360-a102b6946967.json"),
                scopes: ["https://www.googleapis.com/auth/documents"],
            });
            const drive_auth = new drive.auth.GoogleAuth({
                keyFilename: path.join(__dirname, "datasync-360-a102b6946967.json"),
                scopes: ["https://www.googleapis.com/auth/drive"],
            });
            this.client.docs = yield docs.docs({
                version: "v1",
                auth: yield docs_auth.getClient(),
            });
            this.client.drive = yield drive.drive({
                version: "v3",
                auth: yield drive_auth.getClient(),
            });
        });
    }
    create_document(name, requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.docs.documents.create({
                requestBody: {
                    title: `${name} - ${Date.now()}`,
                },
            });
            yield this.client.docs.documents.batchUpdate({
                documentId: response.data.documentId,
                requestBody: {
                    requests,
                },
            });
            const file = yield this.client.drive.files.get({
                fileId: response.data.documentId,
                fields: "parents",
            });
            const previousParents = file.data.parents
                .map(function (parent) {
                return parent.id;
            })
                .join(",");
            yield this.client.drive.files.update({
                fileId: response.data.documentId,
                addParents: this.shared_folder_id,
                removeParents: previousParents,
                fields: "id, parents",
            });
        });
    }
    insertJobName({ text, newline }) {
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
    insertTextEndofSegment({ text, newline }) {
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
    insertTextLocation({ text, newline }) {
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
    insertNewLine({ text, newline }) {
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
    insertLink({ header, text, url, newline }) {
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
    insertTable({ rows, columns, count }) {
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
    insertTableCellText({ text, endOfRow, endOfTable }) {
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
    insertTableRow({ data, endOfTable }) {
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
    flatten_requests(requests) {
        return requests.flatMap((request) => request);
    }
}
exports.GoogleAPI = GoogleAPI;
