const fs = require('fs');
const defaultQuestion = JSON.parse(fs.readFileSync('default_quiz.json'));

const QUIZ_STATE_CREATED = 0;
const QUIZ_STATE_STARTED = 1;
const QUIZ_STATE_FINISHED = 2;

class Quiz {
    constructor(title, questions) {
        this.title = title;
        this.questions = questions;
        this.state = QUIZ_STATE_CREATED;
        this.users = [];
        this.answers = [];
        this.currentQuestion = 0;
    }
}

const quizes = new Map();

function createQuiz() {
    const id = quizes.size + 1;
    quizes.set(id, defaultQuestion);
    return id;
}

function checkQuizExists(id) {
    return quizes.has(id);
}

function checkQuizAcceptsUsers(id) {
    return quizes.get(id).state === QUIZ_STATE_CREATED;
}

function addUserToQuiz(id, user) {
    quizes.get(id).users.push(user);
}

function getUsers(id) {
    return quizes.get(id).users;
}

function nextQuestion(id) {
    const quiz = quizes.get(id);
    if (quiz.state === QUIZ_STATE_CREATED) {
        quiz.currentQuestion++;
        quiz.answers.push(new Map());
        quiz.state = QUIZ_STATE_STARTED;
    } else if (quiz.state === QUIZ_STATE_STARTED) {
        quiz.currentQuestion++;
        quiz.answers.push(new Map());
        if (quiz.currentQuestion === quiz.questions.length)
            quiz.state = QUIZ_STATE_FINISHED;
    }
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

function saveAnswer(id, user, answer) {
    const quiz = quizes.get(id);
    const correct = quiz.questions[quiz.currentQuestion].options[answer].correct;
    quiz.answers[quiz.currentQuestion].set(user, {answer, correct});
}

function getResults(id) {
    return quizes.get(id);
}

module.exports = {
    checkQuizExists,
    checkQuizAcceptsUsers,
    createQuiz,
    addUserToQuiz,
    nextQuestion,
    getUsers,
    getQuizDataForUser,
    saveAnswer,
    getResults
};