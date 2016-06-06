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
            if (this.jobType === 0) {
                toggles[i].checked = this.computeChecked(i);
            } else {
                toggles[i].checked = false;
            }
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
        if (this.$.userTypeTabs.selected !== 0) {
            const toggles = document.querySelectorAll("#toggles gotofail-togglebutton");
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
        const id = document.querySelector("paper-item.iron-selected").id;
        document.querySelector("#pickedUserPost").body = { pickedUser: id };
        document.querySelector("#pickedUserPost").generateRequest();
    }

    handleResponse(event) {
        // Get data from ajax response
        this.timelines = event.detail.response.cameraTimelines;
    }

    /*
     * Helper method to handle response when picked user is posted
     */
    handlePickedUserResponse(event) {
        // TODO: redirect to right page for director and shotcallers
        
        if (event.detail.response.success) {
            window.location.href = "/timeline";
        }
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);