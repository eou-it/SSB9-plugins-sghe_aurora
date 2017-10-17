/*********************************************************************************
 Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/


/**
 * Delegates to Magellan's M (Messenger)
 */

var Messenger = {

    initialize: function( callback ) {
        return M.start(callback);
    },
    send : function( message ) {
        return M.send( message );
    },
    createStatusMessage: function( message ){
        return M.createStatusMessage( message );
    },
    createKeepAliveMessage:function(message){
        return M.createKeepAliveMessage(message);
    },
    createActionMessage:function(message){
        return M.createActionMessage(message);
    },
    createStatusDirtyPagesMessage: function (pageName){
        var dataStateResponse = [];
        if(DirtyCheck.isDirty()){
            dataStateResponse.push({
                page: pageName,
                state: "dirty"
            });
        }else{
            dataStateResponse.push({
                page: pageName,
                state: "clean"
            });
        }
        return {"type": "dataState","state": dataStateResponse}
    },
    messageHandler: function (message) {

        if (_.isString(message)) {
            try {
                message = JSON.parse(message);
            } catch (e) {
                message = JSON.parse(Messenger.decode(message));
            }
        }
        console.log("-------->>>> ssbapp.messageHandler: Got Message: " + JSON.stringify(message));

        if (message.type == "request" && message.request == "dataState") {
            if (message.pages != null && message.pages.trim() != "") {
                Message.setAppDirtyStatus(message.pages.trim());
            } else {
                console.log("-------->>>> ssbapp.messageHandler: Got Dirty Check message for Empty page list");
                Message.setAppDirtyStatus(message.pages.trim());
            }
        }else if (message.type == "keepAlive" ) {
            $.ajax({
                url: Application.getApplicationPath()+"/keepAlive/data",
                dataType: "html",
                success: function(data, textStatus, jqXHR) {
                    CommonContext.keepAlive=false;
                    if(CommonContext.resetInActivityTimer!=null){
                        CommonContext.resetInActivityTimer.reset();
                        notifications.remove( CommonContext.removeNotification );
                    }
                }
            });
        } else if (message.type =='request' &&  message.request == 'clearShortCutKeys') {
            shortCutKeys = {};
        }

    }
};


var Message ={
    setStatusMessage: function(message){
        Messenger.send(Messenger.createStatusMessage("opened:"+message));
    },
    setAppDirtyStatus: function (seamlessDirtyPageNames) {
        Messenger.send(Messenger.createStatusDirtyPagesMessage(seamlessDirtyPageNames));
    },
    sendSignOutActionMessage:function(){
        Messenger.send(M.createActionMessage("signout"));
    },
    setKeepAliveMessage: function(){
        Messenger.send(Messenger.createKeepAliveMessage(true) );
    }
};


/**
 *checklocalactivity function poll in every 5 minutes/300000 seconds
 * to check if any local activity happened. If any localactivity occured
 * keealive flag set to true. After 5 minutes it will check the keepalive
 * flag, if true will send the message to the application navigator
 * and reset the keepalive flag to false and reset the timer for next
 * poll interval.
 */


var timer = "";
var shortCutKeys = {};
$(document.body).ready(function(){
    if(CommonContext.hideSSBHeaderComps=='true' && CommonContext.iframe) {
        var checkLocalActivity = function () {
            if (timer === '') {
                timer = setTimeout(function () {
                    if (CommonContext.keepAlive) {
                        Message.setKeepAliveMessage();
                        CommonContext.keepAlive = false;
                    }
                    clearTimeout(timer);
                    timer = "";
                    checkLocalActivity();
                }, 300000); // polling interval keep 5 minutes
            } else {
                timer = "";
            }
        }

        checkLocalActivity();
        $(this).on("focus keypress click", function() {
            CommonContext.keepAlive=true;
        }).ajaxSend(function() {
            CommonContext.keepAlive=true;
        });


        // Start -- Sending message to handle AppNav Keyboard shortcuts.
        var y = 'Y'.charCodeAt(0);
        var x = 'X'.charCodeAt(0);
        var m = 'M'.charCodeAt(0);
        var l = 'L'.charCodeAt(0);
        var ctrlKey = 17;
        var shiftKey = 16;

        $(document).keydown(function ($event) {
            shortCutKeys[$event.which] = true;
            checkKeys($event);
        });

        $(document).keyup(function ($event) {
            delete shortCutKeys[$event.which];
            shortCutKeys = {};
        });

        function stopBrowserShortCutKeys($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        function sendActionMessage(message) {
            Messenger.send(M.createActionMessage(message));
        }

        function checkKeys($event) {
            $event = $event || window.event;

            if (CommonContext.iframe) {
                var dashboard = shortCutKeys[x] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
                var menuBar = shortCutKeys[m] && shortCutKeys[ctrlKey];
                var recentlyOpened = shortCutKeys[y] && shortCutKeys[ctrlKey];
                var displayHelp = shortCutKeys[l] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];
                var displaySearch = shortCutKeys[y] && shortCutKeys[ctrlKey] && shortCutKeys[shiftKey];

                if (dashboard) {
                    stopBrowserShortCutKeys($event);
                    sendActionMessage("showDashboard")
                }
                if (menuBar) {
                    stopBrowserShortCutKeys($event);
                    sendActionMessage("browsemenu")
                }
                if (recentlyOpened) {
                    stopBrowserShortCutKeys($event);
                    sendActionMessage("openitemsmenu")
                }
                if (displayHelp) {
                    stopBrowserShortCutKeys($event);
                    sendActionMessage("help")
                }
                if (displaySearch) {
                    stopBrowserShortCutKeys($event);
                    sendActionMessage("searchinput")
                }
            }
        }
        // End -- Sending message to handle AppNav Keyboard shortcuts.
    }
});

