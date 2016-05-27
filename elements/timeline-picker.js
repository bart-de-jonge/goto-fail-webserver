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

        document.querySelector("#pickedTimelinesPost").body = { pickedTimelines: checkedToggles };
        document.querySelector("#pickedTimelinesPost").generateRequest();
    }

    handleResponse(event) {
        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }

    handlePickedTimelinesResponse(event) {
        if (event.detail.response.success) {
            window.location.href = "/timeline";
        }
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);

