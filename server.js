const express = require("express");
const expressWs = require('express-ws')(app);

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static("static"));
app.use(express.json());





app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});