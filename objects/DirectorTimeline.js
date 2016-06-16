import DirectorShot from "../objects/DirectorShot.js";

/**
 * Class for storing a DirectorTimeline.
 */
class DirectorTimeline {
    constructor(description) {
        this.description = description;
        this.directorShots = [];
    }

    // Add a DirectorShot to this timeline
    addDirectorShot(directorShot) {
        this.directorShots.push(directorShot);
    }

    // Get list of DirectorShots
    getDirectorShots() {
        return this.directorShots;
    }

    static fromXML(XMLObject) {
        const directorTimeline = new DirectorTimeline(
            XMLObject.description[0]);

        if (XMLObject.shotList[0]) {
            XMLObject.shotList[0].shot.forEach(shot => {
                const directorShot = DirectorShot.fromXML(shot);
                directorTimeline.addDirectorShot(directorShot);
            });
        }
        return directorTimeline;
    }

    toXML() {
        const directorShotsXML = this.directorShots.map((shot) => shot.toXML());
        return {
            description: this.description,
            shotList: { shot: directorShotsXML },
        };
    }

    static fromJSON(object) {
        return new DirectorTimeline(object.description);
    }
}

export default DirectorTimeline;
