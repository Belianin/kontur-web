const express = require("express");
const session = require('express-session');
const logic = require('./logic');

const app = express();
const expressWs = require('express-ws')(app);
const port = process.env.PORT || 5000;

// APP USE
app.use(express.static("static"));
app.use(express.json());
app.use(session({
    'secret': '1'
}));


// Logic

function setUserCookie(req, name) {
    req.session.name = name;
}



// Routing

/// HTTP
app.post("/join", (req, res) => {
    const data = req.body;
    const id = data.id;
    const name = data.name;
    // if (!logic.checkQuizExists(id) || !logic.checkQuizAcceptsUsers(id)) {
    //     res.sendStatus(404);
    //     return
    // }
    // logic.addUserToQuiz(id, name);
    // setUserCookie(req, name);
    res.redirect("/quiz.html");
});


/// Web-sockets
app.ws("/quiz", (ws, req) => {
    ws.on('message', (message) => {
        const type = JSON.parse(message).type;

        ws.send(type);
    });
});


app.get('*', (req, res) => {
    res.redirect('/')
});


// LISTEN
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});
