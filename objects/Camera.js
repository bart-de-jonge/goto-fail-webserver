import CameraType from "./CameraType.js";

/*
 * Class for storing a CameraTimeline
 */
class Camera {
    constructor(name, description, cameraType, movementMargin, instance) {
        this.name = name;
        this.description = description;
        this.cameraType = cameraType;
        this.movementMargin = movementMargin;
        this.instance = instance;
    }



    static fromXML(XMLObject) {
        return new Camera(
            XMLObject[0].name[0],
            XMLObject[0].description[0],
            CameraType.fromXML(XMLObject[0].cameraType),
            XMLObject[0].movementMargin[0],
            XMLObject[0].instance[0]
        );
    }

    toXML() {
        return [{
            cameraType: this.cameraType.toXML(),
            description: [this.description],
            instance: [this.instance],
            movementMargin: [this.movementMargin],
            name: [this.name],
        }];
    }
}

export default Camera;
