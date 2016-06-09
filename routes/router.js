import index from "./index";
import timeline from "./timeline";
import uploadScp from "./upload-scp";
import users from "./users";
import cameras from "./cameras";
import shotCaller from "./shot-caller";
import director from "./director";
import cameraControl from "./camera-control";

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
    app.use("/cameras", cameras);
    app.use("/camera-control", cameraControl);
    app.use("/shot-caller", shotCaller);
    app.use("/director", director);
};
