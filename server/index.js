const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*"}
});

const port = 8000;

app.use(express.static("app"));
app.use(express.static("css"));

let audioValue = "";

io.on('connection', (socket) => {
    io.emit('set', audioValue);

    socket.on('set', (newValue) => {
        audioValue = newValue;
        io.emit('set', newValue);
    });

    socket.on('state', (newValue) => {
        io.emit('state', newValue);
    });

    /// sound is the same as set but its doesnt stop the audio before playing a new one. 
    /// Is intended to be used when multiple audio's need to be played.
    socket.on('sound', (newValue) => {
        io.emit('sound', newValue);
    });
});

http.listen(port, () => {
    console.log(`listening on port ${port}, Do not close this window!`);
    console.log(`Visit http://localhost:${port} and click connect to recieve audio from games.`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
});

app.get('/setaudio', (req, res) => {
    io.emit('set', req.query.src);
    res.send("success");
});

app.get('/setsound', (req, res) => {
    io.emit('sound', req.query.src);
    res.send("success");
});

app.get('/setstate', (req, res) => {
    io.emit('state', req.query.state);
    res.send("success");
});