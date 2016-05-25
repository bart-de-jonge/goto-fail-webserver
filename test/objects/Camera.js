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
});
