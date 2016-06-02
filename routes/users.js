import express from "express";
import User from "../objects/User";
const router = express.Router(); // eslint-disable-line new-cap

router.post("/picked-user", (req, res) => {
    // eslint-disable-next-line
    req.session.pickedUser = req.body.pickedUser;

    res.json({ success: true });
});

router.get("/get-users", (req, res) => {
    res.json({ users: [
        new User(0, "Jan", [0, 1], 0),
        new User(1, "Klaas", [0, 2], 0),
        new User(2, "Piet", [], 1),
    ] });
});

module.exports = router;
