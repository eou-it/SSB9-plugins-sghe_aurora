/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
$(document).ready(function () {
    var shortCutKeys = {};
    var y = 89;
    var x = 88;
    var m = 77;
    var l = 76;
    var ctrlKey = 17;
    var shiftKey = 16;

    $(document).keydown(function (e) {
        shortCutKeys[e.which] = true;
        checkKeys();
    });

    $(document).keyup(function (e) {
        delete shortCutKeys[e.which];
        shortCutKeys = {};
    });

    function checkKeys(event) {
        event = event || window.event;

        if (CommonContext.iframe) {
            var dashboard = shortCutKeys[x] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
            var menuBar = shortCutKeys[m] && shortCutKeys[ctrlKey];
            var recentlyOpened = shortCutKeys[y] && shortCutKeys[ctrlKey];
            var displayHelp = shortCutKeys[l] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
            var displaySearch = shortCutKeys[y] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];

            if (dashboard) {
                event.preventDefault();
                event.stopPropagation();
                Messenger.send(M.createActionMessage("showlandingpage"));
            }
            if (menuBar) {
                event.preventDefault();
                event.stopPropagation();
                Messenger.send(M.createActionMessage("browsemenu"));
            }
            if (recentlyOpened) {
                event.preventDefault();
                event.stopPropagation();
                Messenger.send(M.createActionMessage("openitemsmenu"));
            }
            if (displayHelp) {
                event.preventDefault();
                event.stopPropagation();
                Messenger.send(M.createActionMessage("help"));
            }
            if (displaySearch) {
                event.preventDefault();
                event.stopPropagation();
                Messenger.send(M.createActionMessage("searchinput"));
            }
        }
    }
});
