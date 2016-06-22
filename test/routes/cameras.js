import supertest from "supertest";
import app from "../../app.js";
import ProjectManager from "../../objects/ProjectManager.js";
import fs from "fs";
import sinon from "sinon";
import http from "http";
import { PassThrough } from "stream";
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

        it("POST /pan left", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Success");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/pan")
                .send({ direction: "left", speed: 23})
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Camera moving left at speed 23.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /pan right", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Success");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/pan")
                .send({ direction: "right", speed: 23})
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Camera moving right at speed 23.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /pan Unreachable Camera", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 404;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/pan")
                .send({ direction: "left", speed: 23})
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Unable to reach camera.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /tilt up", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Success");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/tilt")
                .send({ direction: "up", speed: 23})
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Camera moving up at speed 23.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /tilt down", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Success");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/tilt")
                .send({ direction: "down", speed: 23})
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Camera moving down at speed 23.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /tilt Unreachable Camera", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 404;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/tilt")
                .send({ direction: "down", speed: 23})
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Unable to reach camera.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
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

        it("POST /save", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("S");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/save")
                .send({ preset: 1 })
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Saved preset 1.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /save high ID", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("S");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/save")
                .send({ preset: 15 })
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Saved preset 15.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /save Response Error", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/save")
                .send({ preset: 15 })
                .expect(504)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Error while saving camera position");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /save Unreachable Camera", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 404;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/save")
                .send({ preset: 15 })
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Unable to reach camera.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /recall", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("S");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/recall")
                .send({ preset: 1 })
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Recalled preset 1.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /recall high ID", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("S");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/recall")
                .send({ preset: 15 })
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Recalled preset 15.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /save Response Error", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/recall")
                .send({ preset: 15 })
                .expect(504)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Error while recalling camera position");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("POST /recall Unreachable Camera", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 404;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.post("/cameras/recall")
                .send({ preset: 15 })
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Unable to reach camera.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("GET /stop", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Stopped");
            response.statusCode = 200;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.get("/cameras/stop")
                .expect(200)
                .expect(res => {
                    expect(res.body.succeeded).to.be.true;
                    expect(res.body.message).to.equal("Stopped camera");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });

        it("GET /stop Unreachable Camera", done => {
            const get = sinon.stub(http, "get");
            const response = new PassThrough();
            response.write("Failed");
            response.statusCode = 404;
            response.end();

            const req = new PassThrough();
            get.callsArgWith(1, response)
                .returns(req);

            request.get("/cameras/stop")
                .expect(404)
                .expect(res => {
                    expect(res.body.succeeded).to.be.false;
                    expect(res.body.message).to.equal("Unable to reach camera.");
                })
                .end(err => {
                    http.get.restore();
                    done(err);
                });
        });
    }
});
