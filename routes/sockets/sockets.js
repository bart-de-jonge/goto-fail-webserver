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
const getTimelines = function getTimelines(callback) {
    // Dummyfile Todo: replace with dyn0amic
    const projectManager = new ProjectManager();
    function waitForXML() {
        if (!projectManager.initialized) {
            setTimeout(waitForXML, 10);
        } else {
            callback(projectManager.data.cameraTimelines.maxCount);
        }
    }
    waitForXML();
};

const listen = (server) => {
    const io = socketio.listen(server);

    let maxCount = 12;
    let currentCount = 0;

    getTimelines(newMaxCount => {
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
