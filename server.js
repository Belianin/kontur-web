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
    req.session.id = id;
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
    // if (!logic.checkQuizExists(id) || !logic.checkQuizAcceptsUsers(id)) {
    //     res.sendStatus(404);
    //     return
    // }
    logic.addUserToQuiz(id, name);
    if (name === 'admin') {
        role = 'admin';
    }
    setUserCookie(req, name, role, id);
    res.redirect("/quiz.html");
});


app.post("/create", (req, res) => {
    const id = logic.createQuiz();
    setUserCookie(req, 'admin', 'admin', id);
    // res.redirect('/admin.html');
    res.send({id: id});
})


/// Web-sockets
app.ws("/quiz", (ws, req) => {
    const session = req.session;
    let data = "";
    ws.on('connection', () => {
        if (isOwner(session))
            data = logic.getQuizDataForOwner(session.id);
        else
            data = logic.getQuizDataForUser(session.id);
        
        ws.send(data);
    });

    ws.on('message', (message) => {
        if (isOwner(session)) {
            const type = JSON.parse(message).type;
            let data = "";
            if (type === 'next') {
                logic.nextQuestion(session.id);
                data = logic.getQuizDataForUser(session.id);
            } else if (type === 'end')
                data = logic.getResults(session.id);
            else
                data = logic.getUsers(session.id);
            ws.send(logic.getQuizDataForOwner(session.id));
            expressWs.getWss().clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN)
                    client.send(data);
            });
        } else {
            const answer = JSON.parse(message).answer;
            logic.saveAnswer(id, name, answer);
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
