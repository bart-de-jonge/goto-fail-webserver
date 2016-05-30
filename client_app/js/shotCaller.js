// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/shotCallers"); // eslint-disable-line no-undef

    socket.on("next_count", (countData) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("current-count", countData.newCount);
    });

    socket.on("current_director_shot", (data) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("current-shot", JSON.stringify(data.currentShot));
    });

    socket.on("next_director_shot", (data) => {
        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("next-shot", JSON.stringify(data.nextShot));
    });

    // Request Current & Previous Shots
    socket.emit("get_current_shot");
    socket.emit("get_next_shot");

    document.addEventListener("advanceCount", () => {
        socket.emit("advance_count", {});
    });

    document.addEventListener("fetchNewShots", () => {
        socket.emit("get_current_shot", {});
        socket.emit("get_next_shot", {});
    });
});
