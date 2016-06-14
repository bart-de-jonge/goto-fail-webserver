import Instrument from "../../objects/Instrument.js";
import { expect } from "chai";

describe("Instrument", () => {
    it("Can Create An Instrument Object", done => {
        const trombone = new Instrument("Trombone", "It's Very Loud");

        expect(trombone).to.not.be.null;
        done();
    });
    
    it("Can Create An Instrument From XML", done => {
        const xmlObject = {
            instrument: [
                {
                    name: ["Trombone"],
                    description: ["It's Very Loud"],
                }
            ],
        };
        const trombone = Instrument.fromXML(xmlObject);

        expect(trombone.name).to.equal("Trombone");
        expect(trombone.description).to.equal("It's Very Loud");
        done();
    });

    it("Can Create A XML Writeable Instrument Object Notation", done => {
        const trombone = new Instrument("Trombone", "It's Very Loud");
        const writeable = trombone.toXML();

        expect(writeable.instrument[0].name).to.eql(["Trombone"]);
        expect(writeable.instrument[0].description).to.eql(["It's Very Loud"]);
        done();
    });
});
