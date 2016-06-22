/*
 * Class for storing a CameraTimeline
 */
class CameraType {
    constructor(name, description, movementMargin) {
        this.name = name;
        this.description = description;
        this.movementMargin = movementMargin;
    }

    static fromXML(XMLObject) {
        return new CameraType(
            typeof XMLObject[0].name[0] !== "undefined" ? XMLObject[0].name[0] : "",
            typeof XMLObject[0].description[0] !== "undefined" ? XMLObject[0].description[0] : "",
            typeof XMLObject[0].movementMargin[0] !== "undefined"
                ? XMLObject[0].movementMargin[0] : 0
        );
    }

    toXML() {
        return [{
            description: [this.description],
            movementMargin: [this.movementMargin],
            name: [this.name],
        }];
    }
}

export default CameraType;
