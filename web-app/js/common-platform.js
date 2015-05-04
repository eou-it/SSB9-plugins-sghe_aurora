/*********************************************************************************
 Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
var scrollableList = new ScrollableMenuTable('#menuContainer', Navigation.menuList);

var CommonPlatform = {
	/**
	 * @private
	 */
	defaultPageName :null,

    loadStylesAtRuntime: false,

    /**
	 * Initialization method.
	 * options include:
	 * defaultApplicationName {String}
	 * standalone {Boolean}
	 *
	 * @param {Object} options
	 */
	initialize : function(options) {

        Application.initialize();

		if (typeof (options) == 'object') {
			if (options.defaultPageName && typeof(options.defaultPageName) == 'string') {
				CommonPlatform.defaultPageName = options.defaultPageName;
			}

            if(options.loadStylesAtRuntime) {
                CommonPlatform.loadStylesAtRuntime = options.loadStylesAtRuntime;
            }

			if (options.handler && typeof(options.handler) == 'function') {
				Messenger.initialize(options.handler);
			}

            if (options.resourceMap) {
                ResourceManager.addResourceMap( options.resourceMap );
            }

			if (options.standalone && typeof(options.standalone) == 'boolean' && options.standalone) {
				CommonContext.standalone = options.standalone;

				Authenticator.authenticateUser()

                // TODO:  We should pass in the user and not have to use 'CommonContext.user'
                // TODO:  Add options.user
				$('.userIdentityText').text(CommonContext.user);

                Localization.initialize(options.langDir);

				//Initialize header
				if (options.header && typeof(options.header) == 'boolean' && options.header || options.header == null) {
                    $('body').prepend(AuroraHeader.createSkeleton());
                    AuroraHeader.placeUserControls(options);
                    AuroraHeader.addAttributesToHeader();
					if (options.globalNav && typeof (options.globalNav) == 'boolean' && options.globalNav || options.globalNav == null) {
                        AuroraHeader.addNavigationControls();
                        Navigation.initialize(scrollableList);
                        scrollableList.initialize();
					}

				}

				ContentManager.initialize();


				//In initialize footer
				if (options.footer && typeof (options.footer) == 'boolean' && options.footer || options.footer == null) {
					Footer.initialize();
					OpenItems.initialize();
				}

				ContentManager.calculateContentHeight();
			}
            // dispatch event after a small delay
            setTimeout("EventDispatcher.dispatchEvent(Application.events.initialized)", 10);
		}
	}
}

/**
 * @author jmiller
 */
var Authenticator = {
	
	/**
	 * Gets user details by inspecting meta tags in HTML.
	 */
	authenticateUser : function() {
        var fullName = $('meta[name=fullName]').attr("content");
        var mepDesc = $('meta[name=ssbMepDesc]').attr("content");

		if (fullName) {
			CommonContext.user = fullName;
	    }

        if (mepDesc) {
            CommonContext.mepHomeContext  = mepDesc;
        }
	}
}

/**
 * Provides delayed Common Platform initialization control.
 */
var Bootstraper = {
	/**
	 * @private
	 * The list of callback functions to be executed during the bootstrape process.
	 */
	functions : [],
	/**
	 * Adds a function to be called during the bootstraping process.
	 * @param {Function} callback The function to add.
	 */
	add : function(callback) {
		Bootstraper.functions.push(callback);
	},
	/**
	 * Starts the bootstraping process.
	 */
	go : function() {
		for ( var x = 0; x < Bootstraper.functions.length; x++) {
			if (typeof (Bootstraper.functions[x]) == 'function') {
				Bootstraper.functions[x]();
			}
		}
	}
}

/**
 * @class A generalized context for the current Common UI Platform session.
 * @author jmiller
 */
var CommonContext = {

    /**
     * The current page id
     */
    currentPage :null,

    /**
     * The MEP Home Context.
     */
    mepHomeContext :null,

	/**
	 * The authenticated user's name.
	 */
	user :null,
	/**
	 * The authenticated UDCID.
	 */
	udcid :null,
	/**
	 * Banner Internal ID.
	 */
	pidm :null,
	/**
	 * Granted roles.
	 */
	roles :"",
	/**
	 * The authorized UDCIdentity XML Document.
	 *
	 * @type {XMLDocument} The XMLDocument that is authorized.
	 */
	udcIdentity :null,
	/**
	 * The current locale.
	 * @type String
	 * @default "en"
	 */
	locale :"en",
	/**
	 * Indicates if the managed application is standalone.
	 *
	 * @type Boolean
	 * @default false
	 */
	standalone :false
};


