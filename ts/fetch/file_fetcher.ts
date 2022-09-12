const axios = require("axios");

export = async (file_name: string, name_space: string) => {
  try {
    require("dotenv").config();
    const { data } = await axios.get(
      `https://api.github.com/repos/TriggerMail/${name_space}/contents/${file_name}?ref=master`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v4.raw",
        },
      }
    );

    return data;
  } catch (error) {
    return "";
  }
};
