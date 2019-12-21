const fs = require('fs');

const QUIZ_STATE_CREATED = 0;
const QUIZ_STATE_STARTED = 1;
const QUIZ_STATE_FINISHED = 2;

class Quiz {
    constructor(title, questions) {
        this.title = title;
        this.questions = questions;
        this.state = QUIZ_STATE_CREATED;
        this.users = [];
        this.currentQuestion = 0;
    }
}

const quizes = new Map();
quizes.set(1, JSON.parse(fs.readFileSync('default_quiz.json')));

function checkQuizExists(id) {
    return quizes.has(id);
}

function checkQuizAcceptsUsers(id) {
    return quizes.get(id).state === QUIZ_STATE_CREATED;
}

function addUserToQuiz(id, user) {
    quizes.get(id).users.push(user);
}

function getQuizDataForUser(id) {
    const quiz = quizes.get(id);
    const question = quiz.questions[quiz.currentQuestion];
    return {
        number: quiz.currentQuestion,
        total: quiz.questions.length,
        question: {
            text: question.text,
            options: question.options.map(option => option.text)
        }
    };
}

module.exports = {
    checkQuizExists,
    checkQuizAcceptsUsers,
    addUserToQuiz,
    getQuizDataForUser
};