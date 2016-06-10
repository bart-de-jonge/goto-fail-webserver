import CameraType from "../../objects/CameraType.js";
import { expect } from "chai";

describe("CameraType", () => {
    it("Can Create CameraType object", done => {
        const type = new CameraType("70D", "Canon", 2);
        expect(type).to.not.be.null;
        done();
    });

    it("Should Create CameraType Object from valid XML", done => {
        const xml = [{
            name: ["70D"],
            description: ["Canon"],
            movementMargin: [2],
        }];

        const cameraType = CameraType.fromXML(xml);
        expect(cameraType).to.not.be.null;
        expect(cameraType.name).to.equal("70D");
        expect(cameraType.description).to.equal("Canon");
        expect(cameraType.movementMargin).to.equal(2);
        done();
    })
});
