// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    // Socket io boilerplate/temporary code
    const socket = io(); // eslint-disable-line no-undef

    const header = document.getElementsByTagName("header")[0];
    const dialog = document.createElement("paper-dialog");
    dialog.id = "cur-count";
    dialog.innerHTML = "";
    header.appendChild(dialog);

    socket.on("next count", (countData) => {
        // TODO: Add Data Manipulation Here
        const newDialog = document.getElementById("cur-count");
        newDialog.innerHTML = `The Current Count is ${countData.newCount}`;
    });

    document.addEventListener("toggle-play", (event) => {
        if (event.detail) {
            socket.emit("start counting", {});
        } else {
            socket.emit("stop counting", {});
        }
    });
});