var Encoder = {
    //properties
    /**
     * @private
     */
    _keyString: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // methods
    /**
     * Encodes the supplied input.
     * @param {string} input The string to encode.
     */
    encode: function(input) {
        if ( !_.isString( input ) )
            input = JSON.stringify( input );

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output
                + this._keyString.charAt(enc1)
                + this._keyString.charAt(enc2)
                + this._keyString.charAt(enc3)
                + this._keyString.charAt(enc4);

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },
    /**
     * Decodes the supplied input.
     * @param {string} input The encoded string to decode.
     */
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this._keyString.indexOf(input.charAt(i++));
            enc2 = this._keyString.indexOf(input.charAt(i++));
            enc3 = this._keyString.indexOf(input.charAt(i++));
            enc4 = this._keyString.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }
};

/**
 * @class Manages the presentation of error messages to the user.
 */
var ErrorManager = {
    show: function (message) {
        switch(typeof(message)) {
            case 'string':
                MessageProcessor.processMessage(Messenger.encode(createErrorMessage(message)));
                break;
            case 'array':
                MessageProcessor.processMessage(Messenger.encode(createErrorMessage("got an array of error messages")));
                break;
            default:
                break;
        }
    }
};


function EventListener(type, listener) {
    this.type = type;
    this.listener = listener;
}

EventListener.prototype.getType = function() {
    return this.type;
}

EventListener.prototype.getListener = function() {
    return this.listener;
}



/**
 * @class Handles dispatched events and executes the cooresponding callback methods that are defined.
 * @author jmiller
 */
var EventDispatcher = {
    /**
     * @private
     *
     * The bound event listeners.
     */
    listeners: [],
    /**
     * Adds an event listener.
     *
     * @param {String} type The type of the event.
     * @param {Function} listener The listener to invoke when the event is dispatched.
     */
    addEventListener: function(type, listener) {
        if (!(type instanceof EventListener)) {
            type = new EventListener(type, listener);
        }

        if (!EventDispatcher.hasEventListener(type)) {
            EventDispatcher.listeners.push(type);
        }
    },
    /**
     * Dispatches the specified event.
     *
     * @param {String} type The type of the event.
     */
    dispatchEvent: function(type, data) {
        for (var x = 0; x < EventDispatcher.listeners.length; x++) {
            if (EventDispatcher.listeners[x].getType() == type) {
                EventDispatcher.listeners[x].getListener()(data);
            }
        }
    },
    /**
     * Determines if an event listener is defined for the specified event type.
     *
     * @param {String} type The type of the event.
     */
    hasEventListener: function(type) {
        if (type instanceof EventListener) {
            for (var x = 0; x < EventDispatcher.listeners.length; x++) {
                if (EventDispatcher.listeners[x].getType() == type.getType()
                    && EventDispatcher.listeners[x].getListener() == type.getListener()) {
                    return true;
                }
            }
        } else {
            for (var x = 0; x < EventDispatcher.listeners.length; x++) {
                if (EventDispatcher.listeners[x].getType() == type) {
                    return true;
                }
            }
        }

        return false;
    },
    /**
     * Removes an event listener.
     *
     * @param {String} type The type of the event.
     * @param {Function} listener The listener to invoke when the event is dispatched.
     */
    removeEventListener: function(type, listener) {
        for (var x = 0; x < EventDispatcher.listeners.length; x++) {
            if (EventDispatcher.listeners[x].getType() == type) {
                EventDispatcher.listeners.splice(x, 1);
                return true;
            }
        }
        return false;
    }
};
