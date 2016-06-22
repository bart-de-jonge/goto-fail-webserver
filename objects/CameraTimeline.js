import Camera from "./Camera";
import CameraShot from "../objects/CameraShot";
import CameraType from "./CameraType";

/*
 * Class for storing a CameraTimeline
 */
class CameraTimeline {
    constructor(name, description, camera, instance) {
        this.name = name;
        this.description = description;
        this.cameraShots = [];
        this.camera = camera;
        this.instance = instance;
    }

    // Add a camerashot to this timeline
    addCameraShot(cameraShot) {
        this.cameraShots.push(cameraShot);
    }

    // Get the list of cameraShots
    getCameraShots() {
        return this.cameraShots;
    }

    static fromXML(XMLObject) {
        // Get camera
        const camera = XMLObject.camera ? Camera.fromXML(XMLObject.camera) : new Camera("", "", new CameraType("", "", -1), -1, -1, "", -1);

        // Make cameraTimeline
        const cameraTimeline = new CameraTimeline(
            camera.name, camera.description, camera, XMLObject.instance[0] ? XMLObject.instance[0] : -1);

        // Parse and add shots
        if (typeof XMLObject.shotList[0].shot !== "undefined") {
            XMLObject.shotList[0].shot.forEach(shot => {
                cameraTimeline.addCameraShot(CameraShot.fromXML(shot));
            });
        }
        return cameraTimeline;
    }

    toXML() {
        const shotList = [{ shot: [] }];
        this.cameraShots.forEach((shot) => {
            shotList[0].shot.push(shot.toXML());
        });

        return {
            camera: this.camera.toXML(),
            shotList,
            instance: [this.instance],
        };
    }
}

export default CameraTimeline;
