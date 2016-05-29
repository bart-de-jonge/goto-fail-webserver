// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/cameraOperators"); // eslint-disable-line no-undef

    socket.on("next count", (countData) => {
        // TODO: Add Data Manipulation Here

        document.getElementsByTagName("shot-caller-display")[0]
            .setAttribute("current-count", countData.newCount);
    });

    document.addEventListener("advanceCount", () => {
        socket.emit("advance count", {});
    });
});
