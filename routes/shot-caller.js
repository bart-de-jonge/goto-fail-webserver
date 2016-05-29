import express from "express";
const router = express.Router(); // eslint-disable-line new-cap

/* GET shot caller page. */
router.get("/", (req, res) => {
    res.render("shotCaller");
});

module.exports = router;
