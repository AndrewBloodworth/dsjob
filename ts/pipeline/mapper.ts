
const yaml_parser = require("../parsers/yaml_parser");
const yaml = require("js-yaml");
const {

    create_bq_table,
    create_example_table,
    format_meta_data,

  } = require("../utils");
  import {
    MapperEvent,
    MetaData,
    PipelineData,
    BQSchemaField,
    MapperProperties,
    MapperProp,
  } from "../types";

export = async ({step,name_space,meta_data}: PipelineData) => {
    try {
        const mapper_obj = yaml.load(
          await yaml_parser(step.mapper.field_def_file, name_space)
        );

        const clean_mapper_value = (value:string) => {
          const trimmed = `${value}`.replace(/({|})/g, "").trim();
          const type_cast = trimmed.indexOf("|");
          return trimmed.substring(
            0,
            type_cast > -1 ? type_cast : trimmed.length
          );
        };
        
        let event_names: string[] = [];
        let direct: string[] = [];
        let modify: string[] = [];
        let hardcode: string[ ]= [];
        let type = "";
        const sort_and_clean_value = (attribute: string, value:string):void => {
            const cleaned = clean_mapper_value(value);
            value.indexOf("{{") > -1 &&
                    cleaned === attribute
                    ? direct.push(attribute)
                    : `${String(value)}`.indexOf("{{") > -1
                    ? modify.push(`${attribute}: ` + cleaned)
                    : hardcode.push(`${attribute}: ${value}`);
        }

        mapper_obj.events.map((evnt: MapperEvent) => {
          const properties: MapperProperties = evnt.properties
          event_names.push(evnt.event);
          Object.keys(properties).forEach((prop:string) => {      
            if (!!properties.products) {
                type = prop;    
                    properties.products.map((product:MapperProp) => {
                      return Object.entries(product).map(([attribute, value]) => {
                        return sort_and_clean_value(String(value), attribute)
                      });
                    });
            } else if (!!properties.customer) {
              type = prop;
              Object.entries(properties.customer).map(
                ([attribute, value]) => {
                    return sort_and_clean_value(String(value), attribute)
                  
            })
          };
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
        }})
      } catch (error) {}
}