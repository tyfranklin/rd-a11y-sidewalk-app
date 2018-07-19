/**
 *
 *
 * @param svHolder: One single DOM element
 * @returns {{className: string}}
 * @constructor
 */
function AdminPanoramaLabelSearch(svHolder) {
    var self = {
        className: "AdminPanoramaLabelSearch",
        labelMarker: undefined,
        panorama: undefined
    };

    var icons = {
        CurbRamp : 'assets/javascripts/SVLabel/img/cursors/Cursor_CurbRamp.png',
        NoCurbRamp : 'assets/javascripts/SVLabel/img/cursors/Cursor_NoCurbRamp.png',
        Obstacle : 'assets/javascripts/SVLabel/img/cursors/Cursor_Obstacle.png',
        SurfaceProblem : 'assets/javascripts/SVLabel/img/cursors/Cursor_SurfaceProblem.png',
        Other : 'assets/javascripts/SVLabel/img/cursors/Cursor_Other.png',
        Occlusion : 'assets/javascripts/SVLabel/img/cursors/Cursor_Other.png',
        NoSidewalk : 'assets/javascripts/SVLabel/img/cursors/Cursor_NoSidewalk.png'
    }

    /**
     * This function initializes the Panorama
     */
    function _init () {
        console.log("Correct pano");
        self.svHolder = $(svHolder);
        self.svHolder.addClass("admin-panorama");

        // svHolder's children are absolutely aligned, svHolder's position has to be either absolute or relative
        if(self.svHolder.css('position') != "absolute" && self.svHolder.css('position') != "relative")
            self.svHolder.css('position', 'relative');

        // GSV will be added to panoCanvas
        self.panoCanvas = $("<div id='pano'>").css({
            width: self.svHolder.width(),
            height: self.svHolder.height()
        })[0];

        // Add them to svHolder
        self.svHolder.append($(self.panoCanvas));

        self.panorama = new google.maps.StreetViewPanorama(self.panoCanvas, { mode: 'html4' });
        self.panoId = null;

        if (self.panorama) {
            self.panorama.set('addressControl', false);
            self.panorama.set('clickToGo', false);
            self.panorama.set('disableDefaultUI', true);
            self.panorama.set('linksControl', false);
            self.panorama.set('navigationControl', false);
            self.panorama.set('panControl', false);
            self.panorama.set('zoomControl', true);
            self.panorama.set('keyboardShortcuts', false);
            self.panorama.set('motionTracking', false);
            self.panorama.set('motionTrackingControl', false);
            self.panorama.set('showRoadLabels', false);
        }

        return this;
    }

    /**
     * @param newId
     */
    function changePanoId(newId) {
        if(self.panoId != newId) {
            self.panorama.setPano(newId);
            self.panoId = newId;
            self.refreshGSV();
        }
        return this;
    }

    /**
     * @param options: The options object should have "heading", "pitch" and "zoom" keys
     */
    function setPov(coords) {
        self.panorama.set('pov', {heading: coords['heading'], pitch: coords['pitch']});
        self.panorama.set('zoom', coords['zoom']);

        // console.log('Panorama POV: ' + self.panorama.getPov().heading + ', ' + self.panorama.getPov().pitch);
        // self.refreshGSV();
        return this;
    }

    function setLatLng(coords) {
        self.panorama.set('position', new google.maps.LatLng(coords['lat'], coords['lng']));
        // console.log('Panorama position: ' + self.panorama.getPosition());
        // self.refreshGSV();
        return this;
    }

    /**
     *
     * @param label: instance of AdminPanoramaLabel
     * @returns {renderLabel}
     */
    function renderLabel (label, labelCoords) {
        console.log('rendering panomarker');
        var url = icons[label.label_type];
        console.log(url);
        // console.log('Lat: ' + labelCoords['lat'] + ', Lng: ' + labelCoords['lng']);
        // console.log('Heading: ' + labelCoords['heading'] + ', Pitch: ' + labelCoords['pitch']);

        // PanoMarker -- can't set latlng
        /*
        this.labelMarker = new PanoMarker({
                pano: self.panorama,
                position: {heading: labelCoords['heading'], pitch: labelCoords['pitch']},
                container: self.panoCanvas,
                size: new google.maps.Size(30,30),
                icon: url
            });
        */

        this.labelMarker = new google.maps.Marker ({
            map: self.panorama,
            position: new google.maps.LatLng(labelCoords['lat'], labelCoords['lng']),
            size: new google.maps.Size(15, 15),
            icon: url,
            draggable: true
        });


        /*
        console.log('Panorama POV: ' + self.panorama.getPov().heading + ', ' + self.panorama.getPov().pitch);
        console.log('Panorama position: ' + self.panorama.getPosition());
        console.log('Label: ' + labelMarker.getPosition().heading + ', ' + self.panorama.getPov().pitch);
        */
        return this;
    }

    /*
    Sometimes strangely the GSV is not shown, calling this function might fix it
    related:http://stackoverflow.com/questions/18426083/how-do-i-force-redraw-with-google-maps-api-v3-0
     */
    function refreshGSV() {
        if (typeof google != "undefined")
            google.maps.event.trigger(self.panorama,'resize');
    }

    //init
    _init();

    self.changePanoId = changePanoId;
    self.setPov = setPov;
    self.renderLabel = renderLabel;
    self.setLatLng = setLatLng;
    self.refreshGSV = refreshGSV;
    return self;
}