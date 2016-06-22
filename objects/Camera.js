import CameraType from "./CameraType.js";

/*
 * Class for storing a CameraTimeline
 */
class Camera {
    constructor(name, description, cameraType, movementMargin, id, ip, remoteCameraId) {
        this.name = name;
        this.description = description;
        this.cameraType = cameraType;
        this.movementMargin = movementMargin;
        this.id = id;
        this.ip = ip;
        this.remoteCameraId = remoteCameraId;
    }

    static fromXML(XMLObject) {
        return new Camera(
            typeof XMLObject[0].name[0] !== "undefined" ? XMLObject[0].name[0] : "",
            typeof XMLObject[0].description[0] !== "undefined" ? XMLObject[0].description[0] : "",
            typeof XMLObject[0].cameraType !== "undefined"
                ? CameraType.fromXML(XMLObject[0].cameraType) : new CameraType("", "", 0),
            typeof XMLObject[0].movementMargin[0] !== "undefined"
                ? XMLObject[0].movementMargin[0] : -1,
            typeof XMLObject[0].instance[0] !== "undefined" ? XMLObject[0].instance[0] : -1,
            typeof XMLObject[0].ip[0] !== "undefined" ? XMLObject[0].ip[0] : "",
            typeof XMLObject[0].remoteCameraId[0] !== "undefined"
                ? XMLObject[0].remoteCameraId[0] : -1
        );
    }

    toXML() {
        return [{
            cameraType: this.cameraType.toXML(),
            description: [this.description],
            instance: [this.id],
            movementMargin: [this.movementMargin],
            name: [this.name],
            ip: [this.ip],
            remoteCameraId: [this.remoteCameraId],
        }];
    }
}

export default Camera;
