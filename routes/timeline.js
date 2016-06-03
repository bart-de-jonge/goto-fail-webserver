import express from "express";
import ProjectManager from "../objects/ProjectManager";
const router = new express.Router();

// Get timelines from xml
const getTimelines = function getTimelines(user, filtered, callback) {
    ProjectManager.waitForXML((projectManager) => {
        const data = projectManager.data;
        if (data) {
            if (filtered && typeof user !== "undefined") {
                callback(projectManager.filterTimelines(data.users[user].pickedTimelines, data.cameraTimelines));
            } else {
                callback(projectManager.data.cameraTimelines);
            }
        } else {
            callback(null, true);
        }
    });
};

router.get("/timeline-data", (req, res) => {
    getTimelines(req.session.pickedTimelines, false, (data, err) => {
        if (err) {
            res.json({
                succes: false,
                message: "Please Upload A Project File Before Editing!",
            });
        } else {
            res.json({
                cameraTimelines: data.cameraTimelines,
                minCount: data.minCount,
                maxCount: data.maxCount,
            });
        }
    });
});

router.get("/timeline-filtered-data", (req, res) => {
    getTimelines(req.session.pickedUser, true, (data, err) => {
        if (err) {
            res.json({
                succes: false,
                message: "Please Upload A Project File Before Editing!",
            });
        } else {
            res.json({
                cameraTimelines: data.cameraTimelines,
                minCount: data.minCount,
                maxCount: data.maxCount,
            });
        }
    });
});

/* GET home page. */
router.get("/", (req, res) => {
    // Get the timelines
    // Render the timeline.ejs file with the correct variables
    res.render("timeline");
});

router.post("/picked-timelines", (req, res) => {
    // eslint-disable-next-line
    req.session.pickedTimelines = req.body.pickedTimelines;

    res.json({ success: true });
});

module.exports = router;
