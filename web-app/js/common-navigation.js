/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is limited
 solely to SunGard Higher Education licensees, and is further subject to the terms
 and conditions of one or more written license agreements between SunGard Higher
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

/**
 * @class The class for holding the context for each individual managed application. <br>
 * Each managed application is given a generated application id for unique identification.<br>
 *
 * @author jmiller
 */
function ContextValueObject() {
    /**
     * The generated application id.
     * @type String
     */
    this.appid = "";
    /**
     * The URL of the parent Common UI Platform.
     * @type String
     */
    this.host = "";
    /**
     * The locale.
     * @type String
     */
    this.locale = "";
    /**
     * The default application page name for this managed application.
     * @type String
     */
    this.pageName = "";
}
;

/**
 * @class Singleton that manages all open managed applications and their integration in the Common UI Platform.
 * @author jmiller
 */
var ContentManager = {
    /**
     * @private
     *
     * The HTML element id that holds all the loaded content.
     * @type String
     */
    container: "content",
    /**
     * @private
     *
     * The HTML loader file, if exists.
     * @type String
     */
    processor: "banner.zul?page=",
    /**
     * @private
     *
     * Internal marker used to identifing managed content.
     * @type String
     */
    commonUIPlatformMarker: "CUIP",
    /**
     * Initializes this class.
     */
    initialize: function() {
        if ( $( '#' + ContentManager.container ).length == 0) {
            $( 'body' ).append( "<div id='" + ContentManager.container + "'></div>" );
        }
        ContentManager.calculateContentHeight();

        if($('meta[name=menuBaseURL]').attr("content")){
           ContentManager.processor = $('meta[name=menuBaseURL]').attr("content") + '/';
        }

        $( '.ui-aurora-tab-button').live('click', function() {
            BreadCrumb.pushItem( new BreadCrumbValueObject ( $(this).attr("data-aurora-tab-id"), $(this).attr("data-aurora-tab-name"),  "", $(this).attr("data-aurora-tab-menu-id") ) );
        });

        $( '.ui-aurora-back-button').live('click', function() {
            BreadCrumb.popItem();
        });
    },
    /**
     * Instantiates a managed application.
     * @param {NavigationEntryValueObject} nav The NavigationEntryValueObject associated with the managed application to open.
     * @param {ContextValueObject} context The initial ContextValueObject the managed application is started with.
     */
    open: function( nav, context ) {
        this.addContent( nav, context );
    },
    /**
     * Closes the specified managed application and removes all associated HTML elements.
     * @param {string} name The name of the managed application to close.
     */
    close: function( name ) {
        this.removeContent( name );
    },
    /**
     * Closes all running managed applications.
     */
    closeAll: function() {
        $( '#' + this.container + ' > iframe' ).each( function( i ) {
            ContentManager.removeContent( $( this ).attr( 'id' ) );
        } );
    },
    /**
     * @private
     *
     * Removes the Common UI Platform identifier from the supplied string.
     * @param {string} name The name to parse.
     * @return {String} The input string with the CUIP id removed.
     */
    removeCUIP: function( name ) {
        if(name) {
            if ( name.indexOf( "_" + this.commonUIPlatformMarker ) !== -1 ) {
                name = name.substring( 0, name.indexOf( "_" + this.commonUIPlatformMarker ) );
            }
        }
        return name;
    },
    /**
     * @private
     *
     * Creates the necessary elements for displaying a managed applications and
     * appending them into the Document.
     *
     * @param {NavigationEntryValueObject} nav
     */
    addContent: function( nav, context ) {
        if (nav != null && nav.url != null &&  nav.url.match(/^http/)){
            window.location = nav.url;
            return;
        }
        if ( ContentManager.processor != '' )
            nav.url = nav.url.split( '.' )[0];
            window.location = ContentManager.processor + nav.url;
        // ZkApplication class is used to pass control from Aurora to the ZK Application framework
        // This can be replaced with window.location for other products
        //    ZkApplication.navigateTo( nav.url, nav.id );
        return;
    },
    /**
     * @private
     *
     * Removes any associated HTML elements for a managed application.
     *
     * @param {string} name
     */
    removeContent: function( name ) {
        OpenItems.remove( name );

        $( '#' + name ).remove();

        if ( ChannelManager.channels[name] ) {
            delete ChannelManager.channels[name];
        }
    },
    /**
     * Brings a managed application to the forefront of the display.
     *
     * @param {string} name The name of the managed application.
     */
    bringToFront: function( name ) {
        $( '#' + this.container + ' > iframe' ).css( "visibility", "visible" );

        $( '#' + name ).css( "visibility", "visible" );

        this.setActiveTab( name + OpenItems.openItemMarker );

        var item = OpenItems.getOpenItemByName( name );

        if ( item
                && item.navigationEntry instanceof NavigationEntryValueObject ) {
            if ( FragmentManager ) {
                FragmentManager.set( item.navigationEntry.menu + "/" + item.navigationEntry.caption + "/" + this.getCUIP( name ) );
            }

            this.setTitle( item.navigationEntry.caption );
        }
    },
    /**
     * @private
     *
     * Sets the Open Items list entry to active.
     *
     * @param {string} name The name of the open items entry.
     */
    setActiveTab: function( name ) {
        $( '#' + OpenItems.container + ' > li' ).removeClass( "activeOpenItem" );
        $( '#' + OpenItems.container + ' > #' + name ).addClass( "activeOpenItem" );
    },
    /**
     * @private
     *
     * Sets the browser window's title.
     * @param {string} title The title.
     */
    setTitle: function( title ) {
        if ( title ) {
            $( document ).attr( "title", title + " - Magellan" );
        }
    },

    /**
     * @private
     *
     * Maintains the dynamic height of the content area, auto-firing on window creation and resize.
     * This function corrects a scrollbar issue related to HTML div positioning.
     */
    calculateContentHeight: function() {
        var headerHeight = $( '#header:visible' ).height();
        var footerHeight = $( '#outerFooter' ).height();

        if ( !headerHeight ) {
            headerHeight = 0;
        }
    },
    /**
     * @private
     *
     * Generates a unique Common UI Platform identifier.
     * @return {String} The generated CUIP id.
     */
    generateUniqueId: function() {
        var dateObject = new Date();

        var uniqueId = this.commonUIPlatformMarker
                + Math.floor( Math.random() * 10001 );

        return uniqueId;
    },
    /**
     * @private
     *
     * Gets the Common UI Platform identifier from a given string (if present).
     * @param {name} name The name to parse.
     * @return String The CUIP id.
     */
    getCUIP: function( name ) {
        name = name.substring( (name.indexOf( this.commonUIPlatformMarker )) );

        if ( name.indexOf( "_" ) !== -1 ) {
            name = name.substring( 0, name.indexOf( "_" ) );
        }

        return name;
    }
};

