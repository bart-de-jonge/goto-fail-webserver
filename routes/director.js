import express from "express";
const router = express.Router(); // eslint-disable-line new-cap

/* GET director page. */
router.get("/", (req, res) => {
    res.render("director");
});

module.exports = router;
