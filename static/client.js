console.log('123');

const connect = () => {
    const url = `${location.origin.replace(/^http/, "ws")}/quiz`;
    console.log(url);
    return new WebSocket(url);
};

function next(task) {
    console.log('next', task);
    document.querySelector('.waiting').style.display = 'none';
    document.querySelector('.task').style.display = 'flex';
    document.querySelector('#question').innerText = task.title;
    const answers = document.querySelector('#answers');
    answers.innerHTML = '';
    for (const [i, answer] of task.options.entries()) {
        console.log(answer);
        const li = document.createElement('li');
        li.className = 'answer';
        const label = document.createElement('label');
        const span = document.createElement('span');
        span.innerText = answer;
        span.className = 'answer-text';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = `${i}`;
        label.append(input, span);
        li.append(label);
        answers.append(li);
    }
}

const ws = connect();
ws.addEventListener("message", message => {
    const data = JSON.parse(message.data);
    const payload = data.payload;
    console.log(message);
    console.log(data);
    switch (data.type) {
        case 'next':
            next(payload.question);
            break;
        case 'end':
            document.querySelector('task').innerHTML = '<h1>Готово!</h1>'
            break;
    }
});

document.querySelector('.task').addEventListener('submit', e => {
    e.preventDefault();
    ws.send(JSON.stringify({
        answer: +document.querySelector('input[type="radio"]:checked').value
    }))
});

// setTimeout(() => next({
//     title: 'Question',
//     options: [
//         "green dog",
//         "hammer",
//         "cold coffee",
//         "natural selection"
//     ]
// }), 1000);