/**
 * @class The value object for holding NavigationEntry information. <br>
 * <br>
 * There are two types of NavigationEntry objects that are represented by this class. <br>
 * 1. Application invocation: Identifies all the necessary information for invoking an application. <br>
 * <br>
 * Example: http://some.domain.tld:8080/path/to/app?option1=one&option2=two <br>
 *          [protocol]://[host]:[port][path]?[options] <br>
 * <br>
 * Required fields: protocol, host <br>
 * Optional fields: port, path, options <br>
 * <br>
 * 2. Application specific page navigation: Identifiers the parent application to invoke and the specific page <br>
 * within the application to navigate to. <br>
 * <br>
 * @Required fields: parent, pageName <br>
 * <br>
 * @jmiller
 */
function NavigationEntryValueObject() {
    /**
     * The generated id.
     * @type Long
     */
    this.id = "";
    /**
     * The unique name for the entry.
     * @type String
     */
    this.name = "";
    /**
     * The menu hierachy for the entry.
     * @type String
     */
    this.menu = "";
    /**
     * The caption for the entry that is displayed to the user.
     * @type String
     */
    this.caption = "";
    /**
     * The host of the entry's content. Valid values: [IP address, domain name].
     * @type String
     */
    this.host = "";
    /**
     * The internal page name associated with the entry. If host is specified, this is the
     * default page for the entry. If host is not specified, this page name
     * represents a deep-link into an application in another entry (referenced by the 'parent' field).
     * @type String
     */
    this.page = "";
    /**
     * The parent application this entry is associated with.
     * @type String
     */
    this.parent = "";
    /**
     * The transmission protocol. Valid values: [http, https].
     * @type String
     */
    this.protocol = "";
    /**
     * The port the application in this entry runs on.
     * @type String
     */
    this.port = "";
    /**
     * The URL path this entry is located on.
     * @type String
     */
    this.path = "";
    /**
     * Any additional http URL options to be passed to the application.
     * @type String
     */
    this.options = "";
}
;

NavigationEntryValueObject.prototype.toXML = function() {
    var xml = "<NavigationEntryValueObject ";

    for ( var x in this ) {
        if ( typeof(this[x]) !== 'function'
                && this[x] != null
                && x != "url" ) {
            xml += x + "=\"" + this[x] + "\" ";
        }
    }

    xml += "/>";

    return xml;
};

/**
 * @class Navigation manager.
 *
 * @author jmiller
 */
var Navigation = {
    /**
     * @private
     * Indicates if the Navigation system has been initialized.
     */
    initialized: false,
    /**
     * @private
     * The navigation service's web service endpoint.
     */
    endpoints: ["/menu"],

    standaloneEndpoints: ["/menu", "xml/navigation.xml"],

    /**
     * @private
     * The enpoints for loaded additional navigation sections
     */
    feeds: ["/menu?type=Personal"],

    /**
     * @private
     * Key for each of the feed urls. This is used as an identifier
     */
    feedKeys: ["My Banner"],
    /**
     * @private
     * The active endpoint index.
     * @default 0
     */
    endpointIndex: -1,
    /**
     * @private
     * The active feed index.
     * @default 0
     */
    feedEndpointIndex: -1,
    /**
     * @private
     * The navigation entry hierarchy.
     */
    menuList: [],
    /**
     * @private
     * The navigation entry parent menu.
     */
    parentMenu: null,

    navItem: [],

    scrollableMenu: null ,

    nonLeafNavEntryValObjKey: "nonLeafNavEntryValObjKey",

    /**
     * Initializes the Navigation system.
     * @param {string} navEntryId The default navigation entry to load after initialization is complete.
     */
    initialize: function(scrollableList) {
        Navigation.setScrollableMenu (scrollableList);

        Navigation.endpointIndex += 1;

        if ( Navigation.endpointIndex >= Navigation.endpoints.length ) {
            ErrorManager.show( "Unable to load navigation entries." );
            return false;
        }

        var endpoint = Application.getMenuEndPoint();
        if (endpoint == null){
            var ep = Navigation.endpoints[Navigation.endpointIndex];
            ep = ep.replace( ":owner", CommonContext.pidm );
            ep = ep.replace( ":roles", CommonContext.roles );

            /*var endpoint = window.location.protocol
                    + "//"
                    + window.location.host
                    + ep;*/

            if (endpoint == null)
                endpoint = Application.getApplicationPath() + ep;
        }

        ServiceManager.get( endpoint, Navigation.handleServiceResults );
    },

    setScrollableMenu: function (sMenu) {
        Navigation.scrollableMenu = sMenu;
    },

    loadFeeds: function() {
        Navigation.feedEndpointIndex += 1;

        if ( Navigation.feedEndpointIndex >= Navigation.feeds.length ) {
            Navigation.scrollableMenu.reinitialize( 0 );

            Navigation.onLoadComplete();
            return false;
        }

        var ep = Navigation.feeds[Navigation.feedEndpointIndex];
        /*var endpoint = window.location.protocol
                + "//"
                + window.location.host
                + ep;*/

        var endpoint = Application.getApplicationPath()
                + ep;

        ServiceManager.get( endpoint, Navigation.handleFeedResults );
    },
    /**
     * @private
     *
     * Processes a XML Document that represents available navigation entries and establish
     * the navigation system.
     * @param {XMLDocument} xmldoc The XML Document to parse.
     */
    handleServiceResults: function( xmldoc, scroll ) {
        if ( !xmldoc ) {
            Navigation.initialized = false;
            return;
        }
        if ( xmldoc.status ) { // means its an XMLHttpRequest object
            if ( xmldoc.status == 404
                    || xmldoc.status == 500 ) {
                Navigation.initialize(Navigation.scrollableMenu);
                return;
            }
        }
        var vo = Navigation.loadXML( xmldoc );
        if ( CommonContext.standalone == true ) {
            var nav = vo[0];
            if ( nav != null ) {
                var location = nav.menu.split( "/" );

                Navigation.removeParent( location );

                for ( var x in vo ) {
                    if ( vo[x] instanceof NavigationEntryValueObject ) {
                        Navigation.addMenuEntryStandAlone( vo[x] );
                        nav = vo[x];
                    }
                }
                Navigation.loadFeeds();
            }
        } else {

            for ( var x in vo ) {
                if ( vo[x] instanceof NavigationEntryValueObject ) {
                    Navigation.addMenuEntry( vo[x] );
                }
            }
            Navigation.scrollableMenu.initialize();
            Navigation.initialized = true;
        }
    },
    /**
     * @private
     *
     * Processes a feed XML Document that represents available navigation entries and establish
     * the navigation system.
     * @param {XMLDocument} xmldoc The XML Document to parse.
     */
    handleFeedResults: function( xmldoc ) {
        if ( !xmldoc ) {
            Navigation.initialized = false;
            return;
        }
        if ( xmldoc.status ) { // means its an XMLHttpRequest object
            if ( xmldoc.status == 404
                    || xmldoc.status == 500 ) {
                Navigation.loadFeeds();
                return;
            }
        }
        var vo = Navigation.loadXML( xmldoc );
        if ( CommonContext.standalone == true ) {
            var nav = vo[0];
            if ( nav != null ) {
//                nav.menu = Navigation.feedKeys[Navigation.feedEndpointIndex] + "/" + nav.menu;
                var location = nav.menu.split( "/" );

                Navigation.removeParent( location );

                for ( var x in vo ) {
                    if ( vo[x] instanceof NavigationEntryValueObject ) {
                        // ensure the feed entries go under their own category
//                        if(x == NavigationEntryValueObject.menu) {
//                            vo[x].menu = Navigation.feedKeys[Navigation.feedEndpointIndex] + "/" + vo[x].menu;
//                        }
                        Navigation.addMenuEntryStandAlone( vo[x] );
                        nav = vo[x];
                    }
                }

                Navigation.scrollableMenu.reinitialize( location );

                Navigation.onLoadComplete();

                if(!BreadCrumb.initialized) {
                    if($('meta[name=menuDefaultBreadcrumbId]').attr("content")){
                        var menuDefaultBreadcrumbId = $('meta[name=menuDefaultBreadcrumbId]').attr("content");
                        if(isDesktop() || isTablet()){
                            scrollableList.setFullBreadCrumb(menuDefaultBreadcrumbId);
                        }
                        else if(isMobile()){
                            scrollableList.setBreadCrumb(menuDefaultBreadcrumbId);
                        }
                    }
                }
            }
        }
    },
    /**
     * Processes a XML Document that represents available navigation entries.
     *
     * @param {XMLDocument} xmldoc The XML Document to parse.
     * @return NavigationEntryValueObject[] The navigation entries loaded.
     */
    loadXML: function( xmldoc ) {
        if ( !xmldoc ) {
            return null;
        }

        var entries = xmldoc.getElementsByTagName( "NavigationEntryValueObject" );

        var vo = [];

        for ( var x = 0; x < entries.length; x++ ) {
            if ( !entries[x].attributes ) {
                continue;
            }

            var nav = new NavigationEntryValueObject();

            for ( var y = 0; y < entries[x].attributes.length; y++ ) {
                nav[entries[x].attributes[y].nodeName] = entries[x].attributes[y].nodeValue;
            }

            if ( !nav.menu ) {
                nav.menu = "none";
            }

            //This is for standalone mode.
            if ( Navigation.parentMenu != null && CommonContext.standalone == true ) {
                if ( Navigation.parentMenu.menu == "" || Navigation.parentMenu.menu == null ) {
                    nav.menu = Navigation.parentMenu.caption;
                    var arr = Navigation.parentMenu.path.split( "/" );
                    nav.path = "/" + arr[1] + "/" + nav.path;

                } else {
                    nav.menu = Navigation.parentMenu.menu + "/" + Navigation.parentMenu.caption;
                    var arr = Navigation.parentMenu.path.split( "/" );
                    nav.path = "/" + arr[1] + "/" + nav.path;
                }
                nav.port = Navigation.parentMenu.port;
                nav.protocol = Navigation.parentMenu.protocol;
                nav.host = Navigation.parentMenu.host;
            }

            if (nav.url == null || !nav.url.match(/^http/)){
                nav.url = (nav.protocol ? nav.protocol + "://" : "")
                    + (nav.host ? nav.host : "")
                    + (nav.port ? ":" + nav.port : "")
                    + (nav.path ? nav.path : "")
                    + (nav.options ? nav.options : "");
            }

            vo.push( nav );
        }

        return vo;
    },

    /**
     * @private
     * called after all enpoints are loaded
     */
    onLoadComplete: function() {
        Navigation.initialized = true;
        if ( !NavigationRC.initialized )
            NavigationRC.initialize();
    },
    /**
     * Indicates the state of the Navigation system.
     * @return {Boolean} True is the navigation system is initialized, otherwise false.
     */
    isInitialized: function() {
        return initialized;
    },
    /**
     * @private
     *
     * Adds the supplied NavigationEntryValueObject object into the Navigation system.
     * @param {NavigationEntryValueObject} nav
     */
    addMenuEntryStandAlone: function( nav ) {
        if ( nav.menu == null
                || !(nav instanceof NavigationEntryValueObject) ) {
            return;
        }

        var location = nav.menu.split( "/" );

        Navigation.recurseMenuStructureStandAlone( location, nav );
    },
    /**
     * @private
     *
     * Finds a NavigationEntryValueObject using the supplied menu/name hierarchy for standalone mode.
     * @param {Object} hierarchy
     * @return {Array}
     */
    recurseMenuStructureStandAlone: function( hierarchy, nav ) {

        var tmpArray = Navigation.menuList;
        var singleArr = [nav];
        var indx = 0;

        $.each( hierarchy,
                function( i, value ) {

                    if ( !tmpArray[i] && !tmpArray[value] ) {
                        tmpArray[value] = [];
                    }

                    indx = indx + 1;
                    tmpArray = tmpArray[value];

                }
        );
        tmpArray[nav.caption] = nav;
        return tmpArray;
    },

    /**
     * @private
     *
     * Adds the supplied NavigationEntryValueObject object into the Navigation system.
     * @param {NavigationEntryValueObject} nav
     */
    addMenuEntry: function( nav ) {
        if ( nav.menu == null
                || !(nav instanceof NavigationEntryValueObject) ) {
            return;
        }

        var location = nav.menu.split( "/" );

        Navigation.recurseMenuStructure( location ).push( nav );
    },
    /**
     * @private
     *
     * Finds a NavigationEntryValueObject using the supplied menu/name hierarchy.
     * @param {Object} hierarchy
     * @return {Array}
     */
    recurseMenuStructure: function( hierarchy ) {
        var tmpArray = Navigation.menuList;

        for ( var x in hierarchy ) {
            if ( !tmpArray[hierarchy[x]] ) {
                tmpArray[hierarchy[x]] = [];
            }

            tmpArray = tmpArray[hierarchy[x]];
        }

        return tmpArray;
    },
    /**
     * @private
     *
     * Finds a NavigationEntryValueObject using the supplied menu/name hierarchy.
     * @param {Object} hierarchy
     * @return {Array}
     */
    getMenuStructure: function( hierarchy ) {
        var tmpArray = Navigation.menuList;

        var item = hierarchy.pop();
        if ( item == 'none' ) {
            return tmpArray;
        }

        for ( var x in hierarchy ) {
            if ( typeof hierarchy[x] == 'function' )
                continue;

            if ( !tmpArray[hierarchy[x]] ) {
                tmpArray[hierarchy[x]] = [];
            }

            tmpArray = tmpArray[hierarchy[x]];
        }

        return tmpArray;
    },
    /**
     * @private
     *
     * Finds a NavigationEntryValueObject using the supplied menu/name hierarchy.
     * @param {Object} hierarchy
     * @return {Array}
     */
    removeParent: function( hierarchy ) {

        var tmpArray = Navigation.menuList;

        if ( tmpArray.length > 0 ) {
            var indx = 0;

            $.each( hierarchy,
                  function( i, value ) {

                        indx = indx + 1;

                      if ( tmpArray[value] instanceof NavigationEntryValueObject && indx == hierarchy.length ) {
                            tmpArray[value] = [];
                        } else {
                            tmpArray = tmpArray[value];
                        }
                    }
                    );
        }


        return tmpArray;
    },
    /**
     * @private
     *
     * Generates an HTML based menu of nested <ul> elements from the navigation
     * hierarchy.
     * @return {String} The generated navigation menu.
     */
    generateHTMLMenu: function() {
        return Navigation.recurseGenerateMenu( Navigation.menuList );
    },
    /**
     * @private
     *
     * Recursively processes the navigation entires producing HTML output.
     *
     * @param {Array} menu The navigation entry multidimental associative array to process.
     * @return {String} The generated navigation menu.
     */
    recurseGenerateMenu: function( menu ) {
        var out = "";

        for ( var x in menu ) {
            if ( menu[x] instanceof Array && ! menu[x][Navigation.nonLeafNavEntryValObjKey]) {
                out += "<li class='ui-finder-folder'><a>" + x + "</a>";
                out += "<ul>" + Navigation.recurseGenerateMenu( menu[x] ) + "</ul>";
                out += "</li>";
            } else if ( menu[x] instanceof NavigationEntryValueObject ) {
                out += "<li onclick=\"toggleBrowseMenu();Navigation.navigate('" + menu[x].id + "');\"><a>" + menu[x].caption + "</a></li>";
            }
        }

        return out;
    },
    /**
     * Searchs the available NavigationEntries by the specified input.
     * Acceptable input is the discreet name for the NavigationEntryValueObject or the full menu/name hierachy.
     *
     * @param {string} name The name or hierachy to search with.
     * @return {NavigationEntryValueObject} The found navigation entry.
     */
    findNavigationEntry: function( name ) {
        if ( !name ) {
            return false;
        }

        if ( name.indexOf( "/" ) != -1 ) {
            return Navigation.pathFindNavigationEntry( name );
        } else {
            return Navigation.recurseFindNavigationEntry( Navigation.menuList, name );
        }
    },
    /**
     * @private
     *
     * Searchs for a NavigationEntryValueObject via menu hierachy.
     * @param {string} name The name to search for.
     * @return {NavigationEntryValueObject} The found navigation entry.
     */
    pathFindNavigationEntry: function( name ) {
        var leaf = name.substring( name.lastIndexOf( "/" ) + 1 );
        var branch = name.substring( 0, name.lastIndexOf( "/" ) );

        var hierarchy = branch.split( "/" );

        var tmpArray = Navigation.menuList;

        for ( var x in hierarchy ) {
            if ( tmpArray[hierarchy[x]]
                    && tmpArray[hierarchy[x]] instanceof Array ) {
                tmpArray = tmpArray[hierarchy[x]];
            }
        }

        if ( tmpArray ) {
            for ( var x in tmpArray ) {
                if ( tmpArray[x] instanceof NavigationEntryValueObject ) {
                    if ( tmpArray[x].name == leaf
                            || tmpArray[x].caption == leaf ) {
                        return tmpArray[x];
                    }
                }
            }
        }

        return null;
    },
    /**
     * @private
     *
     * Searchs for a NavigationEntryValueObject via name.
     * @param {string} menu The menu tier to within.
     * @param {string} name The name to search with.
     * @return {NavigationEntryValueObject} The found navigation entry.
     */
    recurseFindNavigationEntry: function( menu, nameOrId ) {
        var out = null;

        for ( var x in menu ) {
            if (x != Navigation.nonLeafNavEntryValObjKey) {
                if ( menu[x] instanceof Array ) {
                    out = Navigation.recurseFindNavigationEntry( menu[x], nameOrId );
                } else if ( menu[x] instanceof NavigationEntryValueObject ) {
                    if ( menu[x].name == nameOrId || menu[x].id == nameOrId) {
                        out = menu[x];
                    }
                }

                if ( out != null ) {
                    break;
                }
            }
        }

        return out;
    },
    /**
     * Searchs for a NavigationEntryValueObject and if found returns it's caption.
     * @param {String} name The NavigationEntryValueObject name to search for.
     * @return {String} The caption associated with the found navigation entry.
     */
    findNavigationEntryCaption: function( name ) {
        var navEntry = Navigation.findNavigationEntry( name );

        if ( navEntry ) {
            return navEntry.caption;
        }
        return null;
    },
    /**
     * Searchs for a NavigationEntryValueObject and if found returns it's source.
     * @param {String} name The NavigationEntryValueObject name to search for.
     * @return {String} The source associated with the found navigation entry.
     */
    findNavigationEntrySource: function( name ) {
        var navEntry = Navigation.findNavigationEntry( name );

        if ( navEntry ) {
            return navEntry.url;
        }
        return null;
    },
    /**
     * Searchs the available NavigationEntries by the specified input.
     * Acceptable input is the discreet name for the NavigationEntryValueObject.
     *
     * @param {string} name The name or hierachy to search with.
     * @return boolean true/false.
     */
    removeNavigationEntry: function( name ) {
        if ( !name ) {
            return false;
        }

        return Navigation.recurseRemoveNavigationEntry( Navigation.menuList, name );
    },
    /**
     * @private
     *
     * Searchs for a NavigationEntryValueObject via name for deletion.
     * @param {string} menu The menu tier to within.
     * @param {string} name The name to search with.
     * @return {NavigationEntryValueObject} The found navigation entry.
     */
    recurseRemoveNavigationEntry: function( menu, name ) {
        var out = false;

        for ( var x in menu ) {
            if (x != Navigation.nonLeafNavEntryValObjKey) {
                if ( menu[x] instanceof Array ) {
                    out = Navigation.recurseRemoveNavigationEntry( menu[x], name );
                } else if ( menu[x] instanceof NavigationEntryValueObject ) {
                    if ( menu[x].name == name ) {
                        var f = menu[x];
                        delete menu[x];

                        //adding a Navigation.nonLeafNavEntryValObjKey mapping to the navigationEntryValueObject for the menu object
                        // and will be added as one of its values.
                        menu[f.name] = [];
                        var tmpArray = menu[f.name];
                        tmpArray[Navigation.nonLeafNavEntryValObjKey] = f;
                        out = true;
                    }
                }

                if ( out == true ) {
                    break;
                }
            }
        }

        return out;
    },
    /**
     * Navigates  to the specified entry. Valid input is either a <object>NavigationEntryValueObject</object>
     * object or a valid navigation entry identifier (name or menu/caption).
     *
     * @param {NavigationEntryValueObject || String} nav
     */
    navigate: function( nav ) {
        var navEntry;

        if ( nav instanceof NavigationEntryValueObject ) {
            navEntry = nav;
        } else {
            navEntry = Navigation.findNavigationEntry( nav );
        }

        if ( !navEntry ) {
            return;
        }

        if ( navEntry.page
                && navEntry.parent ) {
            var app = OpenItems.findAnyOpenItemByName( navEntry.parent );

            if ( app instanceof OpenItemValueObject
                    && app.navigationEntry instanceof NavigationEntryValueObject ) {
                ContentManager.bringToFront( app.navigationEntry.name + "_" + app.cuipid );
            } else {
                var context = new ContextValueObject()

                context.pageName = navEntry.page;

                ContentManager.open( Navigation.findNavigationEntry( navEntry.parent ), context );
            }

            if ( $( "li.activeOpenItem" ) ) {
                var activeFrameName = $( "li.activeOpenItem" ).attr( "id" ).replace( OpenItems.openItemMarker, "" );

                ChannelManager.send( createApplicationPageNavigationMessage( navEntry.page ), activeFrameName );
            }
        } else {
            var app = OpenItems.findAnyOpenItemByName( navEntry.name );

            if ( app ) {
                ContentManager.bringToFront( app.navigationEntry.name + "_" + app.cuipid );
            } else {
                var context = new ContextValueObject()

                if ( navEntry.page !== "" ) {
                    context.pageName = navEntry.page;
                }

                ContentManager.open( navEntry, context );
            }

        }
    },


    /**
     * Fetches the next navigation list based on the Navigation Object passed.
     * @param {NavigationEntryValueObject || String} nav
     */
    nextNavItem: function(nav, item ) {
        Navigation.navItem = {'item': item, 'nav':nav};

        var navEntry;

        if ( nav instanceof NavigationEntryValueObject ) {
            navEntry = nav;
        } else {
            navEntry = Navigation.findNavigationEntry( nav );
        }
        if ( Navigation.parentMenu == null ) {
            var endpoint = Application.getMenuEndPoint();

            if(endpoint == null){

                var ep = Navigation.standaloneEndpoints[0];
                if ( navEntry.params != "" && navEntry.params != null ) {
                    ep += '&' + navEntry.params;
                }

                /*var endpoint = window.location.protocol + "//"
                                                    + window.location.host + ep;*/
                var endpoint = Application.getApplicationPath()
                    + ep;
            }
            endpoint = endpoint + "?menuName=" + navEntry.form + "&menu="+ encodeURIComponent(navEntry.menu) + "/" + encodeURIComponent(navEntry.name) + "&seq=" + navEntry.id;

            Navigation.removeNavigationEntry( navEntry.name );
//            Navigation.parentMenu = navEntry;
            ServiceManager.get( endpoint, Navigation.handleServiceResults );

	  	} else {
            if ( navEntry.options == "" || navEntry.options == null ) {
                var tempArr = navEntry.path.split( "/" );
                var ep = Navigation.standaloneEndpoints[0] + "/" + tempArr[tempArr.length - 1] + "/" + CommonContext.udcid;
                /*var endpoint = window.location.protocol + "//"
                        + window.location.host + ep;*/
                var endpoint = Application.getApplicationPath()
                                + ep;
                Navigation.parentMenu = navEntry;
                ServiceManager.get( endpoint, Navigation.handleServiceResults );
			} else {

                var temp = navEntry.options.substring( navEntry.options.lastIndexOf( "=" ) + 1 )
					var ep = Navigation.standaloneEndpoints[0] + "/" + temp + "/" + CommonContext.udcid;
					/*var endpoint = window.location.protocol + "//"
							+ window.location.host + ep;*/
                    var endpoint = Application.getApplicationPath()
                                        + ep;
					Navigation.parentMenu = navEntry;
                ServiceManager.get( endpoint, Navigation.handleServiceResults );
			}
		}
    }
};

