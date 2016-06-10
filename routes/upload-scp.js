import express from "express";
const router = new express.Router();
import fs from "fs";
import multipart from "connect-multiparty";
import ProjectManager from "../objects/ProjectManager.js";
const multipartMiddleware = multipart();

router.post("/", multipartMiddleware, (req, res) => {
    const newPath = `${__dirname}/../project-scp-files/project.scp`;

    // Check to facilitate file upload from website as well as Java Application
    let projectObject = req.files.project;
    if (!req.files.project) {
        projectObject = req.files.file;
    }

    if (projectObject && projectObject.name.endsWith(".scp")) {
        fs.rename(projectObject.path, newPath, (err) => {
            if (err) {
                res.json({
                    succes: false, message: "Some error occurred, please try again later!" });
            } else {
                ProjectManager.waitForXML((projectManager) => {
                    projectManager.reloadProject(() => {
                        res.json({ succes: true, message: "Project successfully uploaden!" });
                    });
                });
            }
        });
    } else {
        res.json({ succes: false, message: "Please upload a .scp file." });
    }
});

router.get("/", (req, res) => {
    res.render("upload");
});

module.exports = router;
