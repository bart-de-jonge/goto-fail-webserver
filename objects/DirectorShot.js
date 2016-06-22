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
    constructor(name, description, beginCount, endCount, frontShotPadding,
                endShotPadding, colliding, cameraShots, timelineIndices) {
        this.name = name;
        this.description = description;
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.frontShotPadding = frontShotPadding;
        this.endShotPadding = endShotPadding;
        this.colliding = colliding;
        this.cameraShots = cameraShots;
        this.timelineIndices = timelineIndices;
    }

    // Helper method for creating a DirectorShot from XML
    static fromXML(XMLObject) {
        return new DirectorShot(
            typeof XMLObject.name[0] !== "undefined" ? XMLObject.name[0] : "",
            typeof XMLObject.description[0] !== "undefined" ? XMLObject.description[0] : "",
            typeof XMLObject.beginCount[0] !== "undefined" ? XMLObject.beginCount[0] : -1,
            typeof XMLObject.endCount[0] !== "undefined" ? XMLObject.endCount[0] : -1,
            typeof XMLObject.frontShotPadding[0] !== "undefined" ? XMLObject.frontShotPadding[0] : -1,
            typeof XMLObject.endShotPadding[0] !== "undefined" ? XMLObject.endShotPadding[0] : -1,
            typeof XMLObject.colliding[0] !== "undefined" ? XMLObject.colliding[0] : false,
            typeof XMLObject.cameraShots !== "undefined" ? XMLObject.cameraShots : [],
            typeof XMLObject.timelineIndices[0] !== "undefined" ? XMLObject.timelineIndices[0] : []);
    }

    // Helper method for transforming a DirectorShot to XML
    toXML() {
        return {
            name: this.name,
            description: this.description,
            beginCount: this.beginCount,
            endCount: this.endCount,
            frontShotPadding: this.frontShotPadding,
            endShotPadding: this.endShotPadding,
            colliding: this.colliding,
            cameraShots: this.cameraShots,
            timelineIndices: this.timelineIndices,
        };
    }
}

export default DirectorShot;
