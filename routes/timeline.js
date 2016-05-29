import express from "express";
import ProjectManager from "../objects/ProjectManager";
const router = new express.Router();

// Get timelines from xml
const getTimelines = function getTimelines(pickedTimelines, filtered, callback) {
    // Dummyfile Todo: replace with dyn0amic
    const projectManager = new ProjectManager();
    function waitForXML() {
        if (!projectManager.initialized) {
            setTimeout(waitForXML, 10);
        } else {
            const data = projectManager.data;
            if (filtered && typeof pickedTimelines !== "undefined") {
                callback(projectManager.filterTimelines(pickedTimelines, data));
            } else {
                callback(projectManager.data);
            }
        }
    }
    waitForXML();
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
    getTimelines(req.session.pickedTimelines, true, (data, err) => {
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
