/*
 * Class for storing a Preset
 */
class Preset {
    constructor(id, name, thumbnailRoute, cameraId) {
        this.name = name;
        this.id = id;
        this.thumbnailRoute = thumbnailRoute;
        this.cameraId = cameraId;
    }
}

export default Preset;
