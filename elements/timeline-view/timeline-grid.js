const getMaxCount = function getMaxCount(cameraTimelines) {
    // Get the maxCount of the entire grid
    let maxCount = 0;
    cameraTimelines.forEach((timeline) => {
        if (timeline.cameraShots.length > 0) {
            const curEndCount = parseFloat(
                timeline.cameraShots[timeline.cameraShots.length - 1].endCount);
            if (curEndCount > maxCount) {
                maxCount = curEndCount;
            }
        }

        // Set visible property of existing blocks
        timeline.cameraShots.forEach((shot) => {
            // eslint-disable-next-line
            shot.visible = "visible";
        });
    });
    return maxCount;
};

/*
 * Add padding to the first block of the timeline
 * and add it to the new timeline
 */
const addFrontPadding = function addFrontPadding(timeline, newTimeline) {
    if (timeline.cameraShots[0].beginCount !== 0) {
        const newShot = {
            beginCount: "0",
            endCount: timeline.cameraShots[0].beginCount,
            visible: "hidden",
        };
        newTimeline.cameraShots.push(newShot);
    }
};

/*
 * Add padding blocks after each block.
 */
const addTrailingPadding = function addTrailingPadding(timeline, newTimeline, maxCount) {
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
};

class timelineGrid {
    beforeRegister() {
        this.is = "timeline-grid";

        this.properties = {
            name: String,
            timeline_data: Object,
            currentCount: {
                type: Number,
                value: 0,
                notify: true,
                observer: "_countChanged",
            },
        };

        this.prevTop = 22;
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
        responseData.cameraTimelines.forEach((timeline, index) => {
            // Setup timeline
            const newTimeline = {};
            newTimeline.name = timeline.name;
            newTimeline.description = timeline.description;
            newTimeline.cameraShots = [];
            newData.cameraTimelines[index] = newTimeline;

            // Only do following if at least one block is present
            if (timeline.cameraShots.length > 0) {
                // Add padding blocks
                addFrontPadding(timeline, newTimeline);
                addTrailingPadding(timeline, newTimeline, maxCount);
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
                // eslint-disable-next-line
                shot.pixelLength = (shot.endCount - shot.beginCount) * 4 * 10;
            });
        });

        // Set data to property
        this.timeline_data = newData;
    }

    _countChanged(newCount) {
        if (newCount >= 0) {
            // eslint-disable-next-line no-undef
            const timeDiv = Polymer.dom(this.root).querySelector("div.timeline-grid");
            // eslint-disable-next-line no-undef
            const scrollLine = Polymer.dom(timeDiv).querySelector("#scrolling-box");

            const newTop = 40 * newCount + this.prevTop;
            this.scrollDown(scrollLine, newTop);
        }
    }

    scrollDown(scrollLine, newTop) {
        // eslint-disable-next-line no-undef
        Velocity(scrollLine, { // eslint-disable-line new-cap
            top: newTop,
        },
            {
                duration: 0,
                easing: "linear",
            });
        // eslint-disable-next-line no-undef
        Velocity(scrollLine, // eslint-disable-line new-cap
            "scroll",
            {
                offset: -200,
                queue: false,
                duration: 0,
                easing: "linear",
            });
    // }
    }
}
// eslint-disable-next-line
Polymer(timelineGrid);

