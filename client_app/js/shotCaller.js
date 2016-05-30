// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/shotCallers"); // eslint-disable-line no-undef

    socket.on("next count", (countData) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("current-count", countData.newCount);
    });

    socket.on("current director shot", (data) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("current-shot", JSON.stringify(data.currentShot));
    });

    socket.on("next director shot", (data) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("next-shot", JSON.stringify(data.nextShot));
    });

    // Request Current & Previous Shots
    socket.emit("get current shot");
    socket.emit("get next shot");

    document.addEventListener("advanceCount", () => {
        socket.emit("advance count", {});
    });

    document.addEventListener("fetchNewShots", () => {
        socket.emit("get current shot", {});
        socket.emit("get next shot", {});
    });
});
