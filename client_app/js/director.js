// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/director"); // eslint-disable-line no-undef

    socket.on("next_count", (countData) => {
        document.getElementsByTagName("director-view")[0]
            .setAttribute("current-count", countData.newCount);
    });
});
