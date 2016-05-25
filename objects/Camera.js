import CameraType from "./CameraType.js";

/*
 * Class for storing a CameraTimeline
 */
class Camera {
    constructor(name, description, cameraType, movementMargin) {
        this.name = name;
        this.description = description;
        this.cameraType = cameraType;
        this.movementMargin = movementMargin;
    }

    static fromXML(XMLObject) {
        return new Camera(
            XMLObject.name[0],
            XMLObject.description[0],
            XMLObject.movementMargin[0],
            CameraType.fromXML(XMLObject.cameraType[0])
        );
    }
}

export default Camera;
