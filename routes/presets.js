import express from "express";
const router = new express.Router();
import ProjectManager from "../objects/ProjectManager";


router.get("/get-presets", (req, res) => {
    ProjectManager.waitForPresetUpdates((projectManager) => {
        res.json({ presets: projectManager.presets });
    });
});

router.post("/pairPresetWithShot", (req, res) => {
    const cameraId = req.body.cameraId;
    const shotId = req.body.shotId;
    const presetId = req.body.presetId;

    if (!cameraId || !shotId || !presetId) {
        res.json({ succes: false, message: "Not all necessary parameters present" });
    } else {
        ProjectManager.waitForXML((projectManager) => {
            const timeline = projectManager.data.scriptingProject.cameraTimelines[cameraId];
            if (timeline && timeline.cameraShots) {
                const shot = timeline.cameraShots.find(shot => shot.instance === shotId);
                if (shot) {
                    shot.presetId = presetId;
                    ProjectManager.waitForWriteXML(() => {
                        res.json({ succes: true, message: "Preset-camera pair saved" });
                    });
                } else {
                    res.json({ succes: false, message: "Shot unknown" });
                }
            } else {
                res.json({ succes: false, message: "Camera unknown", timeline });
            }
        });
    }
});


module.exports = router;
