/*
 * Class for storing a CameraTimeline
 */
class Instrument {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    static fromXML(XMLObject) {
        return new Instrument(
            typeof XMLObject.name[0] !== "undefined" ? XMLObject.name[0] : "",
            typeof XMLObject.description[0] !== "undefined" ? XMLObject.description[0] : ""
        );
    }

    toXML() {
        return {
            description: [this.description],
            name: [this.name],
        };
    }
}

export default Instrument;
