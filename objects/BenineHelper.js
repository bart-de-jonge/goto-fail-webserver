import http from "http";
import log4js from "log4js";
import Preset from "./Preset";

// Singleton Object
let benineHelperInstance = null;
const serverAddress = "192.168.0.12";
const port = 8888;
const logger = log4js.getLogger();

/*
 * Class for communication with the Benine API
 */
class BenineHelperInstance {

    constructor() {
        if (!benineHelperInstance) {
            benineHelperInstance = this;
        }
        return benineHelperInstance;
    }

    /**
     * Recall a camerashots preset
     * @param cameraShot - the camerashot
     * @param callback - callback function
     */
    recallShot(cameraShot, callback) {
        if (cameraShot.presetId && cameraShot.presetId >= 0) {
            const reqOptions = {
                host: serverAddress,
                path: `/presets/recallpreset?presetid=${cameraShot.presetId}`,
                port,
                method: "GET",
            };

            const req = http.get(reqOptions, (res) => {
                const bodyChunks = [];
                res.on("data", (chunk) => {
                    bodyChunks.push(chunk);
                }).on("end", () => {
                    const body = JSON.parse(Buffer.concat(bodyChunks));
                    if (body) {
                        callback(body.success);
                    } else callback(false);
                });
            });

            req.on("error", (e) => {
                logger.info(`ERROR: ${e.message}`);
            });
        } else callback(false);
    }

    /**
     * Get benine cameras
     * @param callback - callback function
     */
    getCameras(callback) {
        const reqOptions = {
            host: serverAddress,
            path: "/camera/",
            port,
            method: "GET",
        };

        const req = http.get(reqOptions, (res) => {
            const bodyChunks = [];
            res.on("data", (chunk) => {
                bodyChunks.push(chunk);
            }).on("end", () => {
                const body = JSON.parse(Buffer.concat(bodyChunks));

                const cameras = [];

                if (body && body.cameras) {
                    body.cameras.forEach((camera) => {
                        cameras.push({
                            id: camera.id,
                            address: camera.address,
                            streamaddress: camera.streamaddress,
                            type: camera.type
                        });
                    });
                }
                callback(cameras);
            });
        });

        req.on("error", (e) => {
            logger.info(`ERROR: ${e.message}`);
        });
    }

    /**
     * Get benine presets.
     * @param callback - callback function
     */
    getPresets(callback) {
        const reqOptions = {
            host: serverAddress,
            path: "/presets/",
            port,
            method: "GET",
        };

        const req = http.get(reqOptions, (res) => {
            const bodyChunks = [];
            res.on("data", (chunk) => {
                bodyChunks.push(chunk);
            }).on("end", () => {
                const body = JSON.parse(Buffer.concat(bodyChunks));

                const presets = [];

                if (body && body.presets) {
                    body.presets.forEach((preset) => {
                        const imagePath = `http://${serverAddress}:${port}${preset.image}`;
                        presets.push(new Preset(
                            preset.id, preset.name, imagePath, preset.cameraid));
                    });
                }
                callback(presets);
            });
        });

        req.on("error", (e) => {
            logger.info(`ERROR: ${e.message}`);
        });
    }

    /**
     * Get benine presets for one of our own camera's (coupling needed).
     * @param camera - the camera
     * @param callback - callback function
     */
    getPresetsForCamera(camera, callback) {
        if (camera && camera.remoteCameraId >= 0) {
            this.getPresets((presets) => {
                const filteredPresets = presets.filter(
                    preset => preset.cameraId === Number(camera.remoteCameraId));
                callback(filteredPresets);
            });
        } else {
            callback([]);
        }
    }
}

export default BenineHelperInstance;
