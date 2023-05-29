var express = require("express");
var fileUpload = require("express-fileupload");
var PDFParser = import("pdf2json");
var textract = require("textract");

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


    function generateSummary(text) {
      const { spawn } = require('child_process');
      var summarizer = spawn("python", ["./test.py", "TEST"]);
  
      summarizer.stdout.on("data", (data) => {
          // console.log(`stdout: ${data}`);
          res.write(data.toString());
          res.end('');
      })
  }
  

    let file = req.files.uploadFile;
    console.log(file.mimetype);
    if (file.mimetype === "application/pdf") {
      let regex = /(----------------Page \(\w\) Break----------------)/g;

      const pdfParser = new PDFParser.default(this, 1);
      pdfParser.on("pdfParser_dataError", (errData) =>
        console.error(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        generateSummary(pdfParser.getRawTextContent().replace(regex, ""));
      });

      pdfParser.parseBuffer(file.data);
    } else {
      textract.fromBufferWithMime(
        file.mimetype,
        file.data,
        function (error, text) {
          if (error) {
            res.send(error);
          } else {
            generateSummary(text);
          }
        }
      );
    }
  });
});

module.exports = app;