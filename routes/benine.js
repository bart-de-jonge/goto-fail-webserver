import express from "express";
import BenineHelper from "../objects/BenineHelper";
import CameraShot from "../objects/CameraShot";
import Camera from "../objects/Camera";
9
const router = express.Router(); // eslint-disable-line new-cap

// Get users data
router.get("/get-cameras", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getCameras((cameras) => {
        res.json({ cameras });
    });
});

// Get users data
router.get("/get-presets", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getPresets((presets) => {
        res.json({ presets });
    });
});

// Get users data
router.get("/get-presets-for-camera", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.getPresetsForCamera(new Camera("", "", null, 0, 0, "", 2), (presets) => {
        res.json({ presets });
    });
});

router.get("/recallTest", (req, res) => {
    const benineHelper = new BenineHelper();
    benineHelper.recallShot(new CameraShot(0,1,"test","description",false,1,1,[]),    (result) => {
        res.json({ result });
    });
});

module.exports = router;
