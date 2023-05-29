var express = require('express');
var fileUpload = require("express-fileupload")
var PDFParser = import("pdf2json");

var app = express();
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile('./templates/index.html', {root: __dirname});
});

// app.get("/summary", printhello);

// function printhello() {
//     const { spawn } = require('child_process');
//     var summarizer = spawn("py", ["--version"]);

//     summarizer.stdout.on("data", (data) => {
//         console.log(`stdout: ${data}`);
//     })

//     summarizer.stderr.on("data", (data) => {
//         console.log(`stderr: ${data}`);
//     })

//     summarizer.on("close", (code) => {
//         console.log(`child process exited with code ${code}`);
//     })
// }

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

const port = 3000;
app.listen(port, () => console.log("Listening for requests on port 3000"));