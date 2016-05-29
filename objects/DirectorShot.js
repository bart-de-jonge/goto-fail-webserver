/**
 * Class for storing a Director Shot.
 */
class DirectorShot {
    constructor(name, description, beginCount, endCount, frontShotPadding, endShotPadding) {
        this.name = name;
        this.description = description;
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.frontShotPadding = frontShotPadding;
        this.endShotPadding = endShotPadding;
    }

    static fromXML(XMLObject) {
        return new DirectorShot(XMLObject.name[0], XMLObject.description[0],
                                XMLObject.beginCount[0], XMLObject.endCount[0],
                                XMLObject.frontShotPadding[0], XMLObject.endShotPadding[0]);
    }
}

export default DirectorShot;
