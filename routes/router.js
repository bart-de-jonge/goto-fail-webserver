import index from "./index";
import timeline from "./timeline";
import uploadScp from "./upload-scp";
import users from "./users";
import camera from "./camera";
import shotCaller from "./shot-caller";
import director from "./director";

import fs from "fs";
import DirectorTimeline from "../objects/DirectorTimeline.js";
import xml2js from "xml2js";
import util from "util";

import ProjectManager from "../objects/ProjectManager";

const parser = new xml2js.Parser();

// Module used to attach all routes to the correct urls
module.exports.addRoutes = (app) => {
    app.use("/", index);
    app.use("/timeline", timeline);
    app.use("/upload-scp", uploadScp);
    app.use("/", users);
    app.use("/camera", camera);
    app.use("/shot-caller", shotCaller);
    app.use("/director", director);

    app.get("/testing", (req, res) => {

        fs.readFile(`${__dirname}/../project-scp-files/project.scp`, (err, data) => {
            if (err) {
                // TODO something with the error
                this.data = null;
                this.initialized = true;
            } else {
                parser.parseString(data, (err, result) => {
                    const data = result;
                    const directorTimelineXML = result.scriptingProject.directorTimeline[0];
                    data.scriptingProject.directorTimeline = DirectorTimeline.fromXML(directorTimelineXML);

                    res.json({result: result, data: ProjectManager.waitForGenerateXML()});
                });
            }
        });
    });
};
