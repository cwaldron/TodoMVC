/*
*  Copyright (C) 2015 by Flowingly Ltd. All Rights Reserved.
*/

// Application messages used by the EventBus.

var Messages = (function () {
    "use strict";

    return {
        get documentSaved() { return "modeler:document.saved"; },
        get documentRemoved() { return "modeler:document.removed"; },
        get documentOpened() { return "modeler:document.opened"; },
        get documentModified() { return "modeler:document.modified"; },

        get dialogConfirmed() { return "dialog:confirmed"; },
        get dialogCanceled() { return "dialog:canceled"; },

        get activityBlurred() { return "modeler:activity.blurred"; },
        get activityClicked() { return "modeler:activity.clicked"; },
        get activitySelected() { return "modeler:activity.selected"; },
        get activityDropped() { return "modeler:activity.dropped"; },

        get gatewayBlurred() { return "modeler:gateway.blurred"; },
        get gatewayClicked() { return "modeler:gateway.clicked"; },
        get gatewaySelected() { return "modeler:gateway.selected"; },
        get gatewayDropped() { return "modeler:gateway.dropped"; },

        get itemsDeleted() { return "modeler:items.deleted"; },

        get end() { return "end"; }
    };
})();
