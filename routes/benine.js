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

// Get presets data from benine
router.get("/presets/:presetId(\\d+)", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getPresets((presets) => {
        const preset = presets.filter(preset =>
        Number(req.params.presetId) === Number(preset.id))[0];
        res.json({ preset });
    });
});

// Get presets data from benine for a certain camera
// Note the id is for our camera, not benines.
router.get("/cameras/:cameraId(\\d+)/presets", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.cameraId];
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

// Set the presetId on a certain shot in a certain camera
router.post("/cameras/:cameraId(\\d+)/shots/:shotId(\\d+)/set-preset-id", (req, res) => {
    if (req.body.presetId && req.params.cameraId && req.params.shotId) {
        ProjectManager.waitForXML((manager) => {
            const timeline = manager.data.scriptingProject.cameraTimelines[req.params.cameraId];
            if (timeline) {
                const shot = timeline.cameraShots.filter(
                    shot => Number(shot.instance) === Number(req.params.shotId))[0];
                if (shot) {
                    shot.presetId = req.body.presetId;
                    ProjectManager.waitForWriteXML(() => {
                        res.json({ success: true, message: "Preset id successfully saved!" });
                    });
                } else {
                    res.json({ success: false, message: "That's not a valid shot!" });
                }
            } else {
                res.json({ success: false, message: "That's not a valid camera!" });
            }
        });
    } else {
        res.json({ success: false, message: "Please provide a preset id!" });
    }
});

// Set the remote camera id of a certain camera
router.post("/cameras/:cameraId(\\d+)/set-remote-camera-id", (req, res) => {
    if (req.body.remoteCameraId) {
        ProjectManager.waitForXML((manager) => {
            const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.cameraId];
            if (camera) {
                camera.remoteCameraId = req.body.remoteCameraId;
                manager.data.scriptingProject.cameraTimelines[req.params.cameraId]
                    .camera.remoteCameraId = req.body.remoteCameraId;
                ProjectManager.waitForWriteXML(() => {
                    res.json({ success: true, message: "Remote camera id stored successfully!" });
                });
            } else {
                res.json({ success: false, message: "That's not a valid camera!" });
            }
        });
    } else {
        res.json({ success: false, message: "Please provide a preset id!" });
    }
});

// Check if all the camera's are coupled with Benine
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

// CHeck if a certain camera is coupled
router.get("/cameras/:cameraId(\\d+)/coupled", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const cameraList = manager.data.scriptingProject.cameraList[0].camera;
        if (cameraList && req.params.cameraId) {
            if (cameraList[req.params.cameraId]) {
                const result = cameraList[req.params.cameraId] >= 0;
                res.json({ success: true, coupled: result });
            } else {
                res.json({ success: false, message: "That's not a valid camera!" });
            }
        } else {
            res.json({ success: false });
        }
    });
});

module.exports = router;
