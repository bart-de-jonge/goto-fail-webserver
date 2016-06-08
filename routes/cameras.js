import express from "express";
const router = new express.Router();
import ProjectManager from "../objects/ProjectManager";
import http from "http";

const CAMERA_IP = "192.168.0.13";

// Get cameras from xml
// Get timelines from xml
const getCameras = function getCameras(callback) {
    ProjectManager.waitForXML((projectManager) => {
        const data = projectManager.data;
        if (data) {
            callback(projectManager.data.cameraTimelines.cameraTimelines
                .map(timeline => timeline.camera));
        } else {
            callback(null, true);
        }
    });
};

const buildResponse = function buildResponse(res, status, object) {
    res.status(status).json({
        succeeded: (status >= 200 && status < 300),
        object,
    });
};

const buildMessageResponse = function buildMessageResponse(res, status, message) {
    res.status(status).json({
        succeeded: (status >= 200 && status < 300),
        message,
    });
};

router.get("/", (req, res) => {
    getCameras((data, err) => {
        if (err) {
            buildMessageResponse(res, 500, "Unable to load cameras");
        } else {
            buildResponse(res, 200, data);
        }
    });
});

router.get("/:id(\\d+)", (req, res) => {
    let camera;
    getCameras((data, err) => {
        if (err) {
            buildMessageResponse(res, 500, "Unable to load cameras");
        } else {
            camera = data.find(c => req.params.id === c.id);
            if (camera === undefined) {
                buildMessageResponse(res, 404, "Camera not found.");
            } else {
                buildResponse(res, 200, camera);
            }
        }
    });
});

router.post("/save", (req, res) => {
    const id = req.body.preset;
    let route;
    if (Number(id) < 10 && Number(id) > 0) {
        route = `/cgi-bin/aw_ptz?cmd=%23M00${id}&res=1`;
    } else {
        route = `/cgi-bin/aw_ptz?cmd=%23M${id}&res=1`;
    }
    http.get({
        host: CAMERA_IP,
        path: route,
    }, (response) => {
        if (response.statusCode === 200) {
            // Check whether the request was successfull or not
            response.setEncoding("utf8");
            response.on("data", (chunk) => {
                if (chunk.indexOf("S") > -1) {
                    buildMessageResponse(res, 200, `Saved preset ${id}.`);
                } else {
                    buildMessageResponse(res, 504, "Error while saving camera position");
                }
            });
        } else {
            buildMessageResponse(res, 404, "Unable to reach camera.");
        }
    });
});

router.post("/recall", (req, res) => {
    const id = req.body.preset;
    let route;
    if (Number(id) < 10 && Number(id)) {
        route = `/cgi-bin/aw_ptz?cmd=%23R0${id}&res=1`;
    } else {
        route = `/cgi-bin/aw_ptz?cmd=%23R${id}&res=1`;
    }
    http.get({
        host: CAMERA_IP,
        path: route,
    }, (response) => {
        if (response.statusCode === 200) {
            // Check whether the request was successfull or not
            response.setEncoding("utf8");
            response.on("data", (chunk) => {
                if (chunk.indexOf("S") > -1) {
                    buildMessageResponse(res, 200, `Recalled preset ${id}.`);
                } else {
                    buildMessageResponse(res, 504, "Error while recalling camera position");
                }
            });
        } else {
            buildMessageResponse(res, 404, "Unable to reach camera.");
        }
    });
});

router.get("/stop", (req, res) => {
    http.get({
        host: CAMERA_IP,
        path: "/cgi-bin/aw_ptz?cmd=%23PTS5050&res=1",
    }, (response) => {
        if (response.statusCode === 200) {
            buildMessageResponse(res, 200, "Stopped camera");
        } else {
            buildMessageResponse(res, 404, "Unable to reach camera.");
        }
    });
});

router.post("/pan", (req, res) => {
    const body = req.body;
    // Check for missing or incorrect parameters
    if (!body.direction || !body.speed) {
        buildMessageResponse(res, 400, "Request has to contain: direction, speed.");
        return;
    }
    if (body.direction.toLowerCase() !== "left" && body.direction.toLowerCase() !== "right") {
        buildMessageResponse(res, 400,
            `Direction has to be left or right! ${body.direction} is not allowed!`);
        return;
    }
    if (body.speed > 49 || body.speed < 1) {
        buildMessageResponse(res, 400,
            `Speed has to be between 1 and 49. ${body.speed} is not allowed!`);
        return;
    }

    // Send the request to the camera
    const speed = (body.direction.toLowerCase() === "left") ? 50 - body.speed : 50 + body.speed;
    http.get({
        host: CAMERA_IP,
        path: `/cgi-bin/aw_ptz?cmd=%23P${speed}&res=1`,
    }, (response) => {
        if (response.statusCode === 200) {
            buildMessageResponse(res, 200,
                `Camera moving ${body.direction} at speed ${body.speed}.`);
        } else {
            buildMessageResponse(res, 404, "Unable to reach camera.");
        }
    });
});


router.post("/tilt", (req, res) => {
    const body = req.body;
    // Check for incorrect or missing parameters
    if (!body.direction || !body.speed) {
        buildMessageResponse(res, 400, "Request has to contain: direction, speed.");
        return;
    }
    if (body.direction.toLowerCase() !== "up" && body.direction.toLowerCase() !== "down") {
        buildMessageResponse(res, 400,
            `Direction has to be up or down! ${body.direction} is not allowed!`);
        return;
    }
    if (body.speed > 49 || body.speed < 1) {
        buildMessageResponse(res, 400,
            `Speed has to be between 1 and 49. ${body.speed} is not allowed!`);
        return;
    }

    // Send the request to the camera
    const speed = (body.direction.toLowerCase() === "down") ? 50 - body.speed : 50 + body.speed;
    http.get({
        host: CAMERA_IP,
        path: `/cgi-bin/aw_ptz?cmd=%23T${speed}&res=1`,
    }, (response) => {
        if (response.statusCode === 200) {
            buildMessageResponse(res, 200,
                `Camera moving ${body.direction} at speed ${body.speed}.`);
        } else {
            buildMessageResponse(res, 504, "Unable to reach camera.");
        }
    });
});

module.exports = router;