/**
 * @class Singleton class for managing all web service invocations.
 * @author jmiller
 */
var ServiceManager = {
	/**
	 * Invokes the specified web service using a HTTP GET request.
	 *
	 * @param {string} url The web service URL.
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
	get : function(url, callback) {
		this.ajax("GET", url, null, callback);
	},
	/**
	 * Invokes the specified web service using a HTTP PUT request.
	 *
	 * @param {string} url The web service URL.
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
	put : function(url, data, callback) {
		this.ajax("PUT", url, data, callback);
	},
	/**
	 * Invokes the specified web service using a HTTP POST request.
	 *
	 * @param {string} url The web service URL.
	 * @param {string} data The data to send.
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
	post : function(url, data, callback) {
		this.ajax("POST", url, data, callback);
	},
	/**
	 * Invokes the specified web service using a HTTP DELETE request.
	 *
	 * @param {string} url The web service URL.
	 * @param {string} data The data to send.
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
	remove : function(url, data, callback) {
		this.ajax("DELETE", url, data, callback);
	},
    /**
	 * Invokes the specified web service using a HTTP HEAD request.
	 *
	 * @param {string} url The web service URL.
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
    head: function(url, callback) {
        var xmlhttp = null;

		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		if (xmlhttp != null) {
			xmlhttp.onreadystatechange = stateChange;
			xmlhttp.open("HEAD", url, true);
			xmlhttp.send(null);
		} else {
			ErrorManager.show("Your browser does not support XMLHTTP.");
		}

		function stateChange() {
			if (xmlhttp.readyState == 4) { // 4 = "loaded"
                if (xmlhttp.status == 200) { // 200 = "OK"
                    callback(xmlhttp);
                }
			}
		}
	},
	/**
	 * @private
	 *
	 * Invokes the specific AJAX call.
	 *
	 * @param {string} httpMethod The HTTP request method type to use. GET, POST, PUT, and DELETE.
	 * @param {string} url The web service URL.
	 * @param {string} data The data to send. (optional)
	 * @param {Function} callback A function to be called when data is returned or on error. (optional)
	 */
	ajax : function(httpMethod, url, data, callback) {
		var xmlhttp = null;

		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		if (xmlhttp != null) {
			xmlhttp.onreadystatechange = stateChange;
			xmlhttp.open(httpMethod, url, true);
			xmlhttp.send(data);
		} else {
			ErrorManager.show("Your browser does not support XMLHTTP.");
		}

		function stateChange() {
			if (xmlhttp.readyState == 4) { // 4 = "loaded"
				if (xmlhttp.status == 200) { // 200 = "OK"
					if (callback && typeof (callback) === "function") {

						if (xmlhttp.responseXML) {
							callback(xmlhttp.responseXML);
						} else {
							callback(xmlhttp.responseText);
						}

					}
				} else {
					if (callback && typeof (callback) === "function") {
						callback(xmlhttp);
					}
				}
			}
		}
	}
}

/**
 * @class A singleton class for managing the state of the URL Fragment Identifier.
 * @author jmiller
 */
