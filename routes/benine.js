import express from "express";
import BenineHelper from "../objects/BenineHelper";
import CameraShot from "../objects/CameraShot";
import Camera from "../objects/Camera";
import ProjectManager from "../objects/ProjectManager";
9
const router = express.Router(); // eslint-disable-line new-cap

// Get users data
router.get("/get-cameras", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getCameras((cameras) => {
        res.json({ cameras });
    });
});

// Get presets data from benine
router.get("/get-presets", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getPresets((presets) => {
        res.json({ presets });
    });
});

// Get presets data from benine for a certain camera
router.get("/get-presets/:id(\\d+)", (req, res) => {
    ProjectManager.waitForXML((manager) => {
        const camera = manager.data.scriptingProject.cameraList[0].camera[req.params.id];
        if (camera) {
            const benineHelper = new BenineHelper();
            benineHelper.getPresetsForCamera(camera, (presets) => {
                res.json({presets});
            });
        } else {
            res.json({ presets: [], message: "Please provide a camera"});
        }
    });
});

// Test route for recalling presets
router.get("/recallTest", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.recallShot(new CameraShot(0,1,"test","description",false,1,1,[]),    (result) => {
        res.json({ result });
    });
});

// router.post(" /")

module.exports = router;
