/*********************************************************************************
 Copyright 2009-2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/


/**
 * Delegates to Magellan's M (Messenger)
 */
var MessageProcessor = {
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForHelpMessage : function(xmldoc) {
        var processed = false;

        $(xmldoc).find('help').find('url').each( function(i) {
            HelpManager.showHelpByURL($(this).text());

            processed = true;
        });

        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForErrorMessage : function(xmldoc) {
        var codes = [];
        var messages = [];
        var processed = false;

        $(xmldoc).find('errors').find('error').each( function(i) {
            codes[i] = $(this).find('code').text();
            messages[i] = $(this).find('message').text();

            processed = true;
        });

        var out = "";

        if (processed && messages.length > 0) {
            var statusMessageArr = [];

            $(messages).each( function(i) {
                msg = messages[i];

                if (codes[i]) {
                    msg += " (" + codes[i] + ")";
                }

                out += "<span class='errorMessage'>" + msg + "</span>";
            });

            var buttons = [ Button("errorOkButton", "common_ok",
                ModalWindowFactory.close, "blue") ];

            ModalWindowFactory.show("errorWindowModal",
                "errorwindow_label_title", "blue", $(out),
                "errorWindowContent", buttons, null);

            codes = [];
            messages = [];
        }

        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForRequestMessage : function(xmldoc) {
        var processed = false;

        if ($(xmldoc).find('request').length > 0) {
            var req = $(xmldoc).find('request').text();

            var activeFrameName = null;
            var app = null;

            if ($("li.activeOpenItem").length > 0) {
                activeFrameName = $("li.activeOpenItem").attr("id").replace(
                    OpenItems.openItemMarker, "");
                app = OpenItems.findAnyOpenItemByName(activeFrameName);
            }

            switch (req) {
                case "navigate":
                    ChannelManager
                        .send(
                            Messenger.createApplicationPageNavigationMessage(app.context.pageName),
                            activeFrameName);
                    break;
                case "context":
                    if (CommonContext.standalone) {
                        if (typeof (Messenger.setMessageHandler) == 'function') {
                            Messenger.setMessageHandler(Messenger.createContextMessage( {
                                pageName :CommonPlatform.defaultPageName
                            }));
                        }
                    } else {
                        ChannelManager.send(Messenger.createContextMessage(app.context),
                            activeFrameName);
                    }

                    break;
                default:
                    break;
            }

            processed = true;
        }

        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForConfirmationMessage : function(xmldoc) {
        var processed = false;

        if (xmldoc.getElementsByTagName('confirmation').length > 0) {
            var message = XMLHelper.getElementData(xmldoc
                .getElementsByTagName('confirmation')[0], "message");
            var title = XMLHelper.getElementData(xmldoc
                .getElementsByTagName('confirmation')[0], "title");
            var responses = xmldoc.getElementsByTagName('confirmation')[0]
                .getElementsByTagName('response');

            var buttons = [];

            var confirmationResponseSuffix = "_responseSelected";

            for ( var x = 0; x < responses.length; x++) {
                buttons.push(Button(responses[x].getAttribute("responseValue")
                    + confirmationResponseSuffix, responses[x]
                    .getAttribute("label"), function() {
                    MessageProcessor
                        .sendConfirmationResponse($(this).attr("id")
                            .replace(confirmationResponseSuffix, ""));
                    ModalWindowFactory.close();
                }, "blue"));
            }

            ModalWindowFactory.show("confirmationWindowModal",
                "confirmation_label_title", "blue", message, "", buttons,
                null);

            processed = true;
        }

        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForStatusMessage : function(xmldoc) {
        var processed = false;

        $(xmldoc).find('status').find('message').each( function(i) {
            // TODO: do nothing with $(this).text();

            processed = true;
        });

        return processed;
    },

    checkForUdcIdentityMessage : function(xmldoc) {

        var processed = false;

        if (!xmldoc || !xmldoc.getElementsByTagName('UDCIdentity')[0]) {
            return processed;
        }

        processed = true;

        CommonContext.udcIdentity = xmldoc;
        CommonContext.udcid =  XMLHelper.getElementData(xmldoc, "UDCIdentifier");


        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForOpenItemMessage : function(xmldoc) {
        var processed = false;

        if (!xmldoc || !xmldoc.getElementsByTagName('context')[0]) {
            return false;
        }

        var appid = XMLHelper.getElementData(xmldoc
            .getElementsByTagName('context')[0], "appid");

        if ($(xmldoc).find('openitem').length > 0) {
            var action = XMLHelper.getElementData(xmldoc
                .getElementsByTagName('openitem')[0], "action");
            var page = XMLHelper.getElementData(xmldoc
                .getElementsByTagName('openitem')[0], "page");

            switch (action) {
                case "open":
                    OpenItems.addApplicationPage(appid, page);
                    break;
                case "close":
                    OpenItems.removeApplicationPage(appid, page);
                    break;
                default:
                    break;
            }

            processed = true;
        }

        return processed;
    },
    /**
     * @private
     * @param {XMLDocument} xmldoc The XMLDocument to check.
     */
    checkForNavigationMessage : function(xmldoc) {
        var processed = false;

        if (xmldoc.getElementsByTagName('navigate').length > 0) {
            var message = XMLHelper.getElementData(xmldoc
                .getElementsByTagName('navigate')[0], "location");

            if (message) {
                Navigation.navigate(message);
            }

            processed = true;
        }

        return processed;
    },

    checkForUdcIdMessage : function(xmldoc) {
        var processed = false;

        if (xmldoc.getElementsByTagName('udcIdentity').length > 0) {
            getUDCXml(XMLHelper.getElementData(xmldoc, "identity"));
            processed = true;
        }
        return processed;
    },
    /**
     * Sends the user selected response to a confirmation dialog.
     * @param {string} response The user selected response.
     */
    sendConfirmationResponse : function(response) {
        if (CommonContext.standalone) {
            if (typeof (Messenger.getMessageHandler()) == 'function') {
                Messenger
                    .setMessageHandler(createConfirmationResponseMessage(response));
            }
        } else {
            if ($("li.activeOpenItem").length > 0) {
                var activeFrameName = $("li.activeOpenItem").attr("id")
                    .replace(OpenItems.openItemMarker, "");

                ChannelManager.send(
                    createConfirmationResponseMessage(response),
                    activeFrameName);
            }
        }
    },

    /**
     * Makes necessary ajax service call using the details in the message and sends
     * back the response.
     * @param {Object} message
     */
    checkForServiceCallMessage: function(message) {
        var processed = false;

//		if(message.firstChild.childNodes[0].nodeName == "service") {
//
//			function callback(response) {
//				var activeFrameName = null;
//				var xmlString = (new XMLSerializer()).serializeToString(response);
//				ChannelManager.send(xmlString, activeFrameName);
//			}
//			alert("service call progress")
//			ServiceManager.get($(message).find('url').text(), callback);
//			processed = true;
//		}

        return processed;
    },

    /**
     * Primary entrance into the message processing system.
     * @param {string} message An encoded string represented XML document.
     */
    processMessage : function(message) {

        message = Messenger.decode(message);
        xmldoc = Messenger.string2xml(message);

        // check for expected message types
        if (this.checkForHelpMessage(xmldoc) || this.checkForErrorMessage(xmldoc)
            || this.checkForStatusMessage(xmldoc)
            || this.checkForConfirmationMessage(xmldoc)
            || this.checkForNavigationMessage(xmldoc)
            || this.checkForRequestMessage(xmldoc)
            || this.checkForOpenItemMessage(xmldoc)
            || this.checkForUdcIdentityMessage(xmldoc)
            || this.checkForUdcIdMessage(xmldoc)
            || this.checkForServiceCallMessage(xmldoc)) {
            alert(message)
            return;
        } else {
            // propogate other messages back down to all the managed applications.
            // encapsulated data message.
            this.broadcast(message);
        }
    },
    /**
     * Broadcasts a message to all managed applications.
     * @param {XMLDocument} message The message to broadcast.
     */
    broadcast : function(message) {
        $('#content > iframe').each( function(i) {
            ChannelManager.send(message, $(this).attr("name"));
        });

        if (typeof (messageHandler) == 'function') {
            messageHandler(message);
        }
    }
};
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
        $("body").live("keydown", focusBackToBrowseMenu);

        function stopBrowserShortCutKeys($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        function focusBackToBrowseMenu($event) {
            if ($event.ctrlKey == true && $event.keyCode == 77) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("browsemenu"));
            } else if ($event.ctrlKey == true && $event.shiftKey == false && $event.keyCode == 89) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("openitemsmenu"));
            } else if ($event.ctrlKey == true && $event.shiftKey == true && $event.keyCode == 76) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("help"));
            } else if ($event.ctrlKey == true && $event.shiftKey == true && $event.keyCode == 89) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("searchinput"));
            } else if ($event.ctrlKey == true && $event.shiftKey == true && $event.keyCode == 70) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("signout"));
            } else if ($event.ctrlKey == true && $event.shiftKey == true && $event.keyCode == 88) {
                stopBrowserShortCutKeys($event);
                M.send(M.createActionMessage("showDashboard"));
            }
        };
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
