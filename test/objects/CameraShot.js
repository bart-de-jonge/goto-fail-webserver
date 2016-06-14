/* eslint-env mocha */

import CameraShot from "../../objects/CameraShot.js";
import { expect } from "chai";

describe("CameraShot", () => {
    it("Can Create CameraShot object", done => {
        const shot = new CameraShot(0, 1, "My Shot", "Better Be Good");
        expect(shot).to.not.be.null;
        done();
    });

    it("Can Create CameraShot From XML With Instruments", done => {
        const xmlObject = {
            instruments: [{
                instrument: [
                    {
                        name: ["Trombone"],
                        description: ["It's Very Loud"],
                    }
                ]
            }],
            beginCount: [0],
            endCount: [1],
            name: ["My Shot"],
            description: ["Better Be Good"],
            colliding: [false],
            instance: [1],
            presetId: [1]
        };
        const shot = CameraShot.fromXML(xmlObject);

        expect(shot.beginCount).to.equal(0);
        expect(shot.endCount).to.equal(1);
        expect(shot.name).to.equal("My Shot");
        expect(shot.description).to.equal("Better Be Good");
        expect(shot.colliding).to.equal(false);
        expect(shot.instance).to.equal(1);
        expect(shot.presetId).to.equal(1);
        expect(shot.instruments).to.not.be.empty;
        done();
    });

    it("Can Create CameraShot From XML", done => {
        const xmlObject = {
            beginCount: [0],
            endCount: [1],
            name: ["My Shot"],
            description: ["Better Be Good"],
            colliding: [false],
            instance: [1],
            presetId: [1]
        };
        const shot = CameraShot.fromXML(xmlObject);

        expect(shot.beginCount).to.equal(0);
        expect(shot.endCount).to.equal(1);
        expect(shot.name).to.equal("My Shot");
        expect(shot.description).to.equal("Better Be Good");
        expect(shot.colliding).to.equal(false);
        expect(shot.instance).to.equal(1);
        expect(shot.presetId).to.equal(1);
        expect(shot.instruments).to.be.empty;
        done();
    });

});
