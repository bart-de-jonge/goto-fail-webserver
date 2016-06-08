
/*
 * Class for storing a CameraOperator
 */
class User {
    constructor(id, name, pickedTimelines, jobType) {
        this.id = id;
        this.name = name;
        this.pickedTimelines = pickedTimelines;
        this.jobType = jobType;
    }

    static fromXML(XMLObject, id) {
        const pickedTimelines = [];
        XMLObject.chosenTimelines[0].chosenTimeline.forEach((numberString) => {
            pickedTimelines.push(Number(numberString));
        });

        return new User(id, XMLObject.name[0], pickedTimelines, Number(XMLObject.roleValue[0]));
    }

    toXML() {
        const chosenTimelines = [];
        this.pickedTimelines.forEach((pickedTimeline) => {
           chosenTimelines.push(String(pickedTimeline));
        });

        return {
            name: [this.name],
            roleValue: [String(this.jobType)],
            chosenTimelines: [{chosenTimeline: chosenTimelines}],
        };
    }
}

export default User;
