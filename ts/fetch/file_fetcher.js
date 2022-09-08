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
const axios = require("axios");
module.exports = (file_name, name_space) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        require("dotenv").config();
        const { data } = yield axios.get(`https://api.github.com/repos/TriggerMail/${name_space}/contents/${file_name}?ref=master`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v4.raw",
            },
        });
        return data;
    }
    catch (error) {
        console.log(error);
        return "";
    }
});
