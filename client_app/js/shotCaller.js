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

    socket.on("set_client_live", (data) => {
        if (data.live) {
            document.getElementsByTagName("live-widget")[0]
                .setAttribute("display-live", data.live);
        } else {
            document.getElementsByTagName("live-widget")[0]
                .removeAttribute("display-live");
        }
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

    document.addEventListener("resetCount", () => {
        socket.emit("reset_count", {});
        // After Reset Shots Must Be Updated
        socket.emit("get_current_shot", {});
        socket.emit("get_next_shot", {});
    });

    document.addEventListener("decreaseCount", () => {
        socket.emit("decrease_count", {});
    });
});
