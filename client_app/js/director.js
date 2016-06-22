// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", () => {
    const socket = io("/director"); // eslint-disable-line no-undef

    socket.on("next_count", (countData) => {
        document.getElementsByTagName("director-element")[0]
            .setAttribute("current-count", countData.newCount);
    });

    document.addEventListener("toggleLive", (event) => {
        socket.emit("set_server_live", {
            live: event.detail.live,
        });
    });

    socket.on("set_client_live", (data) => {
        if (data.live) {
            document.getElementsByTagName("director-view")[0]
                .setAttribute("is-live", data.live);
        } else {
            document.getElementsByTagName("director-view")[0]
                .removeAttribute("is-live");
        }
    });
});
