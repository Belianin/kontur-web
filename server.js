const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static("static"));

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});