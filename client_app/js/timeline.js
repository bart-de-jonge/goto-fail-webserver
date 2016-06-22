// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/cameraOperators"); // eslint-disable-line no-undef

    socket.on("next_count", (countData) => {
        // TODO: Add Data Manipulation Here

        document.getElementsByTagName("timeline-grid")[0]
            .setAttribute("current-count", countData.newCount);
    });

    document.addEventListener("advanceCount", () => {
        socket.emit("advance_count", {});
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
});
