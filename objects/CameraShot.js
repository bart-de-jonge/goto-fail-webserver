/*
 * Class for storing camerashots
 */
class CameraShot {
    constructor(beginCount, endCount, name, description, colliding, instance) {
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.name = name;
        this.description = description;
        this.colliding = colliding;
        this.instance = instance;
    }

    static fromXML(XMLObject) {
        return new CameraShot(XMLObject.beginCount[0],
            XMLObject.endCount[0], XMLObject.name[0],
            XMLObject.description[0], XMLObject.colliding[0],
            XMLObject.instance[0]);
    }

    toXML() {
        return {
            beginCount: [this.beginCount],
            endCount: [this.endCount],
            name: [this.name],
            description: [this.description],
            colliding: [this.colliding],
            instance: [this.instance],
        };
    }
}

export default CameraShot;
