import Camera from "../../objects/Camera.js";
import CameraType from "../../objects/CameraType.js";
import { expect } from "chai";

describe("Camera", () => {
    it("Can Create Camera object", done => {
        const type = new CameraType("70D", "Canon", 2);
        const camera = new Camera("Left of Center", "Used for panning shots", type, 1);
        expect(camera).to.not.be.null;
        done();
    });

    it("Should Create Camera Object from valid XML", done => {
        const xml = {
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
            ]
        };

        const camera = Camera.fromXML(xml);
        expect(camera).to.not.be.null;
        expect(camera.id).to.equal(1);
        expect(camera.name).to.equal("Left of Center");
        expect(camera.description).to.equal("Used for panning shots");
        expect(camera.movementMargin).to.equal(1);
        expect(camera.cameraType).to.be.instanceOf(CameraType);
        done();
    })
});
