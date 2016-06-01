class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            timelines: Object,
            pickedTimelines: {
                type: Array,
            },
        };
    }

    ready() {
        this.setPickedTimelines([]);
    }

    setPickedTimelines(pickedTimelines) {
        this.pickedTimelines = pickedTimelines;
        console.log(this.pickedTimelines); 
        const toggles = document.querySelectorAll("gotofail-togglebutton");

        for (let i = 0; i < toggles.length; i++) {
            toggles[i].checked = this.computeChecked(i);
        }
    }

    computeChecked(index) {
        return this.pickedTimelines.indexOf(index) >= 0;
    }

    buttonClicked() {
        console.log(this.pickedTimelines);
    }

    handleResponse(event) {
        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);