class timelinePicker {
    beforeRegister() {
        this.is = "timeline-picker";

        this.properties = {
            user: Object,
            timelines: Array,
        };
    }

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

    computeChecked(index) {
        return this.user.pickedTimelines.indexOf(index) >= 0;
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
        document.querySelector("#gotofailLogin").updateUsers();
    }

    buttonClicked() {
        document.querySelector("#gotofailLogin").updateUsers();
        const user = document.querySelector("paper-item.iron-selected").user;
        document.querySelector("#pickedUserPost").body = { pickedUser: Number(user) };
        document.querySelector("#pickedUserPost").generateRequest();
    }

    /*
     * Helper method to handle response when picked user is posted
     */
    handlePickedUserResponse(event) {
        // TODO: redirect to right page for director and shotcallers
        
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

    nameInputChanged(e) {
        this.user.name = e.target.value;
        document.querySelector("#gotofailLogin").changeUserName(this.user.id, this.user.name);
    }

    onNameInputBlur() {
        document.querySelector("#gotofailLogin").updateUsers();
    }

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