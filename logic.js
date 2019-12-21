const fs = require('fs');
const loadedQuiz = JSON.parse(fs.readFileSync('default_quiz.json'));

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
        this.currentQuestion = -1;
    }
}

const defaultQuiz = new Quiz(loadedQuiz.title, loadedQuiz.questions);
const quizes = new Map();

function createQuiz() {
    const id = quizes.size + 1;
    quizes.set(id, defaultQuiz);
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
        if (quiz.currentQuestion === quiz.questions.length)
            quiz.state = QUIZ_STATE_FINISHED;
        else
            quiz.answers.push(new Map());
    }
}

function getQuizDataForUser(id) {
    const quiz = quizes.get(id);
    const question = quiz.questions[quiz.currentQuestion];
    return {
        number: quiz.currentQuestion,
        total: quiz.questions.length,
        question: {
            title: question.title,
            options: question.options.map(option => option.text)
        }
    };
}

function isQuizFinished(id) {
    const quiz = quizes.get(id);
    return quiz.state === QUIZ_STATE_FINISHED;
}

function getQuizDataForOwner(id) {
    const quiz = quizes.get(id);
    return {
        id,
        number: quiz.currentQuestion,
        total: quiz.questions.length,
        answered: quiz.answers[quiz.currentQuestion]
    }
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
    isQuizFinished,
    createQuiz,
    addUserToQuiz,
    nextQuestion,
    getUsers,
    getQuizDataForUser,
    getQuizDataForOwner,
    saveAnswer,
    getResults,
    hasRemainingQuestions
};