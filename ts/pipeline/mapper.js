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
const yaml_parser = require("../parsers/yaml_parser");
const yaml = require("js-yaml");
const { create_bq_table, create_example_table, format_meta_data, } = require("../utils");
module.exports = ({ step, name_space, meta_data }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mapper_obj = yaml.load(yield yaml_parser(step.mapper.field_def_file, name_space));
        const clean_mapper_value = (value) => {
            const trimmed = `${value}`.replace(/({|})/g, "").trim();
            const type_cast = trimmed.indexOf("|");
            return trimmed.substring(0, type_cast > -1 ? type_cast : trimmed.length);
        };
        let event_names = [];
        let direct = [];
        let modify = [];
        let hardcode = [];
        let type = "";
        const sort_and_clean_value = (attribute, value) => {
            const cleaned = clean_mapper_value(value);
            value.indexOf("{{") > -1 &&
                cleaned === attribute
                ? direct.push(attribute)
                : `${String(value)}`.indexOf("{{") > -1
                    ? modify.push(`${attribute}: ` + cleaned)
                    : hardcode.push(`${attribute}: ${value}`);
        };
        mapper_obj.events.map((evnt) => {
            const properties = evnt.properties;
            event_names.push(evnt.event);
            Object.keys(properties).forEach((prop) => {
                if (!!properties.products) {
                    type = prop;
                    properties.products.map((product) => {
                        return Object.entries(product).map(([attribute, value]) => {
                            return sort_and_clean_value(String(value), attribute);
                        });
                    });
                }
                else if (!!properties.customer) {
                    type = prop;
                    Object.entries(properties.customer).map(([attribute, value]) => {
                        return sort_and_clean_value(String(value), attribute);
                    });
                }
                ;
            });
            meta_data["mapper"] = {
                idx: `${step.idx + 1}. mapper: `,
                link: {
                    text: `${step.mapper.field_def_file}`,
                    url: `https://github.com/TriggerMail/${name_space}/blob/master/${step.mapper.field_def_file}`,
                },
                title: "Mapper",
                description: `Fire ${event_names.join(", ")} event for each ${type}.`,
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
        });
    }
    catch (error) { }
});
