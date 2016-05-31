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
}

export default DirectorTimeline;
