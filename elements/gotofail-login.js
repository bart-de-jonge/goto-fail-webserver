class timelinePicker {
    beforeRegister() {
        this.is = "gotofail-login";

        this.properties = {
            users: Object
        };
    }
    onListItemTab(e) {
        console.log(e.target.id);
        document.querySelector("#pickedUserPost").body = { pickedUser: e.target.id };
        document.querySelector("#pickedUserPost").generateRequest();
    }
    handlePickedTimelinesResponse(event) {
        if (event.detail.response.success) {
            window.location.href = "/timeline";
        }
    }
}
// eslint-disable-next-line
Polymer(timelinePicker);

