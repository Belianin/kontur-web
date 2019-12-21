const express = require("express");
const expressWs = require('express-ws')(app);
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// APP USE
app.use(express.static("static"));
app.use(express.json());
app.use(express.cookieDecoder());
app.use(session({
    'secret': '1'
}));


// Logic

function checkQuizById(id) {
    return true;
}

function addUserToQuiz(id, name, cookie) {

}

function setUserCookie(req, name) {

}



// Routing

/// HTTP
app.post("/join", (req, res) => {
    const data = req.body;
    const id = data.id;
    const name = data.name;
    if (!checkQuizById(id)) {
        res.sendStatus(404);
        return
    }
    addUserToQuiz(id, name, req.session.cookie);
    setUserCookie(req, name);
    res.redirect("/test");
});


/// Web-sockets
app.ws("/quiz", (ws, req) => {
    ws.on('message', (message) => {
        const type = JSON.parse(message).type;

        // ws.

    }); 
});



// LISTEN
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});