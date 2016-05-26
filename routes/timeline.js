import express from "express";
import CameraShot from "../objects/CameraShot";
import CameraTimeline from "../objects/CameraTimeline";
import xml2js from "xml2js";
import fs from "fs";
import Camera from "../objects/Camera";
import CameraType from "../objects/CameraType";
const router = new express.Router();
const parser = new xml2js.Parser();

const getCameraType = function getCameraType(XMLObject) {
    return new CameraType(
        XMLObject.name[0],
        XMLObject.description[0],
        XMLObject.movementMargin[0]
    );
};

const getCamera = function getCamera(XMLObject) {
    return new Camera(
        XMLObject.name[0],
        XMLObject.description[0],
        XMLObject.movementMargin[0],
        getCameraType(XMLObject.cameraType[0])
    );
};

// Get timelines from xml
const getTimelines = function getTimelines(callback) {
    // Dummyfile Todo: replace with dynamic
    fs.readFile(`${__dirname}/../project-scp-files/project.scp`, (err, data) => {
        if (err) {
            callback(null, {
                message: "Project File Does Not Exist",
            });
        } else {
            parser.parseString(data, (err, result) => {
                // Read timelines from xml
                const cameraTimelinesXML =
                    result.scriptingProject["camera-centerarea"][0].cameraTimeline;

                const cameraTimelines = [];
                const flattenedCameraTimelines = [];

                // Insert shots in timeline which is pushed to timelinesarray
                // and push to flattenedArray
                cameraTimelinesXML.forEach((timeline) => {
                    // Get camera
                    const camera = getCamera(timeline.camera[0]);

                    // Make cameraTimeline
                    const cameraTimeline = new CameraTimeline(
                        camera.name, camera.description, camera);

                    // Parse and add shots
                    if (typeof timeline.shotList[0].shot !== "undefined") {
                        timeline.shotList[0].shot.forEach(shot => {
                            const cameraShot = new CameraShot(shot.beginCount[0],
                                shot.endCount[0], shot.name[0], shot.description[0]);
                            cameraTimeline.addCameraShot(cameraShot);
                            flattenedCameraTimelines.push(cameraShot);
                        });
                    }
                    cameraTimelines.push(cameraTimeline);
                });
                callback([cameraTimelines, flattenedCameraTimelines]);
            });
        }
    });
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
    getTimelines((timelines, err) => {
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
    getTimelines((timelines, err) => {
        if (err) {
            res.send("Please Upload A Project File Before Editing!");
        } else {
            const cameraTimelines = timelines[0];
            const counts = getMaxAndMinCount(timelines[1]);
            const minCount = counts[0];
            const maxCount = counts[1];
            // Render the timeline.ejs file with the correct variables
            res.render("timeline", {
                cameraTimelines,
                minCount,
                maxCount,
            });
        }
    });
});

module.exports = router;
