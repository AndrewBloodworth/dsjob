const capitalize = (text) => {
  if (!text) return "";
  const [first, ...last] = text.split("");
  return first.toUpperCase() + last.join("");
};
module.exports = {
  create_table: ({ pdfDoc, key, dirname, filename, title }) => {
    return {
      headers: [
        {
          label: "Description",
          property: "desc",
          width: 150,
          renderer: null,
        },
        {
          label: "Information",
          property: "info",
          width: 375,
          renderer: null,
        },
      ],
      datas: [
        {
          options: { fontSize: 10, separation: true },
          desc: {
            label: "Directory",
          },
          info: { label: dirname || "NO DESCRIPTION" },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "FileName",
          },
          info: { label: filename },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Zipped",
          },
          info: { label: !!filename && filename.indexOf(".gzip") > -1 },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Encrypted",
          },
          info: { label: !!filename && filename.indexOf(".pgp") > -1 },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Historical",
          },
          info: { label: `Yes/No` },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Incremental or Full",
          },
          info: {
            label: "Incremental - new or updated rows since last extract.",
          },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "# of Rows",
          },
          info: { label: "Any" },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "# of Columns",
          },
          info: { label: "Any" },
        },
      ],

      options: {
        // properties
        title,
        subtitle: key.toUpperCase(),
        width: 525, // {Number} default: undefined // A4 595.28 x 841.89 (portrait) (about width sizes)

        divider: {
          header: { disabled: false, width: 2, opacity: 1 },
          horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
        },
        padding: 5, // {Number} default: 0
        columnSpacing: 5, // {Number} default: 5
        hideHeader: false,
        minRowHeight: 0,
        // functions
        prepareHeader: () => pdfDoc.font("Helvetica-Bold").fontSize(12), // {Function}
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          const { x, y, width, height } = rectCell;
          pdfDoc.rect(x, y, width, height); // {Function}}
          pdfDoc.font("Helvetica").fontSize(11); // {Function}}
        },
      },
    };
  },
  create_bq_table: ({ pdfDoc, key, column_count, title }) => {
    return {
      headers: [
        {
          label: "Description",
          property: "desc",
          width: 150,
          renderer: null,
        },
        {
          label: "Information",
          property: "info",
          width: 375,
          renderer: null,
        },
      ],
      datas: [
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Historical",
          },
          info: { label: `Yes/No` },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "Incremental or Full",
          },
          info: {
            label: "Incremental - new or updated rows since last extract.",
          },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "# of Rows",
          },
          info: { label: "Any" },
        },
        {
          options: { fontSize: 10, separation: true },

          desc: {
            label: "# of Columns",
          },
          info: { label: column_count },
        },
      ],

      options: {
        // properties
        title,
        subtitle: key.toUpperCase(),
        width: 525, // {Number} default: undefined // A4 595.28 x 841.89 (portrait) (about width sizes)

        divider: {
          header: { disabled: false, width: 2, opacity: 1 },
          horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
        },
        padding: 5, // {Number} default: 0
        columnSpacing: 5, // {Number} default: 5
        hideHeader: false,
        minRowHeight: 0,
        // functions
        prepareHeader: () => pdfDoc.font("Helvetica-Bold").fontSize(12), // {Function}
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          const { x, y, width, height } = rectCell;

          //   console.log(
          //     row.desc.label.includes("Columns"),
          //     row.desc.label,
          //     row.desc.label.indexOf("Column") > -1
          //   );
          if (row.desc.label.includes("Columns") && row.info.label === "Any") {
            pdfDoc.fillColor("red");
          } else {
            pdfDoc.fillColor("black");
          }
          pdfDoc.rect(x, y, width, height); // {Function}}
          pdfDoc.font("Helvetica").fontSize(11); // {Function}}
        },
      },
    };
  },
  create_example_table: ({ pdfDoc, columns }) => {
    return {
      headers: [
        {
          label: "Field",
          property: "field",
          width: 150,
          renderer: null,
        },
        {
          label: "Data Type",
          property: "type",
          width: 150,
          renderer: null,
        },
        {
          label: "Note",
          property: "note",
          width: 225,
          renderer: null,
        },
      ],
      datas: columns.map(({ name, type }) => {
        return {
          options: { fontSize: 10, separation: true },
          field: {
            label: name,
          },
          type: {
            label: type,
          },
          note: {
            label: name === "Any" ? "Unable to autofill columns" : "N/A",
          },
        };
      }),

      options: {
        // properties
        //title: "Columns",
        subtitle: "Columns",
        width: 525, // {Number} default: undefined // A4 595.28 x 841.89 (portrait) (about width sizes)

        divider: {
          header: { disabled: false, width: 2, opacity: 1 },
          horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
        },
        padding: 5, // {Number} default: 0
        columnSpacing: 5, // {Number} default: 5
        hideHeader: false,
        minRowHeight: 0,
        // functions
        prepareHeader: () => pdfDoc.font("Helvetica-Bold").fontSize(12), // {Function}
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          const { x, y, width, height } = rectCell;
          pdfDoc.fillColor(
            row.note.label === "Unable to autofill columns" ? "red" : "black"
          );
          pdfDoc.rect(x, y, width, height); // {Function}}
          pdfDoc.font("Helvetica").fontSize(11); // {Function}}
        },
      },
    };
  },
  format_meta_data: ({ meta_data, step, key, attributes }) => {
    meta_data[key] = {
      idx: `${step.idx + 1}. ${key}: `,
      ...attributes,
    };
  },
  capitalize,
  build_doc: ({
    pdfDoc,
    meta_data,
    name,
    description,
    schedule,
    timezone,
    current_idx,
  }) => {
    pdfDoc.fontSize(16);
    pdfDoc
      .fillColor("#0a20a0")
      .font("Helvetica-Bold")
      .text(`${current_idx} ${name}`)
      .moveDown(1);
    pdfDoc.fontSize(12);

    // Add a top-level bookmark
    const top = pdfDoc.outline.addItem(`${name}`);

    // // Add a sub-section
    // top.addItem('Sub-section');
    pdfDoc
      .fillColor("black")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`Pipeline Steps:`, { underline: true })
      .moveDown(0.5);

    Object.entries(meta_data).forEach(([key, value], index) => {
      const {
        idx,
        link: { text, url },
      } = value;
      pdfDoc
        .font("Helvetica-Bold")
        .fillColor("black")
        .text(`${idx}`, { continued: true })
        .font("Helvetica")
        .fillColor("blue")
        .text(text, { align: "justify", link: url, underline: true });
      // index !== 0 && pdfDoc.moveDown(1);
    });
    pdfDoc.moveDown(1);

    pdfDoc.fontSize(12);
    pdfDoc
      .fillColor("black")
      .font("Helvetica-Bold")
      .text(`Description: `, { continued: true })

      .font("Helvetica")
      // .fontSize(10)
      .text(`${!!description ? capitalize(description) : "No description"}`)
      .moveDown(1)
      .fillColor("black")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Frequency: `, { continued: true })
      .font("Helvetica")
      // .fontSize(10)
      .text(`${capitalize(schedule)} (${timezone})`)
      .moveDown(1);
    let only_tables = true;
    Object.entries(meta_data).forEach(([key, value]) => {
      if (value.hasOwnProperty("tables")) {
        value.tables.forEach((table) => {
          const { headers, datas, options } = table;
          // console.log(pdfDoc.y, pdfDoc.height);
          if (pdfDoc.y > 600) {
            pdfDoc.addPage({
              margins: {
                top: 50,
                bottom: 50,
                left: 30,
                right: 30,
              },
              size: "A4",
            });
          }
          pdfDoc.table({ headers, datas }, options);
        });
        // pdfDoc.addPage();
      } else if (value.hasOwnProperty("title")) {
        only_tables = false;
        pdfDoc.fontSize(12);
        pdfDoc
          .fillColor("black")
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(`${value.title}: `, { continued: true })
          .font("Helvetica")
          // .fontSize(10)
          .text(value.description, { height: 12 });
        pdfDoc.moveDown(1);
        if (value.hasOwnProperty("list")) {
          // pdfDoc
          //   .font("Helvetica-Bold")
          //   .text(value.list.title, { height: 12 })
          //   .moveDown(0.5);
          pdfDoc.moveUp(0.5).font("Helvetica").list(value.list);
        }
      }
    });
    // pdfDoc.moveDown(2);
  },
};
