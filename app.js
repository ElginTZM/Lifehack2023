var express = require("express");
var PDFParser = import("pdf2json");
var textract = require("textract");
var summarize = require("text-summarization");

const app = express();
app.use(express.static('static'));

const multer = require('multer');
const upload = multer();

app.get("/", (req, res) => {
  res.sendFile("./templates/index.html", { root: __dirname });
});

app.post('/summary', upload.none(), (req, res) => {
  const text = req.body['text-input'];
  summarize({ text }).then((summary) => {
    var result = "";
    for (let i = 0; i < summary.extractive.length; i++) {
      result += summary.extractive[i] + " ";
    }
    res.json({summary: JSON.stringify(result, null, 2)});
  });
});

Promise.all([PDFParser]).then(([PDFParser]) => {
  app.post("/file_summary", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }

    var file = req.file;
    if (file.mimetype === "application/pdf") {
      var regex = /(----------------Page \(\w\) Break----------------)/g;

      const pdfParser = new PDFParser.default(this, 1);
      pdfParser.on("pdfParser_dataError", (errData) =>
        console.error(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfParser.getRawTextContent().replace(regex, "");
        summarize({ text }).then((summary) => {
          var result = "";
          for (let i = 0; i < summary.extractive.length; i++) {
            result += summary.extractive[i] + " ";
          }
          res.json({
            'input-text': text,
            summary: JSON.stringify(result, null, 2)
          });
        });
      });

      pdfParser.parseBuffer(file.buffer);
    } else {
      textract.fromBufferWithMime(
        file.mimetype,
        file.buffer,
        function (error, text) {
          if (error) {
            res.json({
              'input-text': text,
              summary: "Error processing file."
            });
          } else {
            summarize({ text }).then((summary) => {
              let result = "";
              for (let i = 0; i < summary.extractive.length; i++) {
                result += summary.extractive[i] + " ";
              }
              res.json({
                'input-text': text,
                summary: JSON.stringify(result, null, 2)
              });
            });
          }
        }
      );
    }
  });
});

// module.exports = app;
app.listen(3000);
