/* eslint-env mocha */

import CameraShot from "../../objects/CameraShot.js";
import { expect } from "chai";

describe("CameraShot", () => {
    it("Can Create CameraShot object", done => {
        const shot = new CameraShot(0, 1, "My Shot", "Better Be Good");
        expect(shot).to.not.be.null;
        done();
    });
});
