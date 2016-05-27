import express from "express";
const router = new express.Router();
import http from "http";

router.get("/save/:id(\\d\\d?)/", (req, res) => {
    let id = req.params.id;
    if (id.length === 1) {
        id = '0' + id;
    }
    http.get({
        host: '192.168.10.101',
        path: '/cgi-bin/aw_ptz?cmd=%23M' + id + '&res=1'
    }, (res) => {
        console.log(res);
    });
    res.json({succes: true, message: "saved preset " + id });
});

router.get("/recall/:id(\\d\\d)/", (req, res) => {
    let id = req.params.id;
    if (id.length === 1) {
        id = '0' + id;
    }
    http.get({
        host: '192.168.10.101',
        path: '/cgi-bin/aw_ptz?cmd=%23R' + id + '&res=1'
    }, (res) => {
        console.log(res);
    });
    res.json({succes: true, message: "recalled preset " + id });
});

module.exports = router;
