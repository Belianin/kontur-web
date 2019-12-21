const express = require("express");
const session = require('express-session');
const logic = require('./logic');

const app = express();
const expressWs = require('express-ws')(app);
const port = process.env.PORT || 5000;

// APP USE
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    'secret': '1'
}));


// Logic

function setUserCookie(req, name, role, id) {
    req.session.name = name;
    req.session.role = role;
    req.session.key = id;
    console.log("id", id);
    console.log("actual", req.session.key);
}

function isOwner(session) {
    return session.role === "admin";
}


// Routing

/// HTTP
app.post("/join", (req, res) => {
    const data = req.body;
    console.log(data);
    let id = parseInt(data.id);
    console.log(id);
    const name = data.name;
    let role = "user";
    if (!logic.checkQuizExists(id)) {
        res.sendStatus(404);
        return
    }
    logic.addUserToQuiz(id, name);
    setUserCookie(req, name, role, id);
    res.redirect("/quiz.html");
});


app.post("/create", (req, res) => {
    const id = logic.createQuiz();
    setUserCookie(req, 'admin', 'admin', id);
    res.redirect('/admin.html');
})


/// Web-sockets
app.ws("/quiz", (ws, req) => {
    const session = req.session;
    let data = "";
    ws.on('connection', () => {
        if (isOwner(session))
            data = logic.getQuizDataForUser(session.key); // for Owner
        else
            data = logic.getQuizDataForUser(session.key);
        
        ws.send(JSON.stringify(data));
    });

    ws.on('message', (message) => {
        if (isOwner(session)) {
            let type = JSON.parse(message).type;
            if (!logic.hasRemainingQuestions(session.key))
                type = "end";
            let data = "";
            let mes = "";
            if (type === 'next') {
                logic.nextQuestion(session.key);
                data = logic.getQuizDataForUser(session.key);
                mes = {type: "next", payload: data};
                type = "next";
            } else if (type === 'end') {
                data = logic.getResults(session.key);
                mes = {type: "end", payload: data};
                type = "end";
            } else {
                data = logic.getUsers(session.key);
                mes = {type: "start", payload: data};
                type = 'start';
            }

            ws.send(JSON.stringify({type: type, payload: logic.getQuizDataForOwner(session.key)})); // for Owner
            expressWs.getWss().clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN)
                    client.send(JSON.stringify(mes));
            });
        } else {
            const answer = JSON.parse(message).answer;
            logic.saveAnswer(session.key, session.name, +answer);
        }
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
