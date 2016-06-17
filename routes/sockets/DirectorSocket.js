/**
 * socket.io handlers for directors.
 * Exposes methods to enable broadcasting of production related events.
 */
import log4js from "log4js";

const logger = log4js.getLogger();

/**
 * Class instantiated to handle director events.
 */
class DirectorSocket {
    /**
     * Constructor that accepts:
     * io: Socket.io object
     * currentCount: Current Count
     * advanceCountCallBack: Handle For Count Update
     */
    constructor(io, currentCount, advanceCountCallBack) {
        this.namespace = io.of("/director");
        this.advanceCountCallBack = advanceCountCallBack;
        this.currentCount = currentCount;

        this.namespace.on("connection", socket => {
            logger.info("New Director Connection");

            this.sendNextCount(this.currentCount);
            socket.on("disconnect", () => {
                logger.info("Director Disconnected");
            });
        });
    }

    // Set the count and then send updated value to the director
    sendNextCount(newCount) {
        logger.info("Sending Director New Count");
        this.currentCount = newCount;
        this.namespace.emit("next_count", {
            newCount,
        });
    }
}

export default DirectorSocket;
