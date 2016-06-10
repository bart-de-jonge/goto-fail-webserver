/*
 * Class for storing a Preset
 */
class Preset {
    constructor(id, name, description, thumbnailRoute, cameraId) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.thumbnailRoute = thumbnailRoute;
        this.cameraId = cameraId;
    }
}

export default Preset;
