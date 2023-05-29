const express = require("express")
const fileUpload = require("express-fileupload")
const PDFParser = import("pdf2json")

const app = express();
app.use(fileUpload());

Promise.all([PDFParser]).then(([PDFParser]) => {
    app.post('/parsePDF', (req, res) => {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        let file = req.files.uploadFile;
        let uploadPath = __dirname + '/uploads/' + file.name;
        let regex = /(----------------Page \(\w\) Break----------------)/g;

        const pdfParser = new PDFParser.default(this, 1);
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            res.send(pdfParser.getRawTextContent().replace(regex, ""));
        });
    
        pdfParser.parseBuffer(file.data);
    });
});

app.get('/', (req, res) => {
    res.sendFile('./templates/index.html', {root: __dirname});
});

const server = app.listen(3000);