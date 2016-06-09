import supertest from "supertest";
import app from "../../app.js";
import ProjectManager from "../../objects/ProjectManager.js";
import fs from "fs";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Cameras", () => {
    try {
        fs.accessSync(`${__dirname}/../../project-scp-files/project.scp`, fs.F_OK);
        
        it("GET /cameras", done => {
            request.get("/cameras")
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body).to.have.property("object");
                })
                .end(err => done(err));
        });

        it("GET /cameras/:id", done => {
            request.get("/cameras/1")
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body).to.have.property("object");
                })
                .end(err => done(err));
        });

        it("GET /cameras/:id Unknown Camera", done => {
            request.get("/cameras/4444440404004040040404")
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Camera not found.");
                })
                .end(err => done(err));
        });
    } catch (e) {
        console.log(e);
    } finally {
        // Most Bad Weather Tests Should Pass Regardless of File Presence

        it("GET /cameras No Data", done => {
            ProjectManager.waitForXML(projectManager => {
                const tempData = projectManager.data;
                projectManager.data = null;
                request.get("/cameras")
                    .expect(500)
                    .expect(res => {
                        expect(res.body.message).to.equal("Unable to load cameras");
                        expect(res.body.succeeded).to.be.false;
                    })
                    .end(err => {
                        projectManager.data = tempData;
                        done(err)
                    });
            });
        });

        it("GET /cameras/:id No Data", done => {
            ProjectManager.waitForXML(projectManager => {
                const tempData = projectManager.data;
                projectManager.data = null;
                request.get("/cameras/1")
                    .expect(500)
                    .expect(res => {
                        expect(res.body.message).to.equal("Unable to load cameras");
                        expect(res.body.succeeded).to.be.false;
                    })
                    .end(err => {
                        projectManager.data = tempData;
                        done(err)
                    });
            });
        });

        it("POST /pan No Body", done => {
            request.post("/cameras/pan")
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Request has to contain: direction, speed.");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /pan No Speed", done => {
            request.post("/cameras/pan")
                .send({ direction: "five" })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Request has to contain: direction, speed.");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /pan Not Left Or Right", done => {
            request.post("/cameras/pan")
                .send({ direction: "five", speed: 12 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Direction has to be left or right! five is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /pan Speed Too High", done => {
            request.post("/cameras/pan")
                .send({ direction: "left", speed: 500 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Speed has to be between 1 and 49. 500 is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /pan Speed Too Low", done => {
            request.post("/cameras/pan")
                .send({ direction: "left", speed: -500 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Speed has to be between 1 and 49. -500 is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /tilt No Body", done => {
            request.post("/cameras/tilt")
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Request has to contain: direction, speed.");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /tilt No Speed", done => {
            request.post("/cameras/tilt")
                .send({ direction: "five" })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Request has to contain: direction, speed.");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /tilt Not Up Or Down", done => {
            request.post("/cameras/tilt")
                .send({ direction: "five", speed: 12 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Direction has to be up or down! five is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /tilt Speed Too High", done => {
            request.post("/cameras/tilt")
                .send({ direction: "up", speed: 500 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Speed has to be between 1 and 49. 500 is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });

        it("POST /tilt Speed Too Low", done => {
            request.post("/cameras/tilt")
                .send({ direction: "up", speed: -500 })
                .expect(400)
                .expect(res => {
                    expect(res.body.message).to.equal("Speed has to be between 1 and 49. -500 is not allowed!");
                    expect(res.body.succeeded).to.be.false;
                })
                .end(err => done(err));
        });
    }
});
