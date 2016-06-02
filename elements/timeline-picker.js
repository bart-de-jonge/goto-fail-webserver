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

    setUser(user) {
        this.pickedTimelines = user.pickedTimelines;
        this.jobType = user.jobType;

        const toggles = document.querySelectorAll("gotofail-togglebutton");
        for (let i = 0; i < toggles.length; i++) {
            toggles[i].checked = this.computeChecked(i);
        }

        document.querySelector("paper-tabs").select(this.jobType);

        this.paperTabsClicked();
    }

    setPickedTimelines(pickedTimelines) {
        this.pickedTimelines = pickedTimelines;
    }

    computeChecked(index) {
        return this.pickedTimelines.indexOf(index) >= 0;
    }

    paperTabsClicked() {
        console.log(this.$.userTypeTabs.selected);
        if (this.$.userTypeTabs.selected !== 0) {
            const toggles = document.querySelectorAll("#toggles gotofail-togglebutton");
            console.log(toggles);
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].disabled = true;
            }
        } else {
            const toggles = document.querySelectorAll("#toggles gotofail-togglebutton");
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].disabled = false;
            }
        }
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