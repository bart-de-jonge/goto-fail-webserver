class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            timelines: Object,
            pickedTimelines: {
                type: Array,
                value: [],
            },
            hack: Object,
        };
    }

    computeChecked(index) {
        console.log(index)
        console.log(this.pickedTimelines);
        return this.pickedTimelines.indexOf(index) >= 0;
    }

    buttonClicked() {
        // const toggles = document.querySelectorAll("paper-toggle-button");
        // const checkedToggles = [];
        //
        // for (let i = 0; i < toggles.length; i++) {
        //     if (toggles[i].checked) {
        //         checkedToggles.push(toggles[i].value);
        //     }
        // }
        //
        // document.querySelector("#pickedTimelinesPost").body = { pickedTimelines: checkedToggles };
        // document.querySelector("#pickedTimelinesPost").generateRequest();
        console.log(this.pickedTimelines);
    }

    handleResponse(event) {
        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }

    // handlePickedTimelinesResponse(event) {
    //     if (event.detail.response.success) {
    //         window.location.href = "/timeline";
    //     }
    // }
}
// eslint-disable-next-line
Polymer(timelinePicker);

