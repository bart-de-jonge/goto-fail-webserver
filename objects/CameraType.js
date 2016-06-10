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
            XMLObject[0].name[0],
            XMLObject[0].description[0],
            XMLObject[0].movementMargin[0]
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
