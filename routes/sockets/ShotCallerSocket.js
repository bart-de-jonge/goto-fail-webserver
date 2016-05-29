/**
 * socket.io handlers for shot callers.
 * Exposes methods to enable broadcasting of shot events.
 */
import log4js from "log4js";
import ProjectManager from "../../objects/ProjectManager";

const logger = log4js.getLogger();

const getDirectorTimeline = callback => {
    const projectManager = new ProjectManager();
    function waitForXML() {
        if (!projectManager.initialized) {
            setTimeout(waitForXML, 10);
        } else {
            const directorTimeline = projectManager.data.directorTimeline;
            callback(directorTimeline);
        }
    }
    waitForXML();
};

class ShotCallerSocket {
    constructor(io, currentCount, advanceCountCallBack) {
        this.namespace = io.of("/shotCallers");
        this.advanceCountCallBack = advanceCountCallBack;
        this.currentCount = currentCount;

        this.namespace.on("connection", (socket) => {
            logger.info("New Shot Caller Connection");
            // Initialize with Current Server Count
            this.sendNextCount(currentCount);
            socket.on("advance count", () => {
                this.advanceCountCallBack();
            });

            socket.on("get current shot", () => {
                getDirectorTimeline((directorTimeline) => {
                    logger.info("Sending Current DirectorShot");

                    const currentShot = this.findCurrentShot(directorTimeline);
                    socket.emit("current director shot", {
                        currentShot,
                    });
                });
            });

            socket.on("get next shot", () => {
                getDirectorTimeline((directorTimeline) => {
                    logger.info("Sending Next Director Shot");
                    const nextShot = this.findNextShot(directorTimeline);
                    socket.emit("next director shot", {
                        nextShot,
                    });
                });
            });
        });
    }

    sendNextCount(newCount) {
        logger.info("Sending Shot Caller New Count");
        this.currentCount = newCount;
        this.namespace.emit("next count", {
            newCount,
        });
    }

    // Find the current DirectorShot
    findCurrentShot(directorTimeline) {
        const candidates = directorTimeline.getDirectorShots()
            .filter((shot) =>
                shot.endCount > this.currentCount && shot.beginCount <= this.currentCount
            );
        if (candidates.length === 0) {
            return null;
        }
        return candidates[0];
    }

    // Find the next DirectorShot
    findNextShot(directorTimeline) {
        const currentItem = this.findCurrentShot(directorTimeline);
        if (currentItem !== null) {
            const numberOfShots = directorTimeline.getDirectorShots().length;
            const currentIndex = directorTimeline.getDirectorShots()
                .indexOf(currentItem);
            if (currentIndex !== numberOfShots - 1) {
                return currentIndex + 1;
            }
        }
        return null;
    }
}

export default ShotCallerSocket;
