const axios = require("axios");
//require("dotenv").config();
//const GITHUB_TOKEN = "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";

module.exports = async (file_name, name_space) => {
  try {
    require("dotenv").config();
    console.log(process.env);
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const { data } = await axios.get(
      `https://api.github.com/repos/TriggerMail/${name_space}/contents/${file_name}?ref=master`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v4.raw",
        },
      }
    );

    return data;
  } catch (error) {
    //  console.log(error);
    return "";
  }
};
