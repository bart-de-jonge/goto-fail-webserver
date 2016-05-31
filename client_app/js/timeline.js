// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/cameraOperators"); // eslint-disable-line no-undef

    const header = document.getElementsByTagName("header")[0];
    const dialog = document.createElement("paper-dialog");
    dialog.id = "cur-count";
    dialog.innerHTML = "";
    header.appendChild(dialog);

    socket.on("next_count", (countData) => {
        // TODO: Add Data Manipulation Here
        const newDialog = document.getElementById("cur-count");
        newDialog.innerHTML = `The Current Count is ${countData.newCount}`;

        document.getElementsByTagName("timeline-grid")[0]
            .setAttribute("current-count", countData.newCount);
    });

    document.addEventListener("advanceCount", () => {
        socket.emit("advance_count", {});
    });
});
