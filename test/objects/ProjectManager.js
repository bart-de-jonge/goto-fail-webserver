import ProjectManager from "../../objects/ProjectManager.js";
import { expect } from "chai";
import fs from "fs";

describe("ProjectManager Creation", () => {
    it("Should be able to create a ProjectManager object", done => {
        const projectManager = new ProjectManager();
        expect(projectManager).to.not.be.null;
        done();
    });

    try {
        fs.accessSync(`${__dirname}/../../project-scp-files/project.scp`, fs.F_OK);

        it("Should be able to initialize data from scripting project file", done => {
            ProjectManager.waitForXML(projectManager => {
                expect(projectManager.data).to.not.be.null;
                done();
            });
        });

        it("Can Reload The Project Manager", done => {
            ProjectManager.waitForXML(projectManager => {
                projectManager.data = null;
                projectManager.reloadProject((projectManager) => {
                    expect(projectManager.data).to.not.be.null;
                    done();
                });
            });
        });
    } catch (e) {
        // Then the file doesn't exist, so test for null data
        it("Should not fatally crash on missing project file", done => {
            ProjectManager.waitForXML(projectManager => {
                expect(projectManager.data).to.be.null;
                done();
            });
        });
    } finally {
        it("Can Handle Empty User XML", done => {
            ProjectManager.waitForXML(projectManager => {
                const userArray = projectManager.getUsersFromXML();
                expect(userArray).to.eql([]);
                done();
            });
        });

        it("Can Parse Users From XML", done => {
            const xmlObject = [
                {
                    user: [{
                        chosenTimelines: [{ chosenTimeline: ["0", "1"] }],
                        name: ["John"],
                        roleValue: ["1"],
                    }],
                }
            ];
            ProjectManager.waitForXML(projectManager => {
                const users = projectManager.getUsersFromXML(xmlObject);
                expect(users).to.not.be.empty;
                done();
            });
        });
    }
});

describe("ProjectManager Async", () => {
    try {
        fs.accessSync(`${__dirname}/../../project-scp-files/project.scp`, fs.F_OK);

        before(done => {
            // Ensure Project Data Loaded Before Running Tests
            ProjectManager.waitForXML(projectManager => done());
        });
        
        it("Should return a Singleton Object", done => {
            const projectManager1 = new ProjectManager();
            const projectManager2 = new ProjectManager();
            expect(projectManager1).to.equal(projectManager2);
            done();
        });

        it("Should be able to filter timelines", done => {
            const projectManager = new ProjectManager();
            const filteredTimelines = projectManager.filterTimelines([0], projectManager.data);
            expect(filteredTimelines.scriptingProject.cameraTimelines).to.not.be.empty;
            done();
        });
    } catch (e) {
        // Can't run tests on empty data, so unfortunately do nothing here
    }
});
