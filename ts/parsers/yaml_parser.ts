
const fetch = require("../fetch/file_fetcher");
export = async (file_name:string, name_space:string) => {
  const text = await fetch(file_name, name_space);

  return text
    .replace(/(?<!'){{/gm, "'{{")
    .replace(/}}(?!')/g, "}}'")
    .replace(/(>-\n)/g, "");
};