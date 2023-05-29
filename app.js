const express = require("express")

const app = express();
app.use(express.static('static'));

console.log("start");

app.get('/', (req, res) => {
    res.sendFile('./templates/index.html', {root: __dirname});
});

app.post('/summary', (req, res) => {
    // request body is form data
    // request body should have attribute "text-input"
    res.json({
        summary: "summarised text here"
    });
})

const server = app.listen(3000);