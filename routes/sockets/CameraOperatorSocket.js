/**
 * socket.io handlers for camera operators.
 * Exposes methods to enable broadcasting of shot events.
 */
import log4js from "log4js";

const logger = log4js.getLogger();

class CameraOperatorSocket {
    constructor(io, currentCount, advanceCountCallBack) {
        this.namespace = io.of("/cameraOperators");
        this.advanceCountCallBack = advanceCountCallBack;
        this.currentCount = currentCount;

        this.namespace.on("connection", (socket) => {
            logger.info("New Camera Operator Connection");
            // Initialize With Current Server Count
            this.sendNextCount(this.currentCount);
            socket.on("advance count", () => {
                this.advanceCountCallBack();
            });
        });
    }

    sendNextCount(newCount) {
        logger.info("Sending Camera Operator New Count");
        this.currentCount = newCount;
        this.namespace.emit("next count", {
            newCount,
        });
    }
}

export default CameraOperatorSocket;
