import express from "express";
const router = new express.Router();
import ProjectManager from "../objects/ProjectManager";
import http from "http";

const CAMERA_IP = "192.168.0.13";

// Get cameras from xml
// Get timelines from xml
const getCameras = function getTimelines(callback) {
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

router.get("/", (req, res) => {
    getCameras((data, err) => {
        if (err) {
            res.status(500).json({
                message: "Unable to load cameras!",
            });
        } else {
            res.status(200).json({
                succeeded: true,
                cameras: data,
            });
        }
    });
});

router.get("/:id(\\d+)", (req, res) => {
    let camera;
    getCameras((data, err) => {
        if (err) {
            res.status(500).json({
                succeeded: false,
                message: "Unable to load cameras.",
            });
        } else {
            camera = data.find(c => req.params.id === c.id);
            if (camera === undefined) {
                res.status(404).json({
                    succeeded: false,
                    message: "Camera not found.",
                });
            } else {
                res.status(200).json({
                    succeeded: true,
                    object: camera,
                });
            }
        }
    });
});

router.post("/save", (req, res) => {
    const id = req.body.preset;
    let route;
    if (Number(id) < 10) {
        route = `/cgi-bin/aw_ptz?cmd=%23M00${id}&res=1`;
    } else {
        route = `/cgi-bin/aw_ptz?cmd=%23M${id}&res=1`;
    }
    http.get({
        host: CAMERA_IP,
        path: route,
    }, (response, err) => {
        response.setEncoding("utf8");
        response.on("data", (chunk) => console.log(chunk));
        if (response.statusCode === 200) {
            res.status(200).json({
                succeeded: true,
                message: `Saved preset ${id}.`,
            });
        } else {
            res.status(504).json({
                message: `Unable to save preset ${id}.`,
                error: err,
            });
        }
    });
});

router.post("/recall", (req, res) => {
    const id = req.body.preset;
    let route;
    if (Number(id) < 10) {
        route = `/cgi-bin/aw_ptz?cmd=%23R0${id}&res=1`;
    } else {
        route = `/cgi-bin/aw_ptz?cmd=%23R${id}&res=1`;
    }
    http.get({
        host: CAMERA_IP,
        path: route,
    }, (response, err) => {
        response.setEncoding("utf8");
        response.on("data", (chunk) => console.log(chunk));
        if (response.statusCode === 200) {
            res.status(200).json({
                succeeded: true,
                message: `Recalled preset ${id}.`,
            });
        } else {
            res.status(504).json({
                message: `Unable to recall preset ${id}.`,
                error: err,
            });
        }
    });
});

router.get("/stop", (req, res) => {
    http.get({
        host: CAMERA_IP,
        path: "/cgi-bin/aw_ptz?cmd=%23PTS5050&res=1",
    }, (response, err) => {
        if (response.statusCode === 200) {
            res.status(200).json({
                succeeded: true,
                message: "Stopped camera.",
            });
        } else {
            res.status(504).json({
                message: "Unable to stop camera.",
                error: err,
            });
        }
    });
});

router.post("/pan", (req, res) => {
    const body = req.body;
    if (!body.direction || !body.speed) {
        res.status(400).json({
            message: "Request has to contain: direction, speed." });
        return;
    }
    if (body.direction.toLowerCase() !== "left" && body.direction.toLowerCase() !== "right") {
        res.status(400).json({
            message: `Direction has to be left or right! ${body.direction} is not allowed!`,
        });
        return;
    }
    if (body.speed > 49 || body.speed < 1) {
        res.status(400).json({
            message: `Speed has to be between 1 and 49. ${body.speed} is not allowed!`,
        });
        return;
    }

    const speed = (body.direction.toLowerCase() === "left") ? 50 - body.speed : 50 + body.speed;
    http.get({
        host: CAMERA_IP,
        path: `/cgi-bin/aw_ptz?cmd=%23P${speed}&res=1`,
    }, (response, err) => {
        if (response.statusCode === 200) {
            res.status(200).json({
                succeeded: true,
                message: `Camera moving ${body.direction} at speed ${body.speed}.`,
            });
        } else {
            res.status(504).json({
                message: "Unable to move camera.",
                error: err,
            });
        }
    });
});


router.post("/tilt", (req, res) => {
    const body = req.body;
    if (!body.direction || !body.speed) {
        res.status(400).json({
            message: "Request has to contain: direction, speed.",
        });
        return;
    }
    if (body.direction.toLowerCase() !== "up" && body.direction.toLowerCase() !== "down") {
        res.status(400).json({
            message: `Direction has to be up or down! ${body.direction} is not allowed!`,
        });
        return;
    }
    if (body.speed > 49 || body.speed < 1) {
        res.status(400).json({
            message: `Speed has to be between 1 and 49. ${body.speed} is not allowed!`,
        });
        return;
    }

    const speed = (body.direction.toLowerCase() === "down") ? 50 - body.speed : 50 + body.speed;
    http.get({
        host: CAMERA_IP,
        path: `/cgi-bin/aw_ptz?cmd=%23T${speed}&res=1`,
    }, (response, err) => {
        if (response.statusCode === 200) {
            res.status(200).json({
                succeeded: true,
                message: `Camera moving ${body.direction} at speed ${body.speed}.`,
            });
        } else {
            res.status(504).json({
                message: "Unable to move camera.",
                error: err,
            });
        }
    });
});

module.exports = router;
