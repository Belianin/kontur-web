const QUIZ_STATE_CREATED = 0;
const QUIZ_STATE_STARTED = 1;
const QUIZ_STATE_FINISHED = 2;

class Quiz {
    constructor(title, options) {
        this.title = title;
        this.options = options;
        this.state = QUIZ_STATE_CREATED;
        this.users = [];
    }
}

const quizes = new Map();

function checkQuizExists(id) {
    return quizes.has(id);
}

function checkQuizAcceptsUsers(id) {
    return quizes.get(id).state === QUIZ_STATE_CREATED;
}

function addUserToQuiz(id, user) {
    quizes.get(id).users.push(user);
}

module.exports = {
    checkQuizExists,
    checkQuizAcceptsUsers,
    addUserToQuiz
};