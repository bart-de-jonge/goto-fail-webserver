import supertest from "supertest";
import app from "../../app.js";
import ProjectManager from "../../objects/ProjectManager.js";
import CameraTimeline from "../../objects/CameraTimeline.js";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Presets", () => {
    it("GET /presets/get-presets", done => {
        request.get("/presets/get-presets")
            .expect(200)
            .expect(res => {
                expect(res.body.presets).to.exist;
            })
            .end(err => done(err));
    });

    it("POST /presets/pairPresetWithShot No Body", done => {
        request.post("/presets/pairPresetWithShot")
            .expect(200)
            .expect(res => {
                expect(res.body.succes).to.be.false;
                expect(res.body.message).to.equal("Not all necessary parameters present");
            })
            .end(err => done(err));
    });

    it("POST /presets/pairPresetWithShot No Shot Id", done => {
        request.post("/presets/pairPresetWithShot")
            .send({ cameraId: 0 })
            .expect(res => {
                expect(res.body.succes).to.be.false;
                expect(res.body.message).to.equal("Not all necessary parameters present");
            })
            .end(err => done(err));
    });

    it("POST /presets/pairPresetWithShot No Preset Id", done => {
        request.post("/presets/pairPresetWithShot")
            .send({ cameraId: "0", shotId: "0" })
            .expect(res => {
                expect(res.body.succes).to.be.false;
                expect(res.body.message).to.equal("Not all necessary parameters present");
            })
            .end(err => done(err));
    });

    it("POST /presets/pairPresetWithShot No Timeline", done => {
        ProjectManager.waitForXML(projectManager => {
            const tempData = projectManager.data.scriptingProject.cameraTimelines[0];
            projectManager.data.scriptingProject.cameraTimelines[0] = null;
            request.post("/presets/pairPresetWithShot")
                .send({ cameraId: "0", shotId: "0", presetId: "2" })
                .expect(res => {
                    expect(res.body.succes).to.be.false;
                    expect(res.body.message).to.equal("Camera unknown");
                })
                .end(err => {
                    projectManager.data.scriptingProject.cameraTimelines[0] = tempData;
                    done(err);
                });
        });
    });

    it("POST /presets/pairPresetWithShot Mismatch Shot", done => {
        ProjectManager.waitForXML(projectManager => {
            const tempData = projectManager.data.scriptingProject.cameraTimelines[0];
            projectManager.data.scriptingProject.cameraTimelines[0] = new CameraTimeline("timeline 1", "1 timeline best timeline", null, 0);
            request.post("/presets/pairPresetWithShot")
                .send({ cameraId: "0", shotId: "0", presetId: "2" })
                .expect(res => {
                    expect(res.body.succes).to.be.false;
                    expect(res.body.message).to.equal("Shot unknown");
                })
                .end(err => {
                    projectManager.data.scriptingProject.cameraTimelines[0] = tempData;
                    done(err);
                });
        });
    })
});
