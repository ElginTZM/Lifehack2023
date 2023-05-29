var express = require("express");
var fileUpload = require("express-fileupload");
var PDFParser = import("pdf2json");
var textract = require("textract");
var summarize = require("text-summarization");
var SummarizerManager = require("node-summarizer").SummarizerManager;

var app = express();
app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile("./templates/index.html", { root: __dirname });
});

Promise.all([PDFParser]).then(([PDFParser]) => {
  app.post("/parsePDF", (req, res) => {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    var file = req.files.uploadFile;
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
          res.send(JSON.stringify(result, null, 2));
        });
        /* 
        let Summarizer = new SummarizerManager(text, 5); 
        let summary = Summarizer.getSummaryByRank().then((summaryObject) => {
          res.send(JSON.stringify(summaryObject.summary, null, 2));
        });
        */
      });

      pdfParser.parseBuffer(file.data);
    } else {
      textract.fromBufferWithMime(
        file.mimetype,
        file.data,
        function (error, text) {
          if (error) {
            res.send("Error processing file.");
          } else {
            summarize({ text }).then((summary) => {
              let result = "";
              for (let i = 0; i < summary.extractive.length; i++) {
                result += summary.extractive[i] + " ";
              }
              res.send(JSON.stringify(result, null, 2));
            });
            /*
            let Summarizer = new SummarizerManager(filteredText, 5); 
            let summary = Summarizer.getSummaryByRank().then((summaryObject) => {
              res.send(JSON.stringify(summaryObject.summary, null, 2));
            });
            */
          }
        }
      );
    }
  });
});

module.exports = app;
