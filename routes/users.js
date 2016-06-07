import express from "express";
import ProjectManager from "../objects/ProjectManager";
const router = express.Router(); // eslint-disable-line new-cap

// Set picked user
router.post("/picked-user", (req, res) => {
    // eslint-disable-next-line
    req.session.pickedUser = req.body.pickedUser;

    res.json({ success: true });
});

// Get users data
router.get("/get-users", (req, res) => {
    ProjectManager.waitForXML((projectManager) => {
        const data = projectManager.data;
        res.json({
            users: data.users,
        });
    });
});

// Update users data
router.post("/update-users", (req, res) => {
    console.log(req.body.users);
    ProjectManager.waitForXML((projectManager) => {
        const data = projectManager.data;
        data.users = req.body.users;
        res.json({ success: true });
    });
});

module.exports = router;
