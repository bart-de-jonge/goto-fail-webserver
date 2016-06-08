import express from "express";
const router = express.Router(); // eslint-disable-line new-cap

/* GET shot caller page. */
router.get("/", (req, res) => {
    res.render("cameraControl");
});

module.exports = router;
