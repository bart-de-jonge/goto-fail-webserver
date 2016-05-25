import CameraType from "../../objects/CameraType.js";
import { expect } from "chai";

describe("CameraType", () => {
    it("Can Create CameraType object", done => {
        const type = new CameraType("70D", "Canon", 2);
        expect(type).to.not.be.null;
        done();
    });
});
