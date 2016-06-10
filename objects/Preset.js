/*
 * Class for storing a Preset
 */
class Preset {
    constructor(id, name, description, thumbnailRoute) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.thumbnailRoute = thumbnailRoute;
    }
}

export default Preset;
