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
            XMLObject.name[0],
            XMLObject.description[0]
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
