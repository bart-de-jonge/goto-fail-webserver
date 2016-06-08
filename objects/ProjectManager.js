import fs from "fs";
import xml2js from "xml2js";
const parser = new xml2js.Parser();
import deepCopy from "deepcopy";


import CameraShot from "../objects/CameraShot";
import CameraTimeline from "../objects/CameraTimeline";
import DirectorTimeline from "../objects/DirectorTimeline.js";
import DirectorShot from "../objects/DirectorShot.js";
import User from "./User";

// Singleton Object
let projectManagerInstance = null;

/*
 * Class for storing a Project
 */
class ProjectManager {

    constructor() {
        if (!projectManagerInstance) {
            projectManagerInstance = this;

            this.initialized = false;
            if (typeof this.data === "undefined") {
                this.parseXML();
            } else {
                this.initialized = true;
            }
        }

        return projectManagerInstance;
    }

    generateXML() {
        const xml = deepCopy(this.data);
        xml.scriptingProject.directorTimeline = this.data.scriptingProject.directorTimeline.toXML();
        xml.scriptingProject.users = this.usersToXML(this.data.scriptingProject.users);
        xml.scriptingProject["camera-centerarea"] = this.cameraTimelinesToXML(this.data.scriptingProject.cameraTimelines);
        delete xml.scriptingProject.cameraTimelines;

        return xml;
    }

    parseXML() {
        fs.readFile(`${__dirname}/../project-scp-files/project.scp`, (err, data) => {
            if (err) {
                // TODO something with the error
                this.data = null;
                this.initialized = true;
            } else {
                parser.parseString(data, (err, result) => {
                    this.data = result;
                    const directorTimelineXML = result.scriptingProject.directorTimeline[0];
                    this.data.scriptingProject.directorTimeline = DirectorTimeline.fromXML(directorTimelineXML);

                    this.data.scriptingProject.users = this.getUsersFromXML(result.scriptingProject.users);


                    // Add timelines to data object
                    this.data.scriptingProject.cameraTimelines = this.getCameraTimelinesFromXML(
                        result.scriptingProject["camera-centerarea"]);
                    delete this.data.scriptingProject["camera-centerarea"];
                    this.initialized = true;
                });
            }
        });
    }

    getCameraTimelinesFromXML(XMLObject) {
        // Read timelines from xml
        const cameraTimelinesXML =  XMLObject[0].cameraTimeline;
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
        const XMLObject = [{cameraTimeline: []}];
        cameraTimelines.forEach((timeline) => {
           XMLObject[0].cameraTimeline.push(timeline.toXML());
        });
        return XMLObject;
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
        } else {
            return [];
        }
    }

    usersToXML(users) {
        const usersXML = [];
        users.forEach((user) => {
            usersXML.push(user.toXML());
        });

        return [{user: usersXML}];
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
     * Reload Project File After New Upload
     */
    reloadProject(callback) {
        this.initialized = false;
        // Force a call to reload the file, then wait for loaded file
        this.parseXML();
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
     * Helper method for ensuring that XML has been parsed before
     * reading ProjectManager data
     */
    static waitForGenerateXML(callback) {
        const projectManager = new ProjectManager();
        const xmlJSON = projectManager.generateXML();
        return xmlJSON;
    }
}

export default ProjectManager;
