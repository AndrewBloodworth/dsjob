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
module.exports = {
    bigquery_query: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield require('./bigquery_query')(data); }),
    standardsql_query: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield require('./standardsql_query')(data); }),
    ftp_put: (data) => require('./ftp_put')(data),
    ftp_get: (data) => require('./ftp_get')(data),
    encrypt: (data) => require('./encrypt')(data),
    decrypt: (data) => require('./decrypt')(data),
    reduce_to_delta: (data) => require('./decrypt')(data),
    python_transform: (data) => require('./python_transform')(data),
    bigquery_put: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield require('./bigquery_put')(data); }),
    mapper: (data) => __awaiter(void 0, void 0, void 0, function* () { return yield require('./mapper')(data); }),
};
