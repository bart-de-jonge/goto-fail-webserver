// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    // Socket io boilerplate/temporary code
    const socket = io(); // eslint-disable-line no-undef

    socket.on("next count", (countData) => {
        const header = document.getElementsByTagName("header")[0];
        const dialog = document.createElement("paper-dialog");
        dialog.innerHTML = `The Incoming Count is: ${countData.newCount}`;
        header.appendChild(dialog);
        // TODO: Add Data Manipulation Here
    });
});
