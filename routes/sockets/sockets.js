/**
 * socket.io Start Point.
 * Loads all necessary event and connection listeners.
 */
import socketio from "socket.io";
import log4js from "log4js";
import CameraOperatorSocket from "./CameraOperatorSocket";
import ShotCallerSocket from "./ShotCallerSocket";
import ProjectManager from "../../objects/ProjectManager.js";

const logger = log4js.getLogger();

// Get timelines from xml
const getMaxCount = callback => {
    ProjectManager.waitForXML((projectManager) => {
        if (projectManager.data.cameraTimelines) {
            callback(projectManager.data.cameraTimelines.maxCount);
        } else {
            callback(null);
        }
    });
};

const listen = (server) => {
    const io = socketio.listen(server);

    let maxCount = 12;
    let currentCount = 0;

    getMaxCount(newMaxCount => {
        maxCount = newMaxCount;
    });

    const namespaces = [];

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
