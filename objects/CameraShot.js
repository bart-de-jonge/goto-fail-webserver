/*
 * Class for storing camerashots
 */
class CameraShot {
    constructor(beginCount, endCount, name, description) {
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.name = name;
        this.description = description;
    }

    static fromXML(XMLObject) {
        return new CameraShot(XMLObject.beginCount[0],
            XMLObject.endCount[0], XMLObject.name[0], XMLObject.description[0]);
    }
}

export default CameraShot;
