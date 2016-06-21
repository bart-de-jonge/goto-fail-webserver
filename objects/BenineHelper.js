import http from "http";
import Preset from "./Preset";

// Singleton Object
let benineHelperInstance = null;
const serverAddress = "localhost";

/*
 * Class for storing a Project
 */
class BenineHelperInstance {

    constructor() {
        if (!benineHelperInstance) {
            benineHelperInstance = this;
        }
        return benineHelperInstance;
    }

    getCameras(callback) {
        const reqOptions = {
            host: serverAddress,
            path: "/camera/",
            port: 8888,
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
                        cameras.push(camera.id);
                    });
                }
                callback(cameras);
            });
        });

        req.on("error", (e) => {
            console.log(`ERROR: ${e.message}`);
        });
    }

    getPresets(callback) {
        const reqOptions = {
            host: serverAddress,
            path: "/presets/",
            port: 8888,
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
                        presets.push(new Preset(preset.id, preset.name, preset.image, preset.cameraid));
                    });
                }
                callback(presets);
            });
        });

        req.on("error", (e) => {
            console.log(`ERROR: ${e.message}`);
        });
    }

    getPresetsForCamera(camera, callback) {
        if (camera && camera.prese)
    }
}

export default BenineHelperInstance;
