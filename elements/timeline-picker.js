class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            timelines: Object,
        };
    }

    buttonClicked() {
        console.log("button clicked");
        const toggles = document.querySelectorAll("paper-toggle-button");
        let checkedToggles = [];

        for (let i = 0; i < toggles.length; i++) {
            if (toggles[i].checked) {
                checkedToggles.push(toggles[i]);
                console.log(toggles[i].value);
            }
        }

        console.log(checkedToggles);
    }

    handleResponse(event) {
        // Setup lists for timelines
        // TODO: find a way to correctly execute this in timeline-element

        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);