var FragmentManager = {
	/**
	 * @private
	 *
	 * The established handlers that should be invoked when a fragment change occurs.
	 * @type Function[]
	 */
	handlers : [],
	/**
	 * @private
	 *
	 * The last processed fragment identifier.
	 * @type String
	 */
	currentFragment :"",
	/**
	 * @private
	 *
	 * The interval id generated when polling is started. Used to stop polling, when needed.
	 * @type Integer
	 */
	pollIntervalId :null,
	/**
	 * Initialization routine.
	 */
	initialize : function() {
		FragmentManager.addHandler(handleFragment);

		function handleFragment(frag) {
			if (frag.indexOf("/") !== -1) {
				var cuip = frag.substring(frag.lastIndexOf("/") + 1);

				if (cuip.length > 4
						&& cuip.substring(0, 4) === ContentManager.commonUIPlatformMarker) {
					frag = frag.substring(0, frag.lastIndexOf("/"));

					var nav = Navigation.findNavigationEntry(frag);

					if (!nav) {
						return;
					}

					var name = nav.name + "_" + cuip;

					if (OpenItems.isOpen(name)) {
						ContentManager.bringToFront(name);
					} else {
						var anyApp = OpenItems.findAnyOpenItemByName(name);

						if (anyApp instanceof OpenItemValueObject) {
							ContentManager
									.bringToFront(anyApp.navigationEntry.name);
						} else {
							var context = new ContextValueObject()

							if (nav.page && nav.page !== "") {
								context.pageName = nav.page;
							}

							Navigation.navigate(frag);
						}
					}
				} else {
					var nav = Navigation.findNavigationEntry(frag);

					if (!nav) {
						return;
					}

					var context = new ContextValueObject()

					if (nav.page && nav.page !== "") {
						context.pageName = nav.page;
					}

					Navigation.navigate(nav, context);
				}
			}
		}
	},
	/**
	 * @private
	 *
	 * Starts fragment identifier polling.
	 */
	startPolling : function() {
		if (FragmentManager.pollIntervalId) {
			return;
		}

		FragmentManager.pollIntervalId = setInterval(FragmentManager.poll, 250);
	},
	/**
	 * @private
	 *
	 * Stops fragment identifier polling.
	 */
	stopPolling : function() {
		if (FragmentManager.pollIntervalId) {
			clearInterval(FragmentManager.pollIntervalId);
		}
	},
	/**
	 * Adds a new handler function to be invoked when the fragment identifier changes.
	 * If polling is not already started, this method will initiate it.
	 *
	 * @param {Function} callback
	 */
	addHandler : function(callback) {
		if (callback && typeof (callback) === 'function') {
			FragmentManager.handlers.push(callback);

			FragmentManager.startPolling();
		}
	},
	/**
	 * @private
	 *
	 * Checks the current fragment identifer against the previously processed fragment.
	 * If they are different, it passes the new fragment to all established handlers.
	 */
	poll : function() {
		var frag = FragmentManager.get();

		if (frag) {
			frag = FragmentManager.sanitize(frag);

			if (frag == FragmentManager.currentFragment) {
				return;
			} else {

				for ( var x = 0; x < FragmentManager.handlers.length; x++) {
					if (typeof (FragmentManager.handlers[x]) === 'function') {
						FragmentManager.handlers[x](frag);
					}
				}
			}
		}
	},
	/**
	 * @private
	 *
	 * Sanitizes incoming fragments for proper processing.
	 *
	 * @param {String} frag The unprocessed fragment.
	 * @return {String} The sanitized fragment.
	 */
	sanitize : function(frag) {
		frag = frag.replace(/\%20/g, " ");
		return frag;
	},
	/**
	 * Sets the URL fragment identifier to the specified value.
	 *
	 * @param {String} fragment
	 */
	set : function(fragment) {
		if (fragment === FragmentManager.currentFragment) {
			return;
		} else {
			FragmentManager.currentFragment = fragment;
		}

		var frag = window.location.hash;

		if (frag) {
			frag = frag.substr(1);

			if (frag === fragment) {
				return;
			} else {
				window.location.hash = fragment;
			}
		} else {
			window.location.hash = fragment;
		}
	},
	/**
	 * Utility method for retrieving the fragment identifier.
	 *
	 * @return {String} The fragment on the URL or null if there is not one.
	 */
	get : function() {
		var frag = window.location.hash;

		if (frag) {
			return frag.substr(1);
		}

		return null;
	}
};

/**
 * @class The singleton class that handles all localization related tasks.<br>
 * <br>
 * Supports dynamic resource bundle loading and has some support for right to left languages.<br>
 *
 * @author jmiller
 */
