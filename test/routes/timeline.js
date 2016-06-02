import supertest from "supertest";
import fs from "fs";
import app from "../../app.js";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Timeline", () => {
    try {
        fs.accessSync(`${__dirname}/../../project-scp-files/project.scp`, fs.F_OK);

        it("GET /timeline", done => {
            request.get("/timeline")
                .expect(200)
                .end(err => done(err));
        });

        it("GET /timeline/timeline-data", done => {
            request.get("/timeline/timeline-data")
                .expect(200)
                .expect(res => {
                    expect(res.body.cameraTimelines).to.exist;
                    expect(res.body.minCount).to.exist;
                    expect(res.body.maxCount).to.exist;
                })
                .end(err => done(err));
        });

        it("GET /timeline/timeline-filtered-data", done => {
            request.get("/timeline/timeline-filtered-data")
                .send({ pickedTimelines: [] })
                .expect(200)
                .expect(res => {
                    expect(res.body.cameraTimelines).to.exist;
                    expect(res.body.minCount).to.exist;
                    expect(res.body.maxCount).to.exist;
                })
                .end(err => done(err));
        });

    } catch (e) {
        // If no project file, then test bad weather cases
        it("GET /timeline/timeline-data Error Handling", done => {
            request.get("/timeline/timeline-data")
                .expect(200)
                .expect(res => {
                    expect(res.body.succes).to.be.false;
                    expect(res.body.message).to.exist;
                })
                .end(err => done(err));
        });

        it("GET /timeline/timeline-filtered-data", done => {
            request.get("/timeline/timeline-filtered-data")
                .expect(200)
                .expect(res => {
                    expect(res.body.succes).to.be.false;
                    expect(res.body.message).to.exist;
                })
                .end(err => done(err));
        });
    }

    // These should pass regardless of correct project file configuration
    it("POST /timeline/picked-timelines", done => {
        request.post("/timeline/picked-timelines")
            .send({ pickedTimelines: [] })
            .expect(200)
            .expect(res => {
                expect(res.body.success).to.be.true;
            })
            .end(err => done(err));
    });
});
