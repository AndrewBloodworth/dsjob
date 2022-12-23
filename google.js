const docs = require("@googleapis/docs");
const drive = require("@googleapis/drive");
const main = async () => {
  const auth = new docs.auth.GoogleAuth({
    keyFilename: "./datasync-360-a102b6946967.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.create({
    requestBody: {
      title: "Your new document!" + Date.now(),
    },
  });

  const description = "this is a description.";
  const text = `Description: ${description}`;
  const text2 = "Fdsafdsa\n";

  let cur = 0;
  // const current = (() => {
  //   return (text) => {
  //     cur += text.length + 1;
  //     return text === "tb" ? "" : text;
  //   };
  // })();
  const get_request = {
    insertTextEndofSegment: ({ text, newline }) => {
      const startIndex = cur || 1;
      const endIndex = startIndex + text.indexOf(":") + 1;
      const txt = `${text}${newline ? "\n" : ""}`;
      cur += txt.length;
      return [
        {
          insertText: {
            // The first text inserted into the document must create a paragraph,
            // which can't be done with the `location` property.  Use the
            // `endOfSegmentLocation` instead, which assumes the Body if
            // unspecified.
            endOfSegmentLocation: {},
            text: txt,
          },
        },
        {
          updateTextStyle: {
            textStyle: {
              bold: true,
            },
            fields: "bold",
            range: {
              startIndex,
              endIndex,
            },
          },
        },
      ];
    },
    insertTextLocation: ({ text, newline }) => {
      const startIndex = cur;
      const idx = cur + 1;
      const endIndex = startIndex + text.indexOf(":") + 1;
      const txt = `${text}${newline ? "\n" : ""}`;
      cur += txt.length;
      return [
        {
          insertText: {
            // The first text inserted into the document must create a paragraph,
            // which can't be done with the `location` property.  Use the
            // `endOfSegmentLocation` instead, which assumes the Body if
            // unspecified.
            location: {
              index: idx,
            },
            text: txt,
          },
        },
        {
          updateTextStyle: {
            textStyle: {
              bold: true,
            },
            fields: "bold",
            range: {
              startIndex,
              endIndex,
            },
          },
        },
      ];
    },
    insertTable: ({ rows, columns, newline }) => {
      cur += 5;
      return {
        insertTable: {
          rows,
          columns,
          endOfSegmentLocation: {
            segmentId: "",
          },
          // Union field insertion_location can be only one of the following:
        },
      };
    },
    insertTableCellText: ({ text, endOfRow }) => {
      const padding = endOfRow ? 3 : 2;
      const idx = cur;
      cur += text.length + padding;
      return {
        insertText: {
          // The first text inserted into the document must create a paragraph,
          // which can't be done with the `location` property.  Use the
          // `endOfSegmentLocation` instead, which assumes the Body if
          // unspecified.
          location: {
            index: idx,
          },
          text: text,
        },
      };
    },
    insertTableRow: ({ data }) => {
      return data.flatMap(({ text, style }, index, { length }) => {
        const startIndex = cur;
        const cell = get_request.insertTableCellText({
          text,
          endOfRow: index + 1 === length,
        });
        const endIndex = startIndex + text.length;

        return style === "bold"
          ? [
              cell,
              {
                updateTextStyle: {
                  textStyle: {
                    bold: true,
                  },
                  fields: "bold",
                  range: {
                    startIndex,
                    endIndex,
                  },
                },
              },
            ]
          : cell;
      });
    },
  };

  await client.documents.batchUpdate({
    documentId: createResponse.data.documentId,
    requestBody: {
      requests: [
        ...get_request.insertTextEndofSegment({
          text: `Description: ${description}`,
          newline: true,
          style: "bold",
        }),
        ...get_request.insertTextLocation({
          text: `Frequency: ${"fdsafdsafdsa"}`,
          newline: true,
          style: "bold",
        }),
        get_request.insertTable({ rows: 9, columns: 2 }),
        ...get_request.insertTableRow({
          data: [
            { text: "Description", style: "bold" },
            { text: "Information", style: "bold" },
          ],
        }),

        ...get_request.insertTableRow({
          data: [
            { text: "Directory", style: "none" },
            { text: "d1", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "FileName", style: "none" },
            { text: "d2", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "Zipped", style: "none" },
            { text: "d3", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "Encrypted", style: "none" },
            { text: "d4", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "Historical", style: "none" },
            { text: "d5", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "Incremental or Full ", style: "none" },
            { text: "d6", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "# of Rows", style: "none" },
            { text: "d7", style: "none" },
          ],
        }),
        ...get_request.insertTableRow({
          data: [
            { text: "# of Columns", style: "none" },
            { text: "d8", style: "none" },
          ],
        }),
      ],
    },
  });
  // requests: [
  //   {
  //     insertText: {
  //       // The first text inserted into the document must create a paragraph,
  //       // which can't be done with the `location` property.  Use the
  //       // `endOfSegmentLocation` instead, which assumes the Body if
  //       // unspecified.
  //       endOfSegmentLocation: {},
  //       text: current(text),
  //     },
  //   },
  //   {
  //     insertText: {
  //       location: {
  //         index: cur,
  //       },
  //       text: current(text2),
  //     },
  //   },
  //   {
  //     updateTextStyle: {
  //       textStyle: {
  //         bold: true,
  //       },
  //       fields: "bold",
  //       range: {
  //         startIndex: 1,
  //         endIndex: text.split(":")[0].length + 1,
  //       },
  //     },
  //   },
  //   {
  //     insertTable: {
  //       rows: 3,
  //       columns: 2,
  //       endOfSegmentLocation: {
  //         segmentId: current("tb"),
  //       },
  //       // Union field insertion_location can be only one of the following:
  //     },
  //   },
  //   {
  //     insertText: {
  //       location: {
  //         index: cur,
  //       },
  //       text: current("Hui"),
  //     },
  //   },
  //   {
  //     insertText: {
  //       location: {
  //         index: cur + 1,
  //       },
  //       text: "Hi",
  //     },
  //   },
  //   // {
  //   //   insertTableRow: {
  //   //     tableCellLocation: {
  //   //       tableStartLocation: {
  //   //         index: text.length + 1 + text2.length + 2,
  //   //       },
  //   //       rowIndex: 1,
  //   //       columnIndex: 1,
  //   //     },
  //   //     insertBelow: "true",
  //   //   },
  //   // },
  // ],
  const drive_auth = new drive.auth.GoogleAuth({
    keyFilename: "./datasync-360-a102b6946967.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive_auth_client = await drive_auth.getClient();

  const drive_client = await drive.drive({
    version: "v3",
    auth: drive_auth_client,
  });

  const file = await drive_client.files.get({
    fileId: createResponse.data.documentId,
    fields: "parents",
  });

  // Move the file to the new folder
  const previousParents = file.data.parents
    .map(function (parent) {
      return parent.id;
    })
    .join(",");
  const files = await drive_client.files.update({
    fileId: createResponse.data.documentId,
    addParents: "1UUSX8xj-JGo6DM1z6YQ0-lQSFSl6sS14",
    removeParents: previousParents,
    fields: "id, parents",
  });
  console.log(files.status);

  console.log(createResponse.data);
};
main();
