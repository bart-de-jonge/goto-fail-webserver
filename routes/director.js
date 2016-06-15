import express from "express";
import ProjectManager from "../objects/ProjectManager.js";
const router = express.Router(); // eslint-disable-line new-cap

/* GET director page. */
router.get("/", (req, res) => {
    res.render("director");
});

router.get("/director-timeline", (req, res) => {
    ProjectManager.waitForXML(projectManager => {
        if (projectManager.data && projectManager.data.scriptingProject) {
            const directorTimeline = projectManager.data.scriptingProject.directorTimeline;
            res.json({
                success: true,
                directorTimeline,
            });
        } else {
            // If there are issues with the data, notify the client
            res.json({
                success: false,
            });
        }
    });
});

module.exports = router;
