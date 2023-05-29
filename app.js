const express = require("express")

const app = express();

console.log("start");

app.get('/', (req, res) => {
    res.sendFile('./templates/home.html', {root: __dirname});
});

const server = app.listen(3000);