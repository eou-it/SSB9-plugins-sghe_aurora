$(document).ready(function(){
    var shortCutKeys = {};

    $(document).keydown(function (e) {
        shortCutKeys[e.which] = true;
        checkKeys();
    });

    $(document).keyup(function (e) {
        delete shortCutKeys[e.which];
        shortCutKeys = {};
    });

    var y = 89;
    var x = 88;
    var m = 77;
    var l = 76;
    var ctrlKey = 17;
    var shiftKey = 16;

    function checkKeys(event) {
        event = event || window.event;

        if (CommonContext.iframe) {
            if ($.browser.msie && shortCutKeys[y] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey]) {
                event.preventDefault();
                event.stopPropagation();
                event.returnValue = false;
                Messenger.send(M.createActionMessage("displaySearchInput"));
            }

            var dashboard = shortCutKeys[x] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
            var menuBar = shortCutKeys[m] && shortCutKeys[ctrlKey];
            var recentlyOpened = shortCutKeys[y] && shortCutKeys[ctrlKey];
            var displayHelp = shortCutKeys[l] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
            var displaySearch = shortCutKeys[y] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];

            if (dashboard) {
                Messenger.send(M.createActionMessage("displayLandingPage"));
            }
            if (menuBar) {
                Messenger.send(M.createActionMessage("displayMenu"));
            }
            if (recentlyOpened) {
                Messenger.send(M.createActionMessage("displayRecentlyOpened"));
            }
            if (displayHelp) {
                Messenger.send(M.createActionMessage("displayHelp"));
            }
            if (displaySearch) {
                Messenger.send(M.createActionMessage("displaySearchInput"));
            }
        }
    }
});
