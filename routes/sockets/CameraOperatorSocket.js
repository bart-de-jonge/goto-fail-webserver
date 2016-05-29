/**
 * socket.io handlers for camera operators.
 * Exposes methods to enable broadcasting of shot events.
 */
import log4js from "log4js";

const logger = log4js.getLogger();

class CameraOperatorSocket {
    constructor(io, advanceCountCallBack) {
        this.namespace = io.of("/cameraOperators");
        this.advanceCountCallBack = advanceCountCallBack;

        this.namespace.on("connection", (socket) => {
            logger.info("New Camera Operator Connection");
            socket.on("advance count", () => {
                this.advanceCountCallBack();
            });
        });
    }

    sendNextCount(newCount) {
        this.namespace.emit("next count", {
            newCount,
        });
    }
}

export default CameraOperatorSocket;
