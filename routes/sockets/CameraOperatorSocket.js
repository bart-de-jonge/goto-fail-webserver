/**
 * socket.io handlers for camera operators.
 * Exposes methods to enable broadcasting of shot events.
 */
import log4js from "log4js";

const logger = log4js.getLogger();

/**
 * Class instantiated to handle camera operator events.
 */
class CameraOperatorSocket {
    /**
     * Constructor that accepts:
     * io: Socket.io object
     * currentCount: Current Count
     * advanceCountCallBack: Handle For Count Update
     */
    constructor(io, currentCount, advanceCountCallBack) {
        this.namespace = io.of("/cameraOperators");
        this.advanceCountCallBack = advanceCountCallBack;
        this.currentCount = currentCount;

        this.namespace.on("connection", (socket) => {
            logger.info("New Camera Operator Connection");
            // Initialize With Current Server Count
            this.sendNextCount(this.currentCount);
            socket.on("advance_count", () => {
                this.advanceCountCallBack();
            });
        });
    }

    // Set the count and then send updated version to client
    sendNextCount(newCount) {
        logger.info("Sending Camera Operator New Count");
        this.currentCount = newCount;
        this.namespace.emit("next_count", {
            newCount,
        });
    }
}

export default CameraOperatorSocket;
