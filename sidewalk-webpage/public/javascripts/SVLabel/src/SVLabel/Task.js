var svl = svl || {};

/**
 * Task constructor
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Task ($) {
    var self = {className: 'Task'},
        properties = {},
        status = {
            auditTaskId: null
        },
        taskSetting,
        previousTasks = [],
        lat, lng;

    function save () {
        svl.storage.set("task", taskSetting);
    }

    function load () {
        var map = svl.storage.get("map");
        taskSetting = svl.storage.get("task");

        if (map) {
            lat = map.latlng.lat;
            lng = map.latlng.lng;
        }
        return taskSetting ? true : false;
    }

    /**
     * Get a next task
     */
    function nextTask (parameters) {
        var streetEdgeId, regionId, url;
        if (!parameters) parameters = {};
        if ("streetEdgeId" in parameters) { streetEdgeId = parameters["streetEdgeId"]; }
        if ("regionId" in parameters) { regionId = parameters["regionId"]; }

        regionId = null;  // Let's keep it simple...

        var len = taskSetting.features[0].geometry.coordinates.length - 1,
            latEnd = taskSetting.features[0].geometry.coordinates[len][1],
            lngEnd = taskSetting.features[0].geometry.coordinates[len][0];
        if (regionId) {
            url = "/audit/task/nextInRegion?regionId=" + regionId;
        } else if (streetEdgeId) {
            url = "/audit/task/next?streetEdgeId=" + streetEdgeId + "&lat=" + latEnd + "&lng=" + lngEnd;
        } else {
            url = "/audit/task";
        }

        $.ajax({
            // async: false,
            // contentType: 'application/json; charset=utf-8',
            url: url,
            type: 'get',
            success: function (task) {
                var len = task.features[0].geometry.coordinates.length - 1,
                    lat1 = task.features[0].geometry.coordinates[0][1],
                    lng1 = task.features[0].geometry.coordinates[0][0],
                    lat2 = task.features[0].geometry.coordinates[len][1],
                    lng2 = task.features[0].geometry.coordinates[len][0],
                    d1 = svl.util.math.haversine(lat1, lng1, latEnd, lngEnd),
                    d2 = svl.util.math.haversine(lat2, lng2, latEnd, lngEnd);

                if (d1 > 10 && d2 > 10) {
                    // If the starting point of the task is far away, jump there.
                    svl.setPosition(lat1, lng1);
                } else if (d2 < d1) {
                    // Flip the coordinates of the line string if the last point is closer to the end point of the current street segment.
                    task.features[0].geometry.coordinates.reverse();
                }
                set(task);
                render();
            },
            error: function (result) {
                throw result;
            }
        });
    }

    function newTask () {
        var url = "/audit/task";
        $.ajax({
            url: url,
            type: 'get',
            success: function (task) {
                var len = task.features[0].geometry.coordinates.length - 1,
                    lat1 = task.features[0].geometry.coordinates[0][1],
                    lng1 = task.features[0].geometry.coordinates[0][0];

                svl.setPosition(lat1, lng1);
                set(task);
                render();
            },
            error: function (result) {
                throw result;
            }
        })
    }

    /**
     * End the current task
     */
    function endTask () {
        // Show the end of the task message.
        svl.statusMessage.animate();
        svl.statusMessage.setCurrentStatusTitle("Great!");
        svl.statusMessage.setCurrentStatusDescription("You have finished auditing accessibility of this street and sidewalks. Keep it up!");
        svl.statusMessage.setBackgroundColor("rgb(254, 255, 223)");

        // Push the data into the list
        previousTasks.push(taskSetting);

        if (!('user' in svl)) {
            // Prompt a user who's not logged in to sign up/sign in.
            svl.popUpMessage.setTitle("You've completed the first accessibility audit!");
            svl.popUpMessage.setMessage("Do you want to create an account to keep track of your progress?");
            svl.popUpMessage.appendButton('<button id="pop-up-message-sign-up-button">Let me sign up!</button>', function () {
                // Store the data in LocalStorage.
                var data = svl.form.compileSubmissionData(),
                    staged = svl.storage.get("staged");
                staged.push(data);
                svl.storage.set("staged", staged);

                $("#sign-in-modal").addClass("hidden");
                $("#sign-up-modal").removeClass("hidden");
                $('#sign-in-modal-container').modal('show');
            });
            svl.popUpMessage.appendButton('<button id="pop-up-message-cancel-button">Nope</button>', function () {
                svl.user = new User({username: 'Anon accessibility auditor'});

                // Submit the data as an anonymous user.
                var data = svl.form.compileSubmissionData();
                svl.form.submit(data);
            });
            svl.popUpMessage.appendHTML('<br /><a id="pop-up-message-sign-in"><small><span style="color: white; text-decoration: underline;">I do have an account! Let me sign in.</span></small></a>', function () {
                var data = svl.form.compileSubmissionData(),
                    staged = svl.storage.get("staged");
                staged.push(data);
                svl.storage.set("staged", staged);

                $("#sign-in-modal").removeClass("hidden");
                $("#sign-up-modal").addClass("hidden");
                $('#sign-in-modal-container').modal('show');
            });
            svl.popUpMessage.setPosition(0, 260, '100%');
            svl.popUpMessage.show(true);
        } else {
            // Submit the data.
            var data = svl.form.compileSubmissionData(),
                staged = svl.storage.get("staged");

            if (staged.length > 0) {
                staged.push(data);
                svl.form.submit(staged);
                svl.storage.set("staged", []);  // Empty the staged data.
            } else {
                svl.form.submit(data);
            }
        }

        var streetEdgeId = getStreetEdgeId(),
            regionId = getRegionId();
        nextTask({streetEdgeId: streetEdgeId, regionId: regionId});
    }

    /**
     * Returns the region id of the current focus.
     */
    function getRegionId () {
        return 61;
    }

    /**
     * Returns the street edge id of the current task.
     */
    function getStreetEdgeId () {
        return taskSetting.features[0].properties.street_edge_id
    }

    /**
     * Returns the task start time
     */
    function getTaskStart () {
        return taskSetting.features[0].properties.task_start;
    }

    /**
     * Set an audit task id
     * @param asgId
     */
    function setAuditTaskId(auditTaskId) {
        status.auditTaskId = auditTaskId;
    }

    /**
     * Get an audit task id
     * @returns {null}
     */
    function getAuditTaskId() {
        return status.auditTaskId;
    }

    /**
     * Returns the starting location
     */
    function initialLocation() {
        if (taskSetting) {
            return {
                lat: lat,
                lng: lng
            }
        }
    }

    /**
     * This method checks if the task is done or not by assessing the
     * current distance and the ending distance.
     */
    function isAtEnd (lat, lng, threshold) {
        if (taskSetting) {
            var len = taskSetting.features[0].geometry.coordinates.length - 1,
                latEnd = taskSetting.features[0].geometry.coordinates[len][1],
                lngEnd = taskSetting.features[0].geometry.coordinates[len][0],
                d;

            if (!threshold) {
                threshold = 10; // 10 meters
            }

            d = svl.util.math.haversine(lat, lng, latEnd, lngEnd);

            console.debug('Distance to the end:' , d);

            // Submit data after a while even before the task is complete, because you can get 413 error due to data overload
            // http://www.checkupdown.com/status/E413.html
            var actionCapacityThreshold = 150,
                labelCapacityThreshold = 50;
            if (svl.tracker.getActions().length > actionCapacityThreshold ||
                    svl.labelContainer.getCurrentLabels().length > labelCapacityThreshold) {
                var data = svl.form.compileSubmissionData();
                svl.form.submit(data);
            }

            return d < threshold;
        }
    }

    /**
     *
     * Reference: https://developers.google.com/maps/documentation/javascript/shapes#polyline_add
     */
    function render() {
        if ('map' in svl && google) {
            var gCoordinates = taskSetting.features[0].geometry.coordinates.map(function (coord) {
                return new google.maps.LatLng(coord[1], coord[0]);
            });
            var path = new google.maps.Polyline({
                path: gCoordinates,
                geodesic: true,
                strokeColor: '#00FF00',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            path.setMap(svl.map.getMap())
        }
    }

    /**
     * This method takes a task parameters in geojson format.
     */
    function set(json) {
        setAuditTaskId(null);
        taskSetting = json;
        lat = taskSetting.features[0].geometry.coordinates[0][1];
        lng = taskSetting.features[0].geometry.coordinates[0][0];
    }

    self.endTask = endTask;
    self.getStreetEdgeId = getStreetEdgeId;
    self.getTaskStart = getTaskStart;
    self.getAuditTaskId = getAuditTaskId;
    self.setAuditTaskId = setAuditTaskId;
    self.load = load;
    self.set = set;
    self.initialLocation = initialLocation;
    self.isAtEnd = isAtEnd;
    self.render = render;
    self.save = save;
    self.nextTask = nextTask;
    self.newTask = newTask;
    return self;
}
