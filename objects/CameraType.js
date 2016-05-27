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
            XMLObject.name[0],
            XMLObject.description[0],
            XMLObject.movementMargin[0]
        );
    }
}

export default CameraType;
