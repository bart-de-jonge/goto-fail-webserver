/**
 * Created by Bart on 25/05/2016.
 */
const getMaxCount = function (cameraTimelines) {
    // Get the maxCount of the entire grid
    let maxCount = 0;
    cameraTimelines.forEach((timeline) => {
        if (timeline.cameraShots.length > 0) {
            console.log("here");
            const curEndCount = parseFloat(
                timeline.cameraShots[timeline.cameraShots.length - 1].endCount);
            if (curEndCount > maxCount) {
                maxCount = curEndCount;
            }
        }

        // Set visible property of existing blocks
        timeline.cameraShots.forEach((shot) => {
            shot.visible = "visible";
        });
    });
    return maxCount;
};

(function () {
    class timelineGrid {
        beforeRegister() {
            this.is = "timeline-grid";

            this.properties = {
                name: String,
                timeline_data: Object,
            };
        }
        handleResponse(event) {
            // Setup lists for timelines
            // TODO: find a way to correctly execute this in timeline-element

            // Get data from ajax response
            const responseData = event.detail.response;
            const maxCount = getMaxCount(responseData.cameraTimelines);

            // Setup new data
            const newData = {};
            newData.minCount = 0;
            newData.maxCount = maxCount;
            newData.cameraTimelines = [];


            // Loop over all counts and pad with non-visible blocks where necessary
            responseData.cameraTimelines.forEach(function (timeline, index) {
                // Setup timeline
                const newTimeline = {};
                newTimeline.name = timeline.name;
                newTimeline.description = timeline.description;
                newTimeline.cameraShots = [];
                newData.cameraTimelines[index] = newTimeline;

                // Only do following if at least one block is present
                if (timeline.cameraShots.length > 0) {
                    // Add padding before the first block
                    if (timeline.cameraShots[0].beginCount !== 0) {
                        const newShot = {
                            beginCount: "0",
                            endCount: timeline.cameraShots[0].beginCount,
                            visible: "hidden",
                        };
                        newTimeline.cameraShots.push(newShot);
                    }

                    // Add padding after each consecutive block:
                    timeline.cameraShots.forEach((shot, i) => {
                        newTimeline.cameraShots.push(shot);
                        if (i < timeline.cameraShots.length - 1) {
                            // Not the last block
                            const endCount = (timeline.cameraShots[i + 1].beginCount * 4) / 4;
                            const newShot = {
                                beginCount: shot.endCount,
                                endCount,
                                visible: "hidden",
                            };
                            newTimeline.cameraShots.push(newShot);
                        } else {
                            // The last block
                            if (parseFloat(shot.endCount) !== maxCount) {
                                // There is room leeft in timeline
                                const newShot = {
                                    beginCount: shot.endCount,
                                    endCount: maxCount,
                                    visible: "hidden",
                                };
                                newTimeline.cameraShots.push(newShot);
                            }
                        }
                    });
                } else {
                    // Add one block to fill the timeline
                    const newShot = {
                        beginCount: 0,
                        endCount: maxCount,
                        visible: "hidden",
                    };
                    newTimeline.cameraShots.push(newShot);
                }

                // Set length of blocks
                newTimeline.cameraShots.forEach((shot) => {
                    // 4 = number of blocks per count, 10 is height per block
                    shot.pixelLength = (shot.endCount - shot.beginCount) * 4 * 10;
                });
            });

            // Set data to property
            this.timeline_data = newData;
        }
    }
    Polymer(timelineGrid);
})();