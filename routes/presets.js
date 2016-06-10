import express from "express";
const router = new express.Router();
import ProjectManager from "../objects/ProjectManager";


router.get("/get-presets", (req, res) => {
    ProjectManager.waitForPresetUpdates((projectManager) => {
        res.json({ presets: projectManager.presets });
    });
});


module.exports = router;
