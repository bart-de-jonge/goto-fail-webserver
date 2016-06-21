import express from "express";
import BenineHelper from "../objects/BenineHelper";9
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

module.exports = router;
