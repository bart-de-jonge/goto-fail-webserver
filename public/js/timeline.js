"use strict";

// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", function () {
    var socket = io("/cameraOperators"); // eslint-disable-line no-undef

    var header = document.getElementsByTagName("header")[0];
    var dialog = document.createElement("paper-dialog");
    dialog.id = "cur-count";
    dialog.innerHTML = "";
    header.appendChild(dialog);

    socket.on("next_count", function (countData) {
        // TODO: Add Data Manipulation Here
        var newDialog = document.getElementById("cur-count");
        newDialog.innerHTML = "The Current Count is " + countData.newCount;

        document.getElementsByTagName("timeline-grid")[0].setAttribute("current-count", countData.newCount);
    });

    document.addEventListener("advanceCount", function () {
        socket.emit("advance_count", {});
    });
});