/**
 * @class The data structure for holding Workspace information.
 * @author jmiller
 */
function WorkspaceValueObject() {
    /**
     * Indicates if this workspace is the owner's default home workspace.
     * @type Boolean
     */
    this.home = false;
    /**
     * A generated id for the workspace.
     * @type Long
     */
    this.id = -1;
    /**
     * The name of the workspace.
     * @type String
     */
    this.name = "";
    /**
     * The <object>NavigationEntryValueObject</object> objects associated to this workspace.
     * @type NavigationEntryValueObject[]
     */
    this.navigationEntries = [];
    /**
     * The owner of the workspace.
     * @type Integer
     */
    this.owner = -1;
    /**
     * The version of the workspace.
     * @type Integer
     */
    this.version = -1;
}


/**
 * @class The class for holding all the necessary information for an opened managed
 * application.
 *
 * @param navigationEntry The <object>NavigationEntryValueObject</object> being loaded.
 * @param context The initial <object>ContextValueObject</object> the managed application
 * is being invoked in.
 *
 * @author jmiller
 */
function OpenItemValueObject( navigationEntry, context ) {
    /**
     * The name of the managed application.
     * @type String
     */
    this.name = navigationEntry.name;
    /**
     * The generated Common UI Platform id for this managed application.
     * @type String
     */
    this.cuipid = ContentManager.generateUniqueId();
    /**
     * The <object>NavigationEntryValueObject</object> for the managed application.
     * @type NavigationEntryValueObject
     */
    this.navigationEntry = navigationEntry;
    /**
     * The initial <object>ContextValueObject</object> the managed application is invoked within.
     * @type ContextValueObject
     */
    this.context = context;
}

