const connect = () => {
    const url = `/quiz`;
    return new WebSocket(url);
};

const ws = connect();
ws.addEventListener("message", message => {
    const data = JSON.parse(message.data);
    const payload = data.payload;
    console.log(data);
    switch (data.type) {
        case 'next':
            
            break;
    }

});