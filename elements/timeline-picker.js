class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            timelines: Object,
        };
    }

    buttonClicked() {
        const toggles = document.querySelectorAll("paper-toggle-button");
        const checkedToggles = [];

        for (let i = 0; i < toggles.length; i++) {
            if (toggles[i].checked) {
                checkedToggles.push(toggles[i].value);
            }
        }

        // eslint-disable-next-line
        $.post("/timeline/picked-timelines", {"pickedTimelines": checkedToggles}, (data) => {
            if (data.success) {
                window.location.href = "/timeline";
            }
        });
    }

    handleResponse(event) {
        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);