/**
 * @class The singleton class manager for the OpenItemValueObject display components.
 *
 * @author jmiller
 */
var OpenItems = {
    /**
     * @private
     *
     * Internal list of all currently open content.
     * @type OpenItemValueObject[]
     */
    items: [],
    /**
     * @private
     * Internal marker added to the id field of UI components put into the open items container.
     * @type {String}
     */
    openItemMarker: "-openitem",
    /**
     * @private
     * The id of the HTML container Open Item entries should be put in.
     * @type {String}
     */
    container: "openItems",
    /**
     * @private
     * Initialization routine.
     */
    initialize:function() {
        var oi = $( "<div id='openItemsContainer'>"
                + "<div id='openItemsHeader'>"
                + "<div>"
                + "<h3><span class='openItemsCount'>Open Items (0)</span></h3>"
                + "<span id='headerCloseButton' alt='Close' title='Close'></span>"
                + "</div>"
                + "</div>"
                + "<div id='openItemsBody'>"
                + "<ul id='categoryList' style='height:150px; overflow:auto'></ul>"
                + "</div>"
                + "<div id='openItemsFooter'>"
                + "<div class='buttonBar'>"
                + "</div>"
                + "</div>"
                + "</div>" );

        oi.find( '.buttonBar' ).append( Button( "closeAllOpenItemsButton", "openitems_label_closeAll",
                function() {
                    ContentManager.closeAll();
                    toggleFooterOpenItems();
                                              } ) );
        oi.find( '.buttonBar' ).append( Button( "closeOpenItemsButton", "openitems_label_closeSelected",
                function() {
                                                  ContentManager.close( $( "li.activeOpenItem" ).attr( "id" ).replace( OpenItems.openItemMarker, "" ) );
                                              } ) );

        $( "#headerCloseButton, #footerOpenItemsApplication" ).bind( "click", toggleFooterOpenItems );

        $( "#openItemsIcon" ).click( function() {
            $( "#openItemsContainer" ).show();
        } );

        $( "#categoryList > li > h4" ).live( "click", function() {
            if ( $( this ).next().is( ':visible' ) ) {
                $( this ).find( 'div' ).removeClass( 'downArrow' );
                $( this ).find( 'div' ).addClass( 'rightArrow' );
            } else {
                $( this ).find( 'div' ).removeClass( 'rightArrow' );
                $( this ).find( 'div' ).addClass( 'downArrow' );
            }

            $( this ).next().toggle( "fast" );
        } );


        // this should be a className change instead
        $( ".itemList li" ).click( function() {
            ContentManager.setActiveTab( $( this ).attr( "id" ) );
        } );
    },
    /**
     * Creates and adds the Open Item UI components for a managed application.
     *
     * @param {OpenItemValueObject} openItem The OpenItemValueObject to add.
     */
    add: function( openItem ) {
        var found = false;
        var category = openItem.navigationEntry.menu.substring( openItem.navigationEntry.menu.lastIndexOf( "/" ) + 1 );
        var name = openItem.navigationEntry.name + "_" + openItem.cuipid;
        var tab = name + this.openItemMarker;

        $( '#categoryList > li' ).each( function( i ) {
            if ( $( this ).find( 'h4' ).text() === category ) {
                $( this ).find( 'ul' ).append( "<li id='" + tab + "' class='activeOpenItem' onclick=\"ContentManager.bringToFront('" + name + "');\"><a>" + openItem.navigationEntry.caption + "</a></li>" );
                found = true;
            }
        } );

        if ( !found ) {
            var newCategory = "<li>"
                    + "<h4><div class='downArrow'></div>" + category + "</h4>"
                    + "<ul class='itemList' id='openItems'>"
                    + "<li id='" + tab + "' class='activeOpenItem' onclick=\"ContentManager.bringToFront('" + name + "');\"><a>" + openItem.navigationEntry.caption + "</a></li>"
                    + "</ul>"
                    + "</li>";

            $( '#categoryList' ).append( newCategory );
        }

        this.items[name] = openItem;

        this.updateCountDisplay();
    },
    /**
     * Adds an OpenItemValueObject element for a ApplicationPage specific to a managed application.
     * @param {String} appid The managed application's Common Platform id.
     * @param {String} page The name of the ApplicationPage.
     */
    addApplicationPage: function( appid, page ) {
        var element = $( '#categoryList > li > ul > #' + appid + OpenItems.openItemMarker );
        var name = appid + "-" + page + OpenItems.openItemMarker;

        if ( element.length == 1 ) {
            $( '#categoryList > li > ul > li' ).removeClass( "activeOpenItem" );

            element.after( "<li id='" + name + "' class='activeOpenItem' onclick=\"ContentManager.bringToFront('" + name + "');\"><a>" + page + "</a></li>" );
        }

        this.updateCountDisplay();
    },
    /**
     * Finds the first open instance of the specified managed application and
     * returns it associated OpenItemValueObject object.
     *
     * @param {string} name The name of the managed application.
     * @return {OpenItem} The found object, NULL if none were found.
     */
    findAnyOpenItemByName: function( name ) {
        name = ContentManager.removeCUIP( name );

        for ( var x in this.items ) {
            if ( name === ContentManager.removeCUIP( this.items[x].name ) ) {
                return this.items[x];
            }
        }

        return null;
    },
    /**
     * Returns an array of all <object>OpenItem</objects> objects.
     * @return {Array} The <object>OpenItem</objects> objects.
     */
    getOpenItems: function() {
        return this.items;
    },
    /**
     * Returns the <object>OpenItem</objects> object with the specified
     * <object>NavigatioNentryValueObject</object> id.
     * @return {Array} The found <object>OpenItem</objects> or NULL if not found.
     */
    getOpenItemById: function( id ) {
        for ( var x in this.items ) {
            if ( this.items[x].navigationEntry
                    && this.items[x].navigationEntry.id === id ) {
                return this.items[x];
            }
        }

        return null;
    },
    /**
     * Returns the <object>OpenItem</objects> object with the specified
     * <object>NavigatioNentryValueObject</object> id.
     * @return {Array} The found <object>OpenItem</objects> or NULL if not found.
     */
    getOpenItemByName: function( name ) {
        if ( this.items[name] ) {
            return this.items[name];
        }
        return null;
    },
    /**
     * @private
     *
     * Brings the previous sibling managed application to the front.
     */
    gotoPreviousTab: function() {
        if ( $( "li.activeOpenItem" ).prev().length > 0 ) {
            $( "li.activeOpenItem" ).prev().trigger( "click" );
        } else {
            $( "li.activeOpenItem" ).next().trigger( "click" );
        }
    },
    /**
     * Indicates if the specified managed application is presently open.
     * @param {string} name The name of the managed application.
     * @return {boolean} True if the specified application is open, otherwise False.
     */
    isOpen: function( name ) {
        if ( this.items[name] ) {
            return true;
        }
        return false;
    },
    /**
     * Returns the number of managed applications that are open.
     * @return {int} The count of <object>OpenItems</objects> objects.
     */
    size: function() {
        var count = 0;
        for ( var x in this.items ) {
            count += 1;
        }
        return count;
    },
    /**
     * Removes the Open Item UI components for a managed application.
     *
     * @param {string} name
     */
    remove: function( name ) {
        delete this.items[name];

        var name = name + this.openItemMarker

        if ( $( '#' + name ).attr( "className" ) == "activeOpenItem" ) {
            this.gotoPreviousTab();
        }

        var parentCategory = $( '#' + name ).parent().parent();

        if ( parentCategory.find( 'li' ).length === 1 ) {
            parentCategory.empty();
            parentCategory.remove();
        } else {
            $( '#' + name ).remove();
        }

        this.updateCountDisplay();
    },
    /**
     * Removes an OpenItemValueObject element for a ApplicationPage specific to a managed application.
     * @param {String} appid The managed application's Common Platform id.
     * @param {String} page The name of the ApplicationPage.
     */
    removeApplicationPage: function( appid, page ) {
        var name = appid + "-" + page + OpenItems.openItemMarker;
        var element = $( '#' + name );

        if ( element.length == 1 ) {
            element.remove();
        }

        this.updateCountDisplay();
    },
    /**
     * @private
     *
     * Maintains the Open Item count displayed to the user.
     */
    updateCountDisplay: function() {
        $( '.openItemsCount' ).text( "Open Items (" + this.size() + ")" );
    },
    getActiveOpenItem: function() {
        if ( $( '.activeOpenItem' ).length <= 0 ) {
            return null;
        }

        var name = $( '.activeOpenItem' ).attr( 'id' ).replace( OpenItems.openItemMarker, "" );

        if ( name ) {
            return this.getOpenItemByName( name );
        }
        return null;
    }
};

function toggleFooterOpenItems() {
    if ( $( '#openItemsContainer' ).is( ":hidden" ) ) {
        $( '#footerOpenItemsApplication' ).addClass( "footerOpenItemsIconHover" );
        $( '#openItemsContainer' ).css( "left", $( "#footerOpenItemsApplication" ).offset().left );
        $( '#openItemsContainer' ).fadeIn();
    } else {
        $( '#footerOpenItemsApplication' ).removeClass( "footerOpenItemsIconHover" );
        $( '#openItemsContainer' ).fadeOut();
    }
}
