import express from "express";
const router = express.Router(); // eslint-disable-line new-cap

/* GET home page. */
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/user-data", (req, res) => {

});

module.exports = router;
