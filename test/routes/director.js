import supertest from "supertest";
import app from "../../app.js";
import ProjectManager from "../../objects/ProjectManager";
import DirectorTimeline from "../../objects/DirectorTimeline";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Director", () => {
    it("GET /director", done => {
        request.get("/director")
            .expect(200)
            .end(err => done(err));
    });

    it("GET /director/director-timeline", done => {
        ProjectManager.waitForXML(projectManager => {
            const tempData = projectManager.data;
            const directorTimeline = new DirectorTimeline("The Director's Timeline");
            projectManager.data = {
                scriptingProject: {
                    directorTimeline,
                }
            };

            request.get("/director/director-timeline")
                .expect(200)
                .expect(res => {
                    expect(res.body.success).to.be.true;
                    expect(res.body.directorTimeline).to.deep.equal(directorTimeline);
                })
                .end(err => {
                    projectManager.data = tempData;
                    done(err);
                });
        });
    });

    it("GET /director/director-timeline", done => {
        ProjectManager.waitForXML(projectManager => {
            const tempData = projectManager.data;
            projectManager.data = null;
            request.get("/director/director-timeline")
                .expect(200)
                .expect(res => {
                    expect(res.body.success).to.be.false;
                })
                .end(err => {
                    projectManager.data = tempData;
                    done(err);
                });
        });
    });
});
