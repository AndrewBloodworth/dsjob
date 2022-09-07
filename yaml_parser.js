const { Parser } = require("node-sql-parser");
const parser = new Parser();
const fs = require("fs");
const fetch = require("./f2");
module.exports = async (file_name, name_space) => {
  const text = await fetch(file_name, name_space);

  return text
    .replace(/(?<!'){{/gm, "'{{")
    .replace(/}}(?!')/g, "}}'")
    .replace(/(>-\n)/g, "");
};
