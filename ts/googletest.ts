import { GoogleAPI } from "./googleapis";

(async () => {
  const api = new GoogleAPI({
    shared_folder_id: "1UUSX8xj-JGo6DM1z6YQ0-lQSFSl6sS14",
  });

  await api.authenticate();

  const description = "this is a description.";

  await api.create_document(
    "tester",
    api.flatten_requests([
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
    ])
  );
})();
