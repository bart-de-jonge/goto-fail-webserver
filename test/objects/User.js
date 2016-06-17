import User from "../../objects/User.js";
import { expect } from "chai";

describe("User", () => {
    it("Can Create A User Object", done => {
        const user = new User(1, "John", [0, 1], 1);
        expect(user).to.not.be.null;
        done();
    });

    it("Can Create A User From XML", done => {
        const xmlObject = {
            chosenTimelines: [
                {
                    chosenTimeline: ["0", "1"]
                }
            ],
            name: ["John"],
            roleValue: ["1"],
        };

        const user = User.fromXML(xmlObject, 1);

        expect(user.id).to.equal(1);
        expect(user.name).to.equal("John");
        expect(user.jobType).to.equal(1);
        expect(user.pickedTimelines).to.eql([0, 1]);
        done();
    });

    it("Can Create A XML Writeable User Object Notation", done => {
        const user = new User(1, "John", [0, 1], 1);

        const writeable = user.toXML();
        expect(writeable.name).to.eql(["John"]);
        expect(writeable.roleValue).to.eql(["1"]);
        expect(writeable.chosenTimelines).to.eql([{
            chosenTimeline: ["0", "1"]
        }]);
        done();
    });

    it("Can Parse A User From JSON", done => {
        const jsonObject = {
            id: 1,
            name: "John",
            pickedTimelines: [0, 1],
            jobType: 1
        };

        const user = User.parseFromJson(jsonObject);

        expect(user.id).to.equal(1);
        expect(user.name).to.equal("John");
        expect(user.jobType).to.equal(1);
        expect(user.pickedTimelines).to.eql([0, 1]);
        done();
    });
});
