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

    it("Can Create A Camera Timeline From XML", done => {
        const xmlObject = {
            camera: [{
                instance: [ 1 ],
                name: [ "Left of Center" ],
                description: [ "Used for panning shots" ],
                movementMargin: [ 1 ],
                cameraType: [ 
                    {
                        name: [ "70D" ],
                        description: [ "Canon" ],
                        movementMargin: [ 2 ],
                    },
                ],
                ip: [ "127.0.0.1" ]
            }],
            instance: [0],
            shotList: [{}],
        };
        const cameraTimeline = CameraTimeline.fromXML(xmlObject);

        expect(cameraTimeline.name).to.equal("Left of Center");
        expect(cameraTimeline.description).to.equal("Used for panning shots");
        expect(cameraTimeline.camera).to.exist;
        expect(cameraTimeline.instance).to.equal(0);
        expect(cameraTimeline.cameraShots).to.be.empty;
        done();
    });
});
