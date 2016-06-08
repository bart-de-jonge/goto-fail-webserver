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
            XMLObject[0].name[0],
            XMLObject[0].description[0],
            CameraType.fromXML(XMLObject[0].cameraType[0]),
            XMLObject[0].movementMargin[0]
        );
    }
}

export default Camera;