var Localization = {
	/**
	 * Initializes the localization system.
	 */
	initialize : function(langDir) {
        var direction = "ltr"
        if(langDir) {
            direction = langDir;
        }
        Localization.setLangDirection(direction);
	},

	/**
	 * @private
	 *
	 * Utility method for handling right-to-left/left-to-right language changes.
	 * @param {String} direction The direction of the localized text. Valid values: ["ltr", "rtl"].
	 */
	setLangDirection : function(direction) {
		if (direction == "ltr" || direction == "rtl") {
			if (Localization.getLangDirection() != direction) {
				$('html').css("direction", direction);

                if (document.createStyleSheet){
                    document.createStyleSheet('style.css');
                }

                if(CommonPlatform.loadStylesAtRuntime) {
                    Localization.loadStyles();
                }
			}
		}
	},
	/**
	 * Returns the currenting localized text direction.
	 * @return {String} The direction of text layout, "ltr" or "rtl". Default value is "ltr".
	 */
	getLangDirection : function() {
		if (!$('html').css("direction")) {
			return "ltr";
		}
		return $('html').css("direction");
	},
	/**
	 * @private
	 *
	 * Utility method for handling the UI component layout for language direction changes.
	 */
	toggleFloatDirection : function() {
		$('*:not(#prefWindow > div):not(#errorWindow > div)').each(
				function(i) {
					if ($(this).css("float")) {
						if ($(this).css("float") == "right") {
							$(this).css("float", "left");
						} else if ($(this).css("float") == "left") {
							$(this).css("float", "right");
						}
					}
				});
	},

	loadStyles: function() {

		if(typeof cssFiles == 'undefined' || cssFiles.length == 0) {
			var dom = document.styleSheets;
			var len = dom.length;
			for (var i = 0; i < len; i++) {

				StylesheetFormatter.toggle(i);
			}
		} else {
			for(var i=0; i<cssFiles.length; i++) {
				StylesheetFormatter.toggle(cssFiles[i]);
			}
		}
	},

	/**
	 * @private
	 *
	 * Utility method for toggling css properties using the DOM.
	 */
	toggleDirection : function() {

		var exceptions = ['prefwindow', 'errorwindow', '.browsebutton div', '.browsebutton div div', '.htmlbutton', '.menu',
		'.menu div', '.menusmall div'];

		var dom = document.styleSheets;
		var len = dom.length;
		for(var i = 0; i< len; i++) {

			var css;
			if (jQuery.browser.msie) {
				css = dom[i].rules;
			} else {
				css = dom[i].cssRules;
			}

			var clen = css.length;
			for(var j = 0; j< clen; j++) {
				if(css[j].style) {

					var style = css[j].style;
					var selector = css[j].selectorText;

					if($.inArray(selector.toLowerCase(), exceptions) == -1) {

						//float
						if (jQuery.browser.msie) {
							if(style.styleFloat) {
								if(style.styleFloat == 'left') {
									style.styleFloat = 'right';
								} else if(style.styleFloat == 'right'){
									style.styleFloat = 'left';
								}
							}
						}
						else
						{
							if(style.cssFloat) {
								if(style.cssFloat == 'left') {
									style.cssFloat = 'right';
								} else if(style.cssFloat == 'right'){
									style.cssFloat = 'left';
								}
							}
						}

						// marginLeft/marginRight
						var ml = style.marginLeft;
						var mr = style.marginRight;
						style.marginLeft = '';
						style.marginRight = '';
						if(ml)
							style.marginRight = ml;
						if(mr)
							style.marginLeft = mr;

						// paddingLeft/paddingRight
						var pl = style.paddingLeft;
						var pr = style.paddingRight;
						style.paddingLeft = null;
						style.paddingRight = null;
						if(pl)
							style.paddingRight = pl;
						if(pr)
							style.paddingLeft = pr;

						// left/right
						var l = style.left;
						var r = style.right;
						style.left = '';
						style.right = '';
						if(l!='') {
							style.right = l;
						}
						if(r!='') {
							style.left = r;
						}

						//text-align
						var ta = style.textAlign;
						if(ta == 'left') {
							style.textAlign = 'right';
						} else if(ta == 'right') {
							style.textAlign = 'left';
						}

						// borderLeft/borderRight
						var bl = style.borderLeft;
						var br = style.borderRight;
						style.borderLeft = '';
						style.borderRight = '';
						if(bl) {
							style.borderRight = bl;
						}
						if(br) {
							style.borderLeft = br;
						}
					}
				}
			}
		}
	}


};


var ResourceManager = {

    resourceMap : {},

    addResourceMap: function( map ) {
        // Extend the resourceMap with the map
        this.resourceMap = map;
    },
    destroyResourceMap: function() {
        this.resourceMap = {};
    },
	getString : function(key) {
		var value = this.resourceMap[ key ];

        if (value) {
            return value;
        }
        else {
            return key;
        }
	}
}

function ResourceBundle(name, content, locale) {
	this.name = name;
	this.content = content;
	this.locale = locale;
}

function Resource(key, value) {
	this.key = key;
	this.value = value;
}
