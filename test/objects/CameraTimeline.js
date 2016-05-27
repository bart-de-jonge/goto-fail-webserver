import CameraTimeline from "../../objects/CameraTimeline.js";
import CameraShot from "../../objects/CameraShot.js";
import { expect } from "chai";

describe("CameraTimeline", () => {
    it("Can create CameraTimeline object", done => {
        const timeline = new CameraTimeline("Timeline 1", "Best timeline");
        expect(timeline).to.not.be.null;
        done();
    });

    it("Can add a CameraShot", done => {
        const timeline = new CameraTimeline("Timeline 1", "Best timeline");
        const shot = new CameraShot(0, 1, "First shot", "Wide angle");

        timeline.addCameraShot(shot);

        expect(timeline.cameraShots.shift()).to.equal(shot);

        done();
    });

    it("Can get the list of camera shots", done => {
        const timeline = new CameraTimeline("Timeline 1", "Best timeline");
        const shot = new CameraShot(0, 1, "First shot", "Wide angle");

        timeline.addCameraShot(shot);

        expect(timeline.getCameraShots().shift()).to.equal(shot);

        done();
    })
});
