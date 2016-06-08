import Camera from "./Camera";
import CameraShot from "../objects/CameraShot";

/*
 * Class for storing a CameraTimeline
 */
class CameraTimeline {
    constructor(name, description, camera) {
        this.name = name;
        this.description = description;
        this.cameraShots = [];
        this.camera = camera;
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
        const camera = Camera.fromXML(XMLObject.camera);

        // Make cameraTimeline
        const cameraTimeline = new CameraTimeline(
            camera.name, camera.description, camera);

        // Parse and add shots
        if (typeof XMLObject.shotList[0].shot !== "undefined") {
            XMLObject.shotList[0].shot.forEach(shot => {
                cameraTimeline.addCameraShot(CameraShot.fromXML(shot));
            });
        }
        
        return cameraTimeline;
    }
}

export default CameraTimeline;
