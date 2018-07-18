/**
 * Allows admin to view the GSV Panorama of a given label + certain attributes of a label.
 * @returns {{className: string}}
 * @constructor
 */
function AdminLabelSearch() {
    var self = {
        adminPanoramaLabel: undefined,
        className: "AdminLabelSearch",
        modal: undefined,
        panorama: undefined
    };

    function _attachListeners() {
        if (typeof google != "undefined") {
            console.log('google is defined');

            /*
            google.maps.event .addListener(self.panorama.panorama, "pov_changed", handlerPovChange);
            google.maps.event.addListener(self.panorama.panorama, "position_changed", handlerPositionUpdate);
            google.maps.event.addListener(self.panorama.panorama, "pano_changed", handlerPanoramaChange);
            google.maps.event.addListenerOnce(self.panorama.panorama, "pano_changed", modeSwitchWalkClick);
            */

            self.panorama.panorama.addListener('pov_changed', function() {
                console.log('pov changed');

                // self.panorama.clearCanvas();
                self.panorama.renderLabel(self.adminPanoramaLabel);
                // call a function to adjust label position
                // call a function to clear the screen
            });
        }
    }

    /**
     * Creates a table that displays information about a label.
     * @private
     */
    function _resetModal() {
        self.modal =
            $('<div class="modal fade" id="labelModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'+
                '<div class="modal-dialog" role="document" style="width: 390px">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header">'+
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                            '<h4 class="modal-title" id="myModalLabel">Label</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<div id="svholder" style="width: 360px; height:240px">'+
                        ' </div>'+
                        '<div class="modal-footer">'+
                            '<table class="table table-striped" style="font-size:small; margin-bottom: 0">'+
                                '<tr>'+
                                    '<th>Audit Task</th>' +
                                    '<td id="task"></td>' +
                                '</tr>'+
                                '<tr>'+
                                    '<th>GSV Pano ID</th>' +
                                    '<td id="gsv-pano-id"></td>' +
                                '</tr>'+
                                '<tr>'+
                                    '<th>Label Type</th>'+
                                    '<td id="label-type-value"></td>'+
                                '</tr>'+
                                '<tr>' +
                                    '<th>Severity</th>'+
                                    '<td id="severity"></td>'+
                                '</tr>'+
                                '<tr>' +
                                    '<th>Description</th>'+
                                    '<td id="label-description"></td>'+
                                '</tr>'+
                                '<tr>' +
                                    '<th>Temporary</th>'+
                                    '<td id="temporary"></td>'+
                                '</tr>'+
                                '<tr>' +
                                    '<th>X coordinate</th>'+
                                    '<td id="x-coordinate"></td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<th>Y coordinate</th>'+
                                    '<td id="y-coordinate"></td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<th>Time Submitted</th>'+
                                    '<td id="timestamp" colspan="3"></td>'+
                                '</tr>'+
                            '</table>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>');

        self.panorama = AdminPanorama(self.modal.find("#svholder")[0]);

        self.modalTask = self.modal.find("#task");
        self.modalGSVPanoID = self.modal.find("#gsv-pano-id");
        self.modalLabelTypeValue = self.modal.find("#label-type-value");
        self.modalSeverity = self.modal.find("#severity");
        self.modalDescription = self.modal.find("#label-description");
        self.modalTemporary = self.modal.find("#temporary");
        self.modalXCoord = self.modal.find("#x-coordinate");
        self.modalYCoord = self.modal.find("#y-coordinate");
        self.modalTimestamp = self.modal.find("#timestamp");
    }

    /**
     * Gets the attributes associated with a label.
     * @param labelMetadata     Data from a label's JSON file.
     */
    function _handleData(labelMetadata) {

        self.panorama.changePanoId(labelMetadata['gsv_panorama_id']);
        if (self.panorama) {
            self.panorama.panorama.set('clickToGo', true);
            self.panorama.panorama.set('zoomControl', true);
        }

        self.panorama.setPov({
            heading: labelMetadata['heading'],
            pitch: labelMetadata['pitch'],
            zoom: labelMetadata['zoom']
        });

        self.adminPanoramaLabel = AdminPanoramaLabel(labelMetadata['label_type_key'],
            labelMetadata['canvas_x'], labelMetadata['canvas_y'],
            labelMetadata['canvas_width'], labelMetadata['canvas_height']);
        self.panorama.renderLabel(self.adminPanoramaLabel);

        var labelDate = moment(new Date(labelMetadata['timestamp']));
        self.modalTimestamp.html(labelDate.format('MMMM Do YYYY, h:mm:ss') + " (" + labelDate.fromNow() + ")");

        self.modalTask.html("<a href='/admin/task/"+labelMetadata['audit_task_id']+"'>"+
            labelMetadata['audit_task_id']+"</a> by <a href='/admin/user/" + labelMetadata['username'] + "'>" +
            labelMetadata['username'] + "</a>");
        self.modalLabelTypeValue.html(labelMetadata['label_type_value']);
        self.modalGSVPanoID.html(labelMetadata['gsv_panorama_id']);
        self.modalSeverity.html(labelMetadata['severity'] != null ? labelMetadata['severity'] : "No severity");
        self.modalDescription.html(labelMetadata['description'] != null ? labelMetadata['description'] : "No description");
        self.modalTemporary.html(labelMetadata['temporary'] ? "True": "False");
        self.modalXCoord.html(labelMetadata['canvas_x']);
        self.modalYCoord.html(labelMetadata['canvas_y']);

        console.log('refreshGSV');
        self.panorama.refreshGSV();
    }

    /**
     * Retrieves JSON from label ID.
     * @param labelId   Unique ID associated with a label
     */
    function showLabel(labelId) {
        _resetModal();
        _attachListeners();
        self.modal.modal({
            'show': true
        });
        var adminLabelUrl = "/adminapi/label/" + labelId;
        $.getJSON(adminLabelUrl, function (data) {
            _handleData(data);
        });
    }

    /**
     * Pull information from the Label information box when the submit button is clicked.
     */
    $('#submit').on('click', function (e) {
        console.log('Submit button clicked');
        var labelId = $('#form-control-input').val();
        showLabel(labelId);
    });

    this.showLabel = showLabel;

    return self;
}