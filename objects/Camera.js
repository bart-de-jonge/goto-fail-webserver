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
}

export default Camera;
