import CameraType from "./CameraType.js";

/*
 * Class for storing a CameraTimeline
 */
class Camera {
    constructor(id, name, description, cameraType, movementMargin, ip) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cameraType = cameraType;
        this.movementMargin = movementMargin;
        this.ip = ip;
    }

    static fromXML(XMLObject) {
        return new Camera(
            XMLObject.instance[0],
            XMLObject.name[0],
            XMLObject.description[0],
            CameraType.fromXML(XMLObject.cameraType[0]),
            XMLObject.movementMargin[0],
            ""
        );
    }
}

export default Camera;
