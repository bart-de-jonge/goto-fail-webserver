import express from "express";
import ProjectManager from "../objects/ProjectManager";
const router = new express.Router();

router.get("/", (req, res) => {
    res.render("coupling");
});

module.exports = router;
