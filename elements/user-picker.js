class userPicker {
    beforeRegister() {
        this.is = "user-picker";

        this.properties = {
            timelines: Object,
        };
    }

    buttonClicked() {
    }

    handleResponse(event) {
        // Setup lists for timelines
        // TODO: find a way to correctly execute this in timeline-element

        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }
}
// eslint-disable-next-line
Polymer(userPicker);

