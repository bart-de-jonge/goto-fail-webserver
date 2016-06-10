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
            XMLObject.instrument[0].name[0],
            XMLObject.instrument[0].description[0]
        );
    }

    toXML() {
        return { instrument: [{
            description: [this.description],
            name: [this.name],
        }] };
    }
}

export default Instrument;
