/**
 * Class for storing a Director Shot.
 */
class DirectorShot {
    /**
     * Constructor that takes:
     * name: Shot Name
     * description: Shot Description
     * beginCount: Starting Count of the Shot
     * endCount: End Count of the Shot
     * frontShotPadding: Padding before the beginning of the Shot
     * endShotPadding: Padding after the end of the Shot
     */
    constructor(name, description, beginCount, endCount, frontShotPadding, endShotPadding) {
        this.name = name;
        this.description = description;
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.frontShotPadding = frontShotPadding;
        this.endShotPadding = endShotPadding;
    }

    // Helper method for creating a DirectorShot from XML
    static fromXML(XMLObject) {
        return new DirectorShot(XMLObject.name[0], XMLObject.description[0],
                                XMLObject.beginCount[0], XMLObject.endCount[0],
                                XMLObject.frontShotPadding[0], XMLObject.endShotPadding[0]);
    }
}

export default DirectorShot;
