import fs from "fs";
import CameraShot from "../objects/CameraShot";
import CameraTimeline from "../objects/CameraTimeline";
import xml2js from "xml2js";
import CameraType from "./CameraType";
import Camera from "./Camera";

const parser = new xml2js.Parser();

/*
 * Class for storing a CameraTimeline
 */
class XMLHelper {

    getCameraType(XMLObject) {
        return new CameraType(
            XMLObject.name[0],
            XMLObject.description[0],
            XMLObject.movementMargin[0]
        );
    }

    getCamera(XMLObject) {
        return new Camera(
            XMLObject.name[0],
            XMLObject.description[0],
            XMLObject.movementMargin[0],
            this.getCameraType(XMLObject.cameraType[0])
        );
    }

    parseXML() {
        fs.readFile(`${__dirname}/../project-scp-files/project.scp`, (err, data) => {
            console.log("laskdfjaskldfj");
            if (err) {
                // TODO something with the errorf
                this.data = null;
                this.initialized = true;
            } else {
                parser.parseString(data, (err, result) => {
                    // Read timelines from xml
                    const cameraTimelinesXML =
                        result.scriptingProject["camera-centerarea"][0].cameraTimeline;

                    const cameraTimelines = [];
                    const flattenedCameraTimelines = [];

                    // Insert shots in timeline which is pushed to timelinesarray
                    // and push to flattenedArray
                    cameraTimelinesXML.forEach((timeline) => {
                        // Get camera
                        const camera = this.getCamera(timeline.camera[0]);

                        // Make cameraTimeline
                        const cameraTimeline = new CameraTimeline(
                            camera.name, camera.description, camera);

                        // Parse and add shots
                        if (typeof timeline.shotList[0].shot !== "undefined") {
                            timeline.shotList[0].shot.forEach(shot => {
                                const cameraShot = new CameraShot(shot.beginCount[0],
                                    shot.endCount[0], shot.name[0], shot.description[0]);
                                cameraTimeline.addCameraShot(cameraShot);
                                flattenedCameraTimelines.push(cameraShot);
                            });
                        }
                        cameraTimelines.push(cameraTimeline);
                    });
                    this.data = { cameraTimelines, flattenedCameraTimelines };
                    this.initialized = true;
                });
            }
        });
    }

    constructor() {
        console.log(this.data);
        this.initialized = false;
        if (typeof this.data == "undefined") {
            console.log("alksdfjklasdjfklasdjfasdklfjakldjfasd");
            this.parseXML();
        } else {
            this.initialized = true;
        }
    }
}

export default XMLHelper;
