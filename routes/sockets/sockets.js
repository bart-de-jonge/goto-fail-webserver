/**
 * socket.io Start Point.
 * Loads all necessary event and connection listeners.
 */
import socketio from "socket.io";
import log4js from "log4js";

const logger = log4js.getLogger();

const listen = (server) => {
    const io = socketio.listen(server);

    // TODO: Replace Dummy Value With Timeline Information
    const maxCount = 12;
    let currentCount = 0;
    let counterInterval = null;

    const sendCounts = (socket) => {
        if (currentCount <= maxCount) {
            socket.emit("next count", {
                newCount: currentCount,
            });
            currentCount = currentCount + 1;
        } else {
            clearInterval(counterInterval);
        }
    };

    logger.debug("Initialized socket.io connection.");
    io.on("connection", (socket) => {
        logger.info("a user connected.");
        socket.on("disconnect", () => {
            logger.info("user disconnected.");
        });

        socket.on("start counting", () => {
            logger.info("Starting to count");
            counterInterval = setInterval(sendCounts, 1000, socket);
        });

        socket.on("stop counting", () => {
            logger.info("Stopping the count");
            clearInterval(counterInterval);
        });
    });
};

export default listen;
