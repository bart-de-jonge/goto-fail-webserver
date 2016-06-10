class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            user: Object,
            timelines: Array,
        };
    }

    /**
     * Set the user on this timeline picker, update all data
     * @param user - the user to set
     */
    setUser(user) {
        this.user = user;

        const toggles = document.querySelectorAll("gotofail-togglebutton");
        for (let i = 0; i < toggles.length; i++) {
            if (user.jobType === 0) {
                toggles[i].checked = this.computeChecked(i);
            } else {
                toggles[i].checked = false;
            }
        }

        this.$.nameInput.value = user.name;
        document.querySelector("paper-tabs").select(this.user.jobType);
        this.paperTabsClicked();
    }

    /**
     * Check whether a toggle should be checked
     * @param index - the index of the toggle to check
     * @returns {boolean} - boolean indicating if it should be checked or not
     */
    computeChecked(index) {
        return this.user.pickedTimelines.indexOf(index) >= 0;
    }

    /**
     * Paper tabs clicked, recompute the toggles (disabled or not)
     */
    paperTabsClicked() {
        if (this.$.userTypeTabs.selected !== 0) {
            const toggles = document.querySelectorAll("#toggles gotofail-togglebutton");
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].disabled = true;
                toggles[i].checked = false;
            }
        } else {
            const toggles = document.querySelectorAll("#toggles gotofail-togglebutton");
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].disabled = false;
            }
        }
        document.querySelector("#gotofailLogin").changeUserJobType(
            this.user.id, this.$.userTypeTabs.selected);
    }

    /**
     * continue button clicked, push picked user to server
     */
    buttonClicked() {
        document.querySelector("#gotofailLogin").updateUsers();
        const user = document.querySelector("paper-item.iron-selected").user;
        document.querySelector("#pickedUserPost").body = { pickedUser: Number(user) };
        document.querySelector("#pickedUserPost").generateRequest();
    }

    /**
     * Helper method to handle response when picked user is posted
     */
    handlePickedUserResponse(event) {
        if (event.detail.response.success) {
            if (this.user.jobType === 0) {
                // camera operator
                window.location.href = "/timeline";
            } else if (this.user.jobType === 1) {
                // Shotcaller
                window.location.href = "/shot-caller";
            } else if (this.user.jobType === 2) {
                // Director
                window.location.href = "/director";
            } else {
                // TODO: maybe some error handling for other jobtypes
            }
        }
    }

    /**
     * Name input on the timeline picker changed
     */
    nameInputChanged(e) {
        this.user.name = e.target.value;
        document.querySelector("#gotofailLogin").changeUserName(this.user.id, this.user.name);
    }

    /**
     * Name input on the timeline picker lost focus
     * Store new user name
     */
    onNameInputBlur() {
        document.querySelector("#gotofailLogin").updateUsers();
    }

    /**
     * Enter pressed on the name input
     * Store new user name
     */
    onNameInputKeypress(e) {
        const code = e.keyCode;
        if (code === 13) {
            // enter pressed
            document.querySelector("#gotofailLogin").updateUsers();
        }
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);