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
});
