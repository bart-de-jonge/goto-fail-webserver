import express from "express";
import BenineHelper from "../objects/BenineHelper";
import CameraShot from "../objects/CameraShot";
import ProjectManager from "../objects/ProjectManager";

const router = express.Router(); // eslint-disable-line new-cap

// Get users data
router.get("/cameras", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getCameras((cameras) => {
        res.json({ cameras });
    });
});

// Get presets data from benine
router.get("/presets", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getPresets((presets) => {
        res.json({ presets });
    });
});

// Get presets data from benine for a certain camera
// Note the id is for our camera, not benines.
router.get("/cameras/:id(\\d+)/presets", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.id];
        if (camera) {
            const benineHelper = new BenineHelper();
            benineHelper.getPresetsForCamera(camera, (presets) => {
                res.json({ presets });
            });
        } else {
            res.json({ presets: [], message: "Please provide a camera" });
        }
    });
});

// Test route for recalling presets
router.get("/recallTest", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.recallShot(
        new CameraShot(0, 1, "test", "description", false, 1, 1, []), (result) => {
            res.json({ result });
        });
});

router.post("/cameras/:id(\\d+)/set-remote-camera-id", (req, res) => {
    if (req.body.remoteCameraId) {
        ProjectManager.waitForXML((manager) => {
            const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.id];
            if (camera) {
                camera.presetId = req.body.presetId;
                res.json({ success: true, message: "Preset id stored successfully!" });
            }
            res.json({ success: false, message: "That's not a valid camera!" });
        });
    }
    res.json({ success: false, message: "Please provide a remote camera id!" });
});

router.post("/cameras/:id(\\d+)/set-preset-id", (req, res) => {
    if (req.body.presetId) {
        ProjectManager.waitForXML((manager) => {
            const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.id];
            if (camera) {
                camera.remoteCameraId = req.body.remoteCameraId;
                res.json({ success: true, message: "Remote camera id stored successfully!" });
            }
            res.json({ success: false, message: "That's not a valid camera!" });
        });
    }
    res.json({ success: false, message: "Please provide a preset id!" });
});

router.get("/coupled", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const cameraList = manager.data.scriptingProject.cameraList[0].camera;
        if (cameraList) {
            let result = true;
            cameraList.forEach((camera) => {
                if (camera.remoteCameraId < 0) {
                    result = false;
                }
            });
            res.json({ success: true, coupled: result });
        } else {
            res.json({ success: false });
        }
    });
});

router.get("/coupled/:id(\\d+)", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const cameraList = manager.data.scriptingProject.cameraList[0].camera;
        if (cameraList) {
            let result = true;
            cameraList.forEach((camera) => {
                if (camera.remoteCameraId < 0) {
                    result = false;
                }
            });
            res.json({ success: true, coupled: result });
        } else {
            res.json({ success: false });
        }
    });
});

module.exports = router;
