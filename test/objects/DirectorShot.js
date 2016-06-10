import DirectorShot from "../../objects/DirectorShot.js";
import { expect } from "chai";

describe("DirectorShot", () => {
    it("Can create a DirectorShot object", done => {
        const directorShot = new DirectorShot("Main Panning Shot", "Of Audience", 
                                             1, 3, 0.5, 0.5);
        expect(directorShot).to.not.be.null;
        done();
    });

    it("Can Use XML to create DirectorShot", done => {
        const xmlObject = {
            name: ["Main Panning Shot"],
            description: ["Of Audience"],
            beginCount: [1],
            endCount: [3],
            frontShotPadding: [0.5],
            endShotPadding: [0.5],
            colliding: [0],
            camerashots: [[]],
            timelineIndices: [[]],
        };
        const directorShot = DirectorShot.fromXML(xmlObject);
        console.log(directorShot);

        expect(directorShot.name).to.equal("Main Panning Shot");
        expect(directorShot.description).to.equal("Of Audience");
        expect(directorShot.beginCount).to.equal(1);
        expect(directorShot.endCount).to.equal(3);
        expect(directorShot.frontShotPadding).to.equal(0.5);
        expect(directorShot.endShotPadding).to.equal(0.5);

        done();
    });
});
