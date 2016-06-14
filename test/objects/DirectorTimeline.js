import DirectorTimeline from "../../objects/DirectorTimeline";
import DirectorShot from "../../objects/DirectorShot";
import { expect } from "chai";

describe("DirectorTimeline", () => {
    it("Can create a DirectorTimeline object", done => {
        const directorTimeline = new DirectorTimeline("Where It All Happens");
        expect(directorTimeline).to.not.be.null;
        done();
    });

    it("Can add a DirectorShot to a DirectorTimeline", done => {
        const directorTimeline = new DirectorTimeline("Where it all happens");
        const directorShot = new DirectorShot("Main Panning Shot", "Of Audience", 
                                             1, 3, 0.5, 0.5);
        directorTimeline.addDirectorShot(directorShot);
        expect(directorTimeline.getDirectorShots()).to.contain(directorShot);
        done();
    });

    it("Can create a DirectorTimeline from XML without a DirectorShot", done => {
        const xmlObject = {
            description: ["I'm a director timeline"],
            shotList: [],
        };

        const directorTimeline = DirectorTimeline.fromXML(xmlObject);
        expect(directorTimeline.description).to.equal("I'm a director timeline");
        expect(directorTimeline.directorShots).to.be.empty;
        done();
    });

    it("Can create a DirectorTimeline from XML", done => {
        const xmlObject = {
            description: ["I'm a director timeline"],
            shotList: [{
                shot: [{
                    name: ["Main Panning Shot"],
                    description: ["Of Audience"],
                    beginCount: [1],
                    endCount: [3],
                    frontShotPadding: [0.5],
                    endShotPadding: [0.5],
                    colliding: [0],
                    camerashots: [[]],
                    timelineIndices: [[]],
                }],
            }],
        };

        const directorTimeline = DirectorTimeline.fromXML(xmlObject);
        expect(directorTimeline.description).to.equal("I'm a director timeline");
        expect(directorTimeline.directorShots).to.not.be.empty;
        done();
    })
});
