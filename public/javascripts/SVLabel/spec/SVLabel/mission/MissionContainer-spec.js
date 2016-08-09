describe("MissionContainer module.", function () {
    var missionContainer;
    var missionFactory;
    var missionStatus;
    var missionModel;

    beforeEach(function () {
        missionStatus = {};
        missionModel = _.clone(Backbone.Events);
        missionModel.submitMissions = function (missions) { };
        missionFactory = new MissionFactory(missionModel);
        missionContainer = new MissionContainer(missionStatus, missionModel);
        missionContainer.refresh();

    });

    describe("in response to events", function () {
        var missionMock;
        beforeEach(function () {
        });

        it("should add the completed mission to `completedMissions`", function (done) {
            missionMock = { test: "test" };
            missionModel.trigger("MissionProgress:complete", missionMock);

            var missions = missionContainer.getCompletedMissions();
            expect(missions).toEqual([missionMock]);

            expect(missions.length).toBe(1);
            done();
        });

        it("should add completed missions to `completedMissions`", function () {
            var missions;
            missionMock = new MissionMock();
            missionMock.setProperty('isCompleted', true);
            missionModel.trigger("MissionContainer:addAMission", missionMock);

            missions = missionContainer.getCompletedMissions();
            expect(missions.length).toBe(1);

            missionMock = new MissionMock();
            missionMock.setProperty('isCompleted', true);
            missionModel.trigger("MissionContainer:addAMission", missionMock);

            missions = missionContainer.getCompletedMissions();
            expect(missions.length).toBe(2);

            missionMock = new MissionMock();
            missionMock.setProperty('isCompleted', false);
            missionModel.trigger("MissionContainer:addAMission", missionMock);

            missions = missionContainer.getCompletedMissions();
            expect(missions.length).toBe(2);

        });

    });
/*
    describe("`add` method", function(){
        it("should be able to add a new mission to the container", function() {
            var m1 = missionFactory.create(1, 1, "distance-mission", 1, 1000, 1000, 1, 0.1, false);
            var m2 = missionFactory.create(1, 2, "distance-mission", 2, 2000, 2000, 2, 0.2, false);
            missionContainer.add(1, m1);
            missionContainer.add(1, m2);
            var missions = missionContainer.getMissionsByRegionId(1);
            expect(missions.length).toBe(2);

            var m3 = missionFactory.create(0, 3, "test1", 1, 1000, 1000, 1, 0.1, false);
            missionContainer.add(0, m3);
            missions = missionContainer.getMissionsByRegionId(0);
            expect(missions.length).toBe(1);
        });

        it("should check duplicate", function () {
            var m1 = missionFactory.create(1, 1, "distance-mission", 1, 1000, 1000, 1, 0.1, false);
            var m2 = missionFactory.create(1, 1, "distance-mission", 1, 1000, 1000, 1, 0.1, false);
            missionContainer.add(1, m1);
            missionContainer.add(1, m2);
            var missions = missionContainer.getMissionsByRegionId(1);
            expect(missions.length).toBe(1);
        });
    });

    describe("`_onLoadComplete` method", function () {
        var m1, m2, m3;
        beforeEach(function () {
            m1 = new MissionMock();
            m1.properties.missionId = 1;
            m1.properties.coverrage = 0.25;
            m1.properties.distance = 4023.36;
            m1.properties.distanceFt = 13200;
            m1.properties.distanceMi = 2.5;
            m1.properties.label = 'distance-mission';

            m2 = new MissionMock();
            m2.properties.missionId = 2;
            m2.properties.coverrage = 0.50;
            m2.properties.distance = 8046.72;
            m2.properties.distanceFt = 26400;
            m2.properties.distanceMi = 5;
            m2.properties.label = 'distance-mission';

            m3 = new MissionMock();
            m3.properties.missionId = 3;
            m3.properties.coverrage = 1.0;
            m3.properties.distance = 16093.4;
            m3.properties.distanceFt = 52800;
            m3.properties.distanceMi = 10;
            m3.properties.label = 'coverage-mission';
        });

        it("should set the `auditDistance` property for all missions", function () {
            missionContainer.add(1, m1);
            missionContainer.add(1, m2);
            missionContainer.add(1, m3);

            missionContainer._onLoadComplete();

            expect(m1.properties.auditDistance).toBeCloseTo(4023.36, 0.1);
            expect(m2.properties.auditDistance).toBeCloseTo(4023.36, 0.1);
            expect(m3.properties.auditDistance).toBeCloseTo(8046.68, 0.1);
        });

        it("should set the `auditDistanceFt` property for all missions", function () {
            missionContainer.add(1, m1);
            missionContainer.add(1, m2);
            missionContainer.add(1, m3);

            missionContainer._onLoadComplete();

            expect(m1.properties.auditDistanceFt).toBeCloseTo(13200, 0.1);
            expect(m2.properties.auditDistanceFt).toBeCloseTo(13200, 0.1);
            expect(m3.properties.auditDistanceFt).toBeCloseTo(26400, 0.1);
        });

        it("should set the `auditDistanceMi` property for all missions", function () {
            missionContainer.add(1, m1);
            missionContainer.add(1, m2);
            missionContainer.add(1, m3);

            missionContainer._onLoadComplete();

            expect(m1.properties.auditDistanceMi).toBeCloseTo(2.5, 0.1);
            expect(m2.properties.auditDistanceMi).toBeCloseTo(2.5, 0.1);
            expect(m3.properties.auditDistanceMi).toBeCloseTo(5, 0.1);
        });
    });
    */

    function MissionMock () {
        this.properties = {
            missionId: null,
            coverrage: null,
            distance: null,
            distanceFt: null,
            distanceMi: null,
            auditDistance: null,
            auditDistanceFt: null,
            auditDistanceMi: null,
            label: null
        };
    }

    MissionMock.prototype.getProperty = function (key) {
        return this.properties[key];
    };

    MissionMock.prototype.setProperty = function (key, value) {
        this.properties[key] = value;
    };

    MissionMock.prototype.isCompleted = function () {
        return this.properties.isCompleted;
    }
});