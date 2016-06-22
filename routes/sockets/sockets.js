/**
 * socket.io Start Point.
 * Loads all necessary event and connection listeners.
 */
import socketio from "socket.io";
import log4js from "log4js";
import fs from "fs";
import CameraOperatorSocket from "./CameraOperatorSocket";
import DirectorSocket from "./DirectorSocket";
import ShotCallerSocket from "./ShotCallerSocket";
import ProjectManager from "../../objects/ProjectManager";
import BenineHelper from "../../objects/BenineHelper";

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

/*
 * Get a list of the current shots for the camera timelines.
 * The index of a shot corresponds to the camera timeline's index
 * @param currentCount The count to filter the shots by
 * @param callback Callback called with the list of current shots as an argument
 */
const getCurrentShots = (currentCount, callback) => {
    ProjectManager.waitForXML(projectManager => {
        if (projectManager.data && projectManager.data.scriptingProject.cameraTimelines) {
            const cameraTimelines = projectManager.data.scriptingProject.cameraTimelines;

            // Filter each timeline's shots based on the current count,
            // and if none is current, it's current shot is null
            const currentShots = cameraTimelines.map(cameraTimeline => {
                const matchingShots = cameraTimeline.getCameraShots()
                    .filter(shot => { // eslint-disable-line arrow-body-style
                        return shot.endCount > currentCount && shot.beginCount <= currentCount;
                    });
                if (matchingShots.length === 0) {
                    // If no shot is current then get the next shot so that the recalling is current
                    const nextShots = cameraTimeline.getCameraShots()
                        .filter(shot => { // eslint-disable-line arrow-body-style
                            return shot.beginCount > currentCount;
                        });
                    if (nextShots.length !== 0) {
                        return nextShots[0];
                    }
                    return null;
                }
                return matchingShots[0];
            });

            callback(currentShots);
        } else {
            // If there isn't any data then there aren't any shots
            callback([]);
        }
    });
};

/*
 * Compare the previous shots to the new camera shots.
 * If the shots don't match, or a recall is forced, then recall the corresponding camera preset
 * @param previousShots List of previous camera shots
 * @param newShots List of new camera shots
 * @param callback Called on successful completion of the recalls
 * @param forceRecall Force the recalling of presents for new shots (even if they match)
 */
const compareAndRecallShots = (previousShots, newShots, callback, forceRecall) => {
    const benineHelper = new BenineHelper();
    newShots.forEach((newShot, index) => {
        if (newShot &&
            (forceRecall || previousShots[index] !== newShot)) {
            benineHelper.recallShot(newShot, success => {
                if (success) {
                    logger.info(`Successfully recalled preset ${newShot.presetId}`);
                }
            });
        }
    });

    callback();
};

/*
 * Check whether or not the project is live.
 * @param callback Callback called with whether or not the project is live as an argument.
 */
const checkIfLive = callback => {
    ProjectManager.waitForXML(projectManager => {
        callback(projectManager.live);
    });
};

const listen = (server) => {
    const io = socketio.listen(server);

    let maxCount = 12;
    let currentCount = 0;

    const namespaces = [];

    let currentShots = [];

    // Update the current shots, and recall presets if necessary (or if they are forced)
    const updateCurrentShots = (forceRecall = false) => {
        logger.info("Updating the current shots");
        getCurrentShots(currentCount, newShots => {
            checkIfLive(live => {
                if (live) {
                    // Project is live, so presets can be recalled
                    compareAndRecallShots(currentShots, newShots, () => {
                        currentShots = newShots;
                    }, forceRecall);
                } else {
                    currentShots = newShots;
                }
            });
        });
    };

    // Set the current shots, and force a recall if they're just being loaded in live
    updateCurrentShots(true);

    // Watch Project File For Changes
    fs.watch(`${__dirname}/../../project-scp-files/`, (event, filename) => {
        logger.info(`${event} operation on ${filename}`);
        getMaxCount(newMaxCount => {
            logger.info(`Reset current count and load new max count: ${newMaxCount}`);
            currentCount = 0;

            updateCurrentShots();

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
            updateCurrentShots();
            namespaces.forEach((namespace) => namespace.sendNextCount(currentCount));
        }
    };

    // Callback that allows more fine-grained manipulation of the count
    const setCount = (newCount) => {
        if (newCount < maxCount) {
            currentCount = newCount;
            updateCurrentShots();
            namespaces.forEach((namespace) => namespace.sendNextCount(currentCount));
        }
    };

    // Callback that sets whether or not the project is live
    const setLive = (newLive) => {
        ProjectManager.waitForXML(projectManager => {
            projectManager.setLive(newLive);
            // Recall Presets For Current Shots If It Went Live
            updateCurrentShots(true);
            namespaces.forEach(namespace => namespace.setLive(newLive));
        });
    };

    // Set up different socket namespaces
    const operatorSocket = new CameraOperatorSocket(io, currentCount, sendCounts);
    namespaces.push(operatorSocket);

    const shotCallerSocket = new ShotCallerSocket(io, currentCount, sendCounts, setCount);
    namespaces.push(shotCallerSocket);

    const directorSocket = new DirectorSocket(io, currentCount, sendCounts, setLive);
    namespaces.push(directorSocket);

    logger.debug("Initialized socket.io connection.");
};

export default listen;
