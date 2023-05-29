var express = require('express');
var fileUpload = require("express-fileupload")
var PDFParser = import("pdf2json");

var app = express();
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile('./templates/index.html', {root: __dirname});
});

Promise.all([PDFParser]).then(([PDFParser]) => {
  app.post('/parsePDF', (req, res) => {
      if (!req.files) {
          return res.status(400).send('No files were uploaded.');
      }

      let file = req.files.uploadFile;
      let regex = /(----------------Page \(\w\) Break----------------)/g;

      const pdfParser = new PDFParser.default(this, 1);
      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
          res.send(pdfParser.getRawTextContent().replace(regex, ""));
      });
  
      pdfParser.parseBuffer(file.data);
  });
});

module.exports = app;