/**
 * socket.io Start Point.
 * Loads all necessary event and connection listeners.
 */
import socketio from "socket.io";
import log4js from "log4js";
import fs from "fs";
import CameraOperatorSocket from "./CameraOperatorSocket";
import ShotCallerSocket from "./ShotCallerSocket";
import ProjectManager from "../../objects/ProjectManager.js";

const logger = log4js.getLogger();

// Get timelines from xml
const getMaxCount = callback => {
    ProjectManager.waitForXML((projectManager) => {
        if (projectManager.data && projectManager.data.scriptingProject.cameraTimelines) {
            callback(projectManager.data.scriptingProject.maxCount);
        } else {
            callback(null);
        }
    });
};

const listen = (server) => {
    const io = socketio.listen(server);

    let maxCount = 12;
    let currentCount = 0;

    const namespaces = [];

    // Watch Project File For Changes
    fs.watch(`${__dirname}/../../project-scp-files/`, (event, filename) => {
        logger.info(`${event} operation on ${filename}`);
        getMaxCount(newMaxCount => {
            logger.info(`Reset current count and load new max count: ${newMaxCount}`);
            currentCount = 0;
            namespaces.forEach(namespace => namespace.sendNextCount(currentCount));
            if (newMaxCount) {
                maxCount = newMaxCount;
            }
        });
    });

    getMaxCount(newMaxCount => {
        if (newMaxCount) {
            logger.info(`Load new max count: ${newMaxCount}`);
            maxCount = newMaxCount;
        }
    });

    const sendCounts = () => {
        if (currentCount < maxCount) {
            currentCount = currentCount + 1;
            namespaces.forEach((namespace) => namespace.sendNextCount(currentCount));
        }
    };

    // Set up different socket namespaces
    const operatorSocket = new CameraOperatorSocket(io, currentCount, sendCounts);
    namespaces.push(operatorSocket);

    const shotCallerSocket = new ShotCallerSocket(io, currentCount, sendCounts);
    namespaces.push(shotCallerSocket);

    logger.debug("Initialized socket.io connection.");
};

export default listen;
