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
const googleapis_1 = require("./googleapis");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const api = new googleapis_1.GoogleAPI({
        shared_folder_id: "1UUSX8xj-JGo6DM1z6YQ0-lQSFSl6sS14",
    });
    yield api.authenticate();
    const description = "this is a description.";
    yield api.create_document("tester", api.flatten_requests([
        api.insertTextEndofSegment({
            text: `Description: ${description}`,
            newline: true,
        }),
        api.insertTextLocation({
            text: `Frequency: ${"fdsafdsafdsa"}`,
            newline: true,
        }),
        api.insertTable({ rows: 9, columns: 2, count: 5 }),
        api.insertTableRow({
            data: [
                { text: "Description", style: "bold" },
                { text: "Information", style: "bold" },
            ],
            endOfTable: false,
        }),
        api.insertTableRow({
            data: [
                { text: "Directory", style: "none" },
                { text: "Value/value", style: "none" },
            ],
            endOfTable: true,
        }),
    ]));
}))();
