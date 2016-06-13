import Instrument from "./Instrument";

/*
 * Class for storing camerashots
 */
class CameraShot {
    constructor(beginCount, endCount, name, description, colliding,
                instance, presetId, instruments) {
        this.beginCount = beginCount;
        this.endCount = endCount;
        this.name = name;
        this.description = description;
        this.colliding = colliding;
        this.instance = instance;
        this.presetId = presetId;
        this.instruments = instruments;
    }

    static fromXML(XMLObject) {
        const instruments = [];

        if (XMLObject.instruments) {
            XMLObject.instruments.forEach((instrument) => {
                if (instrument.instrument) {
                    instruments.push(Instrument.fromXML(instrument));
                }
            });
        }

        return new CameraShot(XMLObject.beginCount[0],
            XMLObject.endCount[0], XMLObject.name[0],
            XMLObject.description[0], XMLObject.colliding[0],
            XMLObject.instance[0], XMLObject.presetId[0],
            instruments);
    }

    toXML() {
        const instruments = this.instruments.map(instrument => instrument.toXML());
        return {
            beginCount: [this.beginCount],
            endCount: [this.endCount],
            name: [this.name],
            description: [this.description],
            colliding: [this.colliding],
            instance: [this.instance],
            presetId: [this.presetId],
            instruments,
        };
    }
}

export default CameraShot;
