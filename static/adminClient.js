const connect = () => {
    const url = `${location.origin.replace(/^http/, "ws")}/quiz`;
    console.log(url);
    return new WebSocket(url);
};

const ws = connect();

document.querySelector('#start')
    .addEventListener('click', () => {
        console.log('start');
        ws.send(JSON.stringify({
            type: "next"
        }));
});