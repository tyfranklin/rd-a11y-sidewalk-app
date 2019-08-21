/**
 * Initializes a grouping of menu buttons. A group of menu-buttons also contain the same IDs.
 * The type of menu buttons that are currently in use are agree, disagree and not sure.
 * @param           ID of this group of buttons.
 * @constructor
 */
function MenuButton(id) {
    let agreeButtonId = "validation-agree-button-" + id;
    let disagreeButtonId = "validation-disagree-button-" + id;
    let notSureButtonId = "validation-not-sure-button-" + id;
    let self = this;

    self.agreeButton = $("#" + agreeButtonId);
    self.disagreeButton = $("#" + disagreeButtonId);
    self.notSureButton = $("#" + notSureButtonId);

    self.agreeButton.click(function() {
        coverUp("assets/javascripts/SVValidate/img/Checkmark.png");
        validateLabel("Agree");
    });

    self.disagreeButton.click(function() {
        coverUp("assets/javascripts/SVValidate/img/Cross.png");
        validateLabel("Disagree");
    });

    self.notSureButton.click(function() {
        coverUp("assets/javascripts/SVValidate/img/QuestionMark.png");
        validateLabel("NotSure");
    });

    function coverUp (iconSource) {
        var cover = $("#svv-panorama-cover-" + id);
        var coverIcon = $("#svv-panorama-cover-icon-" + id);
        coverIcon.attr("src", iconSource);
        cover.css("display", "flex");

        var i ;
        for (i = 0; i < 9; i++) {
            let coverID = "#svv-panorama-cover-" + i;
            if ($(coverID).css('display') == 'none') {
                break;
            }
        }

        if (i == 9) {
            uncover();
        }
    }

    function uncover () {
        var i;
        for (i = 0; i < 9; i++) {
            let coverStr = "#svv-panorama-cover-" + i;
            $(coverStr).fadeOut();
        }
    }

    /**
     * Validates a single label from a button click.
     * @param action    {String} Validation action - must be agree, disagree, or not sure.
     */
    function validateLabel (action) {
        let timestamp = new Date().getTime();
        svv.tracker.push("ValidationButtonClick_" + action);

        // Resets CSS elements for all buttons to their default states
        self.agreeButton.removeClass("validate");
        self.disagreeButton.removeClass("validate");
        self.notSureButton.removeClass("validate");

        // If enough time has passed between validations, log validations
        if (timestamp - svv.panorama.getProperty('validationTimestamp') > 800) {
            svv.panoramaContainer.validateLabelFromPano(id, action, timestamp);
        }
    }

    return self;
}
