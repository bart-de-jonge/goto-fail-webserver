import express from "express";
import XMLHelper from "../objects/XMLHelper";
const router = new express.Router();


// Get timelines from xml
const getTimelines = function getTimelines(pickedTimelines, filtered, callback) {
    // Dummyfile Todo: replace with dyn0amic
    const xmlHelper = new XMLHelper();
    function waitForXML() {
        if (!xmlHelper.initialized) {
            setTimeout(waitForXML, 10);
        } else {
            callback([xmlHelper.data.cameraTimelines, xmlHelper.data.flattenedCameraTimelines]);
        }
    }
    waitForXML();
};

// Get max and mincount of an array of shots
const getMaxAndMinCount = function getMaxAndMinCount(flattenedCameraTimelines) {
    // Calculate minimum and maximum counts
    let minCount = 0;
    let maxCount = 0;
    if (flattenedCameraTimelines.length > 0) {
        minCount = Number(flattenedCameraTimelines[0].beginCount);
        maxCount = Number(flattenedCameraTimelines[0].endCount);
        flattenedCameraTimelines.forEach(shot => {
            if (shot.beginCount < minCount) {
                minCount = Number(shot.beginCount);
            }
            if (shot.endCount > maxCount) {
                maxCount = Number(shot.endCount);
            }
        });
    }

    return [minCount, maxCount];
};

router.get("/timeline-data", (req, res) => {
    getTimelines(req.session.pickedTimelines, false, (timelines, err) => {
        if (err) {
            res.json({
                succes: false,
                message: "Please Upload A Project File Before Editing!",
            });
        } else {
            const cameraTimelines = timelines[0];
            const counts = getMaxAndMinCount(timelines[1]);
            const minCount = counts[0];
            const maxCount = counts[1];
            res.json({
                cameraTimelines,
                minCount,
                maxCount });
        }
    });
});

router.get("/timeline-filtered-data", (req, res) => {
    getTimelines(req.session.pickedTimelines, true, (timelines, err) => {
        if (err) {
            res.json({
                succes: false,
                message: "Please Upload A Project File Before Editing!",
            });
        } else {
            const cameraTimelines = timelines[0];
            const counts = getMaxAndMinCount(timelines[1]);
            const minCount = counts[0];
            const maxCount = counts[1];
            res.json({
                cameraTimelines,
                minCount,
                maxCount });
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
    req.session.pickedTimelines = req.body.pickedTimelines;
    // res.redirect("/timeline");
    res.json({ success: true });
});

module.exports = router;
