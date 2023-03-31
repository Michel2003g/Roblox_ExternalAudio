const socket = io("ws://localhost:8000");

const user_info = document.querySelector("#user_info")
const connectionButton = document.querySelector("#connect")
const connection_label = document.querySelector("#connection_label")

let isConnected = false;

let audio = null;

function playAudio(url) {
    if (audio !== null) {
        audio.pause();
        user_info.textContent = "Audio Removed, Waiting For New Audio To Play"
    }
    audio = new Audio(url);
    audio.play();
    user_info.textContent = "Audio Playing"
}

function playSound(url) {
    const sound = new Audio(url);
    sound.play();
}

connectionButton.addEventListener("click", () => {

    if (isConnected) {return;}

    isConnected = true;

    user_info.textContent = "No Audio Received Yet."
    connectionButton.textContent = "Connected"
    connection_label.textContent = "You're connected to the server and can receive audio."

    socket.on("set", value => {
        playAudio(value);
    });

    socket.on("state", value => {
        if (audio === null) { return; }
        if (value === "pause") {
            audio.pause();
            user_info.textContent = "Paused"
        } else if (value === "resume") {
            audio.resume();
            user_info.textContent = "Audio Playing"
        }
    });

    socket.on('sound', value => {
        playSound(value);
    })
});

