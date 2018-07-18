/**
 *
 *
 * @param svHolder: One single DOM element
 * @returns {{className: string}}
 * @constructor
 */
function AdminPanorama(svHolder) {
    var self = {
        className: "AdminPanorama",
        panorama: undefined
    };

    var zoomFactor = {
        1: 1,
        2: 2.1,
        3: 4,
        4: 8,
        5: 16
    }

    var mouseStatus = {
        currX: 0,
        currY: 0,
        prevX: 0,
        prevY: 0,
        leftDownX: 0,
        leftDownY: 0,
        leftUpX: 0,
        leftUpY: 0,
        isLeftDown: false
    };

    /**
     * This function initializes the Panorama
     */
    function _init () {
        self.svHolder = $(svHolder);
        self.svHolder.addClass("admin-panorama");

        // svHolder's children are absolutely aligned, svHolder's position has to be either absolute or relative
        if(self.svHolder.css('position') != "absolute" && self.svHolder.css('position') != "relative")
            self.svHolder.css('position', 'relative');

        // GSV will be added to panoCanvas
        self.panoCanvas = $("<div id='pano'>").css({
            width: self.svHolder.width(),
            height: self.svHolder.height(),
            zIndex: 0
        })[0];

        // handles mouse movements
        self.viewControlLayer = $("<div id='viewController'>").css({
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-block',
            width: self.svHolder.width(),
            height: self.svHolder.height(),
        })[0];

        // Where the labels are drawn
        self.drawingCanvas = $("<canvas>").attr({
            width: self.svHolder.width(),
            height: self.svHolder.height(),
        }).css({
            'z-index': 0,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'display': 'inline-block',
            'width': self.svHolder.width(),
            'height': self.svHolder.height()
        })[0];

        // Add them to svHolder
        // self.svHolder.append($(self.panoCanvas));
        self.svHolder.append($(self.panoCanvas), $(self.viewControlLayer), $(self.drawingCanvas));

        // self.ctx = self.panoCanvas.getContext("2d");
        self.ctx = self.drawingCanvas.getContext("2d");


        $(self.viewControlLayer).bind('mousedown', handlerViewControlLayerMouseDown);
        $(self.viewControlLayer).bind('mouseup', handlerViewControlLayerMouseUp);
        $(self.viewControlLayer).bind('mousemove', handlerViewControlLayerMouseMove);

        self.panorama = typeof google != "undefined" ? new google.maps.StreetViewPanorama(self.panoCanvas, { mode: 'html4' }) : null;
        self.panoId = null;

        self.panoPov = {
            heading: null,
            pitch: null,
            zoom: null
        };

        if (self.panorama) {
            self.panorama.set('addressControl', false);
            self.panorama.set('clickToGo', false);
            self.panorama.set('disableDefaultUI', true);
            self.panorama.set('linksControl', false);
            self.panorama.set('navigationControl', false);
            self.panorama.set('panControl', false);
            self.panorama.set('zoomControl', false);
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
            clearCanvas();
            self.refreshGSV();
        }
        return this;
    }

    /**
     * Gets POV of panorama
     * @returns {*|{heading, pitch, zoom}}
     */
    function getPov () {
        if ("panorama" in svl) {
            var pov = self.panorama.getPov();

            // Pov can be less than 0. So adjust it.
            while (pov.heading < 0) {
                pov.heading += 360;
            }

            // Pov can be more than 360. Adjust it.
            while (pov.heading > 360) {
                pov.heading -= 360;
            }
            return pov;
        }
    }

    /**
     * Handles
     * @param e
     */
    function handlerViewControlLayerMouseDown (e) {
        console.log('Mouse Down');
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;
    }

    /**
     * Handles mouse movement events from view controller
     * @param e
     */
    function handlerViewControlLayerMouseMove (e) {
        console.log('Mouse Move');
        mouseStatus.currX = mouseposition(e, this).x;
        mouseStatus.currY = mouseposition(e, this).y;

        if (mouseStatus.isLeftDown) {
            console.log('Mouse Drag');
            // If a mouse is being dragged on the control layer, move the sv image.
            var dx = mouseStatus.currX - mouseStatus.prevX;
            var dy = mouseStatus.currY - mouseStatus.prevY;
            var pov = self.panorama.getPov();
            var zoom = Math.round(pov.zoom);
            var zoomLevel = zoomFactor[zoom];
            dx = dx / (2 * zoomLevel);
            dy = dy / (2 * zoomLevel);
            dx *= 1.5;
            dy *= 1.5;
            updatePov(dx, dy);
            clearCanvas();
            renderLabel();
        }

        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    /**
     * Handles MouseUp events from view controller
     * @param e
     */
    function handlerViewControlLayerMouseUp (e) {
        console.log('Mouse Up');
        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;
    }

    /**
     * @param options: The options object should have "heading", "pitch" and "zoom" keys
     */
    function setPov(newPov) {
        //Only update the pov if it is different
        if(newPov.heading != self.panoPov.heading || newPov.pitch != self.panoPov.pitch
            || newPov.zoom != self.panoPov.zoom) {
            self.panorama.setPov(newPov);
            self.panoPov = newPov;
            clearCanvas();
            self.refreshGSV();
        }

        console.log('SETPOV | Heading: ' + self.panoPov.heading + ', Pitch: ' + self.panoPov.pitch + ', Zoom: ' + self.panoPov.zoom);
        return this;
    }

    /**
     *
     * @param label: instance of AdminPanoramaLabel
     * @returns {renderLabel}
     */
    function renderLabel (label) {
        // works :\
        // console.log(util.misc.getLabelDescriptions('CurbRamp').text);

        if (label) {
            /*
            var originalCoordinates = {
                x : label.canvasX,
                y : label.canvasY
            };

            var coord = util.panomarker.getCanvasCoordinate(originalCoordinates, self.panoPov),
                x = (coord.x / label.originalCanvasWidth) * self.drawingCanvas.width,
                y = (coord.y / label.originalCanvasHeight) * self.drawingCanvas.height;

            console.log('(' + x + ', ' + y + ')');
            console.log('RENDER LABEL | Heading: ' + self.panoPov.heading + ', Pitch: ' + self.panoPov.pitch + ', Zoom: ' + self.panoPov.zoom)
            */
            var x = (label.canvasX / label.originalCanvasWidth) * self.drawingCanvas.width;
            var y = (label.canvasY / label.originalCanvasHeight) * self.drawingCanvas.height;


            var colorScheme = util.misc.getLabelColors();
            var fillColor = (label.label_type in colorScheme) ? colorScheme[label.label_type].fillStyle : "rgb(128, 128, 128)";


            self.ctx.save();
            self.ctx.strokeStyle = 'rgba(255,255,255,1)';
            self.ctx.lineWidth = 3;
            self.ctx.beginPath();
            self.ctx.arc(x, y, 6, 2 * Math.PI, 0, true);
            self.ctx.closePath();
            self.ctx.stroke();
            self.ctx.fillStyle = fillColor;
            self.ctx.fill();
            self.ctx.restore();
        }

        return this;
    }

    function clearCanvas () {
        self.ctx.clearRect(0, 0, self.drawingCanvas.width, self.drawingCanvas.height);
    }

    /*
    Sometimes strangely the GSV is not shown, calling this function might fix it
    related:http://stackoverflow.com/questions/18426083/how-do-i-force-redraw-with-google-maps-api-v3-0
     */
    function refreshGSV() {
        if (typeof google != "undefined")
            google.maps.event.trigger(self.panorama,'resize');
    }

    /**
     * Update POV of Street View as a user drags their mouse cursor.
     * @param dx
     * @param dy
     */
    function updatePov (dx, dy) {
        if (self.panorama) {
            var pov = self.panorama.getPov(),
                alpha = 0.5;
            pov.heading -= alpha * dx;
            pov.pitch += alpha * dy;

            // Set the property this object. Then update the Street View image
            self.panorama.setPov(pov);
        } else {
            throw self.className + ' updatePov(): panorama not defined!';
        }
    }


    //init
    _init();

    self.changePanoId = changePanoId;
    self.clearCanvas = clearCanvas;
    self.setPov = setPov;
    self.renderLabel = renderLabel;
    self.refreshGSV = refreshGSV;
    return self;
}