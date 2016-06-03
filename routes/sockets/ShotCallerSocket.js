/**
 * socket.io handlers for shot callers.
 * Exposes methods to enable broadcasting of shot events.
 */
import log4js from "log4js";
import ProjectManager from "../../objects/ProjectManager";

const logger = log4js.getLogger();

// Fetch the Project's DirectorTimeline
const getDirectorTimeline = callback => {
    ProjectManager.waitForXML((projectManager) => {
        if (projectManager.data) {
            const directorTimeline = projectManager.data.directorTimeline;
            callback(directorTimeline);
        } else {
            callback(null);
        }
    });
};

/**
 * Class instantiated to handle shot caller events.
 */
class ShotCallerSocket {
    /**
     * Constructor that accepts:
     * io: Socket.io object
     * currentCount: Current Count
     * advanceCountCallBack: Handle For Count Update
     */
    constructor(io, currentCount, advanceCountCallBack) {
        this.namespace = io.of("/shotCallers");
        this.advanceCountCallBack = advanceCountCallBack;
        this.currentCount = currentCount;

        this.namespace.on("connection", (socket) => {
            logger.info("New Shot Caller Connection");
            // Initialize with Current Server Count
            this.sendNextCount(this.currentCount);

            socket.on("advance_count", () => {
                this.advanceCountCallBack();
            });

            socket.on("get_current_shot", () => {
                getDirectorTimeline((directorTimeline) => {
                    const currentShot = this.findCurrentShot(directorTimeline);

                    logger.info("Sending Current DirectorShot");
                    socket.emit("current_director_shot", {
                        currentShot,
                    });
                });
            });

            socket.on("get_next_shot", () => {
                getDirectorTimeline((directorTimeline) => {
                    logger.info("Sending Next Director Shot");
                    const nextShot = this.findNextShot(directorTimeline);
                    socket.emit("next_director_shot", {
                        nextShot,
                    });
                });
            });
        });
    }

    // Set the count and then send updated version to client
    sendNextCount(newCount) {
        logger.info("Sending Shot Caller New Count");
        this.currentCount = newCount;
        this.namespace.emit("next_count", {
            newCount,
        });
    }

    // Find the current DirectorShot
    findCurrentShot(directorTimeline) {
        if (directorTimeline) {
            const candidates = directorTimeline.getDirectorShots()
                .filter((shot) =>
                    shot.endCount > this.currentCount && shot.beginCount <= this.currentCount
                );
            if (candidates.length === 0) {
                return null;
            }
            return candidates[0];
        }
        return null;
    }

    // Find the next DirectorShot
    findNextShot(directorTimeline) {
        if (directorTimeline) {
            const nextShots = directorTimeline.getDirectorShots()
                .filter((shot) =>
                    shot.beginCount > this.currentCount
               );
            if (nextShots.length !== 0) {
                return nextShots[0];
            }
        }
        return null;
    }
}

export default ShotCallerSocket;
