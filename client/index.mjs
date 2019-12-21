document.querySelector("#start").addEventListener("submit", e => {
    e.preventDefault();
    main();
});

const main = () => {
    const ws = connect();
    ws.addEventListener("message", console.log);
};

const connect = () => {
    const url = `${location.origin.replace(/^http/, "ws")}`;
    return new WebSocket(url);
};
