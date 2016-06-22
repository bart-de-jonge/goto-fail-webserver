import fs from "fs";
import xml2js from "xml2js";
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
import CameraTimeline from "../objects/CameraTimeline";
import DirectorTimeline from "../objects/DirectorTimeline.js";
import User from "./User";
import Preset from "./Preset";

// Singleton Object
let projectManagerInstance = null;
const filepath = `${__dirname}/../project-scp-files/project.scp`;

/*
 * Class for storing a Project
 */
class ProjectManager {

    constructor() {
        if (!projectManagerInstance) {
            projectManagerInstance = this;

            this.initialized = false;
            this.live = false;
            if (typeof this.data === "undefined") {
                this.parseXML(() => {
                    this.getPresets(() => {
                        this.initialized = true;
                    });
                });
            } else {
                this.getPresets(() => {
                    this.initialized = true;
                });
            }
        }
        return projectManagerInstance;
    }

    getPresets(callback) {
        this.presets = [];
        // TODO get prestes from benine api

        this.presets.push(new Preset(0, "Preset #1", "The first preset",
            "localhost:1234/a/route/0", 0));
        this.presets.push(new Preset(1, "Preset #2", "The second preset",
            "localhost:1234/a/route/1", 0));
        this.presets.push(new Preset(2, "Preset #3", "The third preset",
            "localhost:1234/a/route/2", 1));

        callback();
    }

    writeXML(callback) {
        const xml = JSON.parse(JSON.stringify(this.data));
        xml.scriptingProject.directorTimeline = this.data.scriptingProject.directorTimeline.toXML();
        xml.scriptingProject.users = this.usersToXML(this.data.scriptingProject.users);
        xml.scriptingProject["camera-centerarea"] = this.cameraTimelinesToXML(
            this.data.scriptingProject.cameraTimelines);
        delete xml.scriptingProject.cameraTimelines;

        const xmlObj = builder.buildObject(xml);
        fs.writeFile(filepath, xmlObj, "utf8", (err) => {
            if (err) {
                // todo something with err
                throw err;
            }
            callback();
        });
    }

    parseXML(callback) {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                // TODO something with the error
                this.data = null;
                callback();
            } else {
                parser.parseString(data, (err, result) => {
                    this.data = result;
                    const directorTimelineXML = result.scriptingProject.directorTimeline[0];
                    this.data.scriptingProject.directorTimeline =
                        DirectorTimeline.fromXML(directorTimelineXML);

                    this.data.scriptingProject.users =
                        this.getUsersFromXML(result.scriptingProject.users);


                    // Add timelines to data object
                    this.data.scriptingProject.cameraTimelines = this.getCameraTimelinesFromXML(
                        result.scriptingProject["camera-centerarea"]);
                    delete this.data.scriptingProject["camera-centerarea"];

                    // Add Max and Min Counts Of This Scripting Project
                    let flattenedShots = [];
                    this.data.scriptingProject.cameraTimelines
                        .map(timeline => timeline.cameraShots)
                        .forEach(shots => {
                            flattenedShots = flattenedShots.concat(shots);
                        });

                    const minMaxCount = this.getMaxAndMinCount(flattenedShots);
                    this.data.scriptingProject.maxCount = minMaxCount.maxCount;
                    this.data.scriptingProject.minCount = minMaxCount.minCount;

                    if (callback) {
                        callback();
                    }
                });
            }
        });
    }

    getCameraTimelinesFromXML(XMLObject) {
        // Read timelines from xml
        const cameraTimelinesXML = XMLObject[0].cameraTimeline;
        const cameraTimelines = [];

        if (typeof cameraTimelinesXML !== "undefined") {
            // Insert shots in timeline which is pushed to timelinesarray
            cameraTimelinesXML.forEach((timeline) => {
                cameraTimelines.push(CameraTimeline.fromXML(timeline));
            });
        }
        return cameraTimelines;
    }

    cameraTimelinesToXML(cameraTimelines) {
        const XMLObject = [{ cameraTimeline: [] }];
        cameraTimelines.forEach((timeline) => {
            XMLObject[0].cameraTimeline.push(timeline.toXML());
        });
        return XMLObject;
    }

    // Get max and min counts of an array of shots
    getMaxAndMinCount(flattenedCameraTimelines) {
        // Calculate minimum and maximum counts
        let minCount = 0;
        let maxCount = 0;
        if (flattenedCameraTimelines.length > 0) {
            minCount = Number(flattenedCameraTimelines[0].beginCount);
            maxCount = Number(flattenedCameraTimelines[0].endCount);
            flattenedCameraTimelines.forEach(shot => {
                if (shot.beginCount < minCount) {
                    minCount = Number(shot.beginCount);
                }
                if (shot.endCount > maxCount) {
                    maxCount = Number(shot.endCount);
                }
            });
        }
        return { minCount, maxCount };
    }

    getUsersFromXML(XMLObject) {
        if (typeof XMLObject !== "undefined") {
            const usersXML = XMLObject[0].user;
            const users = [];
            if (typeof usersXML !== "undefined") {
                usersXML.forEach((user, index) => {
                    users.push(User.fromXML(user, index));
                });
            }
            return users;
        }
        return [];
    }

    usersToXML(users) {
        const usersXML = [];
        users.forEach((user) => {
            usersXML.push(user.toXML());
        });

        return [{ user: usersXML }];
    }

    filterTimelines(pickedTimelines, data) {
        const flattenedTimelines = [];
        const resultingData = {};
        resultingData.scriptingProject = {};
        resultingData.scriptingProject.cameraTimelines = [];

        data.scriptingProject.cameraTimelines.forEach((timeline, index) => {
            if (pickedTimelines.indexOf(index) >= 0) {
                flattenedTimelines.concat(timeline.getCameraShots);
                resultingData.scriptingProject.cameraTimelines.push(timeline);
            }
        });
        return resultingData;
    }

    /*
     * Set whether or not the project is live
     */
    setLive(newLive) {
        this.live = newLive;
    }

    /*
     * Reload Project File After New Upload
     */
    reloadProject(callback) {
        this.initialized = false;
        // Force a call to reload the file, then wait for loaded file
        this.parseXML(() => {
            this.initialized = true;
        });
        ProjectManager.waitForXML(callback);
    }

    /*
     * Helper method for ensuring that XML has been parsed before
     * reading ProjectManager data
     */
    static waitForXML(callback) {
        const projectManager = new ProjectManager();
        function xmlWait() {
            if (!projectManager.initialized) {
                setTimeout(xmlWait, 10);
            } else {
                callback(projectManager);
            }
        }
        xmlWait();
    }

    /*
     * Helper method for ensuring that XML has been written
     */
    static waitForWriteXML(callback) {
        const projectManager = new ProjectManager();
        function xmlWait() {
            if (!projectManager.initialized) {
                setTimeout(xmlWait, 10);
            } else {
                projectManager.writeXML(() => {
                    callback();
                });
            }
        }
        xmlWait();
    }

    static waitForPresetUpdates(callback) {
        const projectManager = new ProjectManager();
        const existingProjectManager = projectManager.initialized;
        function presetWait() {
            if (!projectManager.initialized) {
                setTimeout(presetWait, 10);
            } else {
                if (existingProjectManager) {
                    projectManager.getPresets(() => {
                        callback(projectManager);
                    });
                }
            }
        }
        presetWait();
    }
}

export default ProjectManager;
