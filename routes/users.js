import express from "express";
const router = express.Router(); // eslint-disable-line new-cap

router.post("/picked-user", (req, res) => {
    // eslint-disable-next-line
    req.session.pickedUser = req.body.pickedUser;

    res.json({ success: true });
});

module.exports = router;
