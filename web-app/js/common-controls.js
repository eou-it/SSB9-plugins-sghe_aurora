/*********************************************************************************
 Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

/**
 * @class UI display component representing a Button.
 *
 * @constructor
 *
 * @param id {Integer} The id for the component.
 * @param label {String} The label displayed to the user by the component.
 * @param callback {Function} The method that is invoked when the button's click event is triggered.
 *
 * @author jmiller
 */
function Button(id, label, callback, type) {
    if (typeof(type) == "undefined") {
        type = "";
    }

    var b = $("<span class='primaryButton2 " + type + "' id='" + id + "'>"
        + "<span class='primaryButtonComponent primaryButtonLeft" + type + "'></span>"
        + "<span class='primaryButtonComponent primaryButtonMiddle" + type + "' id='" + id + "Text'>" + ResourceManager.getString(label) + "</span>"
        + "<span class='primaryButtonComponent primaryButtonRight" + type + "'></span>"
        + "</span>");

    if (typeof(callback) == "function") {
        b.click(callback);
    }

    b.hover(
        function() {

            $(this).find('.primaryButtonLeft').addClass("primaryButtonLeftHover");
            $(this).find('.primaryButtonMiddle').addClass("primaryButtonMiddleHover");
            $(this).find('.primaryButtonRight').addClass("primaryButtonRightHover");

        }).mouseleave(function() {

            $(this).find('.primaryButtonLeft').removeClass("primaryButtonLeftHover");
            $(this).find('.primaryButtonMiddle').removeClass("primaryButtonMiddleHover");
            $(this).find('.primaryButtonRight').removeClass("primaryButtonRightHover");
        });

    return b;
}

var AuroraHeader =  {
    createSkeleton: function () {
        var header ="<div id='header-main-section' class='vertical-align'>"
                    + "<div id='header-main-section-west-part' class='vertical-align'>"
            + "<a id='bannerMenu' href='javascript:void(0);'  alt='Banner Menu'></a>"
            + "<a id='branding'  class='institutionalBranding'></a>"
                    + "</div>";

        return $(header);
    },

    fillWestPart: function () {
        var bannerMenuTitleAndShortcut = formatTitleAndShortcut( ResourceManager.getString("areas_label_browse_title"), ResourceManager.getString("areas_label_browse_shortcut"));
        $('#bannerMenu').attr("title",bannerMenuTitleAndShortcut);
        $('#branding').attr("alt", ResourceManager.getString("areas_label_branding"));
        //Add href to branding
        var path = $('meta[name=menuBaseURL]').attr('content') || document.location.href;
        var origin = document.location.origin || (document.location.protocol + '//' + document.location.host);
        var appUrl = path.substring(0,path.indexOf('/ssb'))
        $('#branding').attr('href', appUrl);

        var homeShortCut = formatTitleAndShortcut( ResourceManager.getString("areas_label_home_title"), ResourceManager.getString("areas_label_home_shortcut"));
        $('#branding').attr("title", homeShortCut);
        if (CommonContext.user == null) {
            var signOutShortCut = formatTitleAndShortcut( ResourceManager.getString("userdetails_signin"), ResourceManager.getString("userdetails_signout_shortCut"));
            $('#signInDiv').attr("title",signOutShortCut);
        } else {
            $('#tools').attr("title", ResourceManager.getString("areas_label_tools_shortcut"));
            $('#user').attr("title", ResourceManager.getString("areas_label_avatar_shortcut"));
        }
    },

    placeEastPart: function (options) {
        var eastPartElement =  $("<div id='header-main-section-east-part' class='vertical-align'>"
                            + "</div>");

        $('#header-main-section').append(eastPartElement.append(UserControls( options )));
        var notificationDiv = "<div id='notification-center'  class='vertical-align'></div>";
        eastPartElement.append(notificationDiv);
    },

    addNavigationControls: function () {
        TitlePanel.create();
        BreadCrumb.create();
        ToolsMenu.initialize();
        setupBannerMenu();

        var shortcuts = [
            'shift+home', function() {
                // click the first link in the home div.
                // just $().click() doesn't work as the element is not an input
                $('#branding')[0].click();
            },
            'alt+m', toggleBrowseMenu,
            'ctrl+shift+F', toggleSignInAndSignOut,
            'alt+n', toggleNotificationCenter,
            'alt+l',toggleToolsMenu
        ];
        key && key.bind.apply( window, shortcuts );
    },

    addBodyClickListenerToCloseAllMenus: function() {
        $('body').on('click', function (e) {
            closeAllMenus(e.target);
        });
    }

}

function setupBannerMenu() {
    $('#header-main-section').after("<div id=menuContainer role=application/>");
    $('#bannerMenu').on('click', function (e) {
        toggleBrowseMenu();
        return false;
    });
}

function toggleNotificationCenter(){
    window.notificationCenter.toggle();
}

function closeAllMenus(target) {
    scrollableList.closeMenu(target);
    ToolsMenu.closeMenu();
    SignInMenu.closeMenu();
    ProfileMenu.closeMenu();
}


function scrollSelectedItemIntoView() {
    $('.navList').each(function(e) {
        var container = $(this);
        $(this).children().each(function(e) {
            if ($(this).hasClass('selectedListItem')) {
                $(this).get(0).scrollIntoView(false);
            } else if ($(this).hasClass('selectedListPage')) {
                $(this).get(0).scrollIntoView(false);
            }
        });
    });
}
function toggleBrowseMenu() {
    ToolsMenu.closeMenu();
    SignInMenu.closeMenu();
    ProfileMenu.closeMenu();
    if ($('#menu').hasClass('show')) {
        $('#menu').addClass('hide');
        $('#menu').removeClass('show');
        $('#menuContainer').addClass('hide');
        $('#menuContainer').removeClass('show');
    } else {
        $('#menu').addClass('show');
        $('#menu').removeClass('hide');
        $('#menuContainer').removeClass('hide');
        $('#menuContainer').addClass('show');
    }
}

function toggleSignMenu() {
    scrollableList.closeMenu();
    ToolsMenu.closeMenu();
    if ($('#signInCanvas').is(':hidden')) {
        $('#signInCanvas').addClass('signIn-active');
        $('.signIn-mobile').addClass('signIn-expanded');
    } else {
        $('#signInCanvas').removeClass('signIn-active');
        $('.signIn-mobile').removeClass('signIn-expanded');
    }
}

function toggleProfileMenu() {
    scrollableList.closeMenu();
    ToolsMenu.closeMenu();
    if ($('#userCanvas').is(':hidden')) {
        $('#userCanvas').addClass('user-active');
        $('#user').addClass('user-expanded');
    } else {
        $('#userCanvas').removeClass('user-active');
        $('#user').removeClass('user-expanded');
    }
    return false;
}

function toggleToolsMenu() {
    scrollableList.closeMenu();
    SignInMenu.closeMenu();
    ProfileMenu.closeMenu();
    if ($('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').addClass('tools-active');
        $('#tools').addClass('tools-expanded');
        // $('#toolsMenu').find('.selectedToolsItem').focus();
    } else {
        $('#toolsCanvas').removeClass('tools-active');
        $('#tools').removeClass('tools-expanded');
    }
    return false;
}

function signIn(){
    window.location=$('meta[name=loginEndpoint]').attr("content") || ApplicationConfig.loginEndpoint;
}

function signOut(){
    window.location = $('meta[name=logoutEndpoint]').attr("content") || ApplicationConfig.logoutEndpoint;
}

function toggleSignInAndSignOut() {
    if ($('#signInButton').length > 0) {
        signIn();
    } else {
        signOut();
    }
}

function UserControls( options ) {

    ControlBar.initialize();

    var toolsDiv = $("<div id='toolsButton' class='vertical-align'><a href='javascript:void(0);' id='tools' class='flex-box'></a></div>");
    ControlBar.append(toolsDiv);

    // add user context
    if (CommonContext.user == null) {

        SignInMenu.initialize();
        SignInMenu.addItem("signIn", ResourceManager.getString("userdetails_signin"),undefined,
            function () {
                signIn();
            }
        );

        var signInAccessibilityInfo = ResourceManager.getString("userdetails_signout_description")
        var signInShortCut = formatTitleAndShortcut( ResourceManager.getString("userdetails_signin"), ResourceManager.getString("userdetails_signout_shortCut"));
        SignInMenu.addAccessibilityInfo('#signIn',signInAccessibilityInfo,signInShortCut);

        var guestSignInLink
        if("true" == $('meta[name=guestLoginEnabled]').attr("content")) {
            SignInMenu.addItem("guestSignIn",ResourceManager.getString("guestuserdetails_signin"),undefined,
                function () {
                    window.location = ApplicationConfig.loginEndpoint;
                }
            );
        }

    } else {
        var userDiv = $("<div id='userDiv' class='vertical-align'><a id='user' class='flex-box'></a></div>");
        ControlBar.append(userDiv);
        ControlBar.append($("<div id='username' class='vertical-align'>"+CommonContext.user+"</div>'"));
        ProfileMenu.initialize();
        ProfileMenu.addItem("signOut", ResourceManager.getString("userdetails_signout"),undefined,
            function () {
                signOut();
            }
        );
    }

    if (options.showHelp && typeof(options.showHelp) == 'boolean' && options.showHelp || options.showHelp == null) {
        var helpLink = $("<a id='helpText' class='helpText pointer'>" + ResourceManager.getString("userdetails_help") + "</a>");
        ControlBar.append(helpLink);

        helpLink.click(function() {
            if (CommonContext.currentPage == "mainPage" || CommonContext.currentPage == null) {
                productName = "main";
            }

            var h = Application.getApplicationPath() + "/help/url"

            $.getJSON(h, function(data) {
                $.each(data, function(key, val) {
                    var url = val.url + "/bannerOH?productName=" + productName + "&formName=" + formName + "&studentInd=Y&alumniInd=Y&arsysInd=Y&financeInd=Y&finaidInd=Y&payrollInd=Y&bxsInd=N&generalInd=Y";
                    window.open(encodeURI(url), "", "height=600,width=900,modal=yes,alwaysRaised=yes");
                });
            });

        });
    }

    return ControlBar.node;
}


/**
 * @class value object that represents a footer application.
 * @constructor
 *
 * @param {String} appid The id for the footer application.
 * @param {String} className The class name for the footer application.
 * @param {String} displayUI The HTML representation for the display component.
 *
 * @author jmiller
 */
function FooterApplicationValueObject(appid, className, displayUI) {
    this.appid = appid;
    this.className = className;
    this.displayUI = displayUI;
}

/**
 * @class value object that represents a footerAppContainer
 * @constructor
 *
 * @param {int} index The index at which the footer div to be injected
 * @param {String} appId The appId of the managed application.
 * @param {String} html The html content to be injected by the managed application
 *
 * @author prashanth
 */
function footerAppDiv(index, appId, html) {
    this.index = index;
    this.appId = appId;
    this.html = html;
}

/**
 * @class Singleton class that provides the interface for handling applications
 * that display within the footer bar.
 *
 * @author jmiller
 */
var Footer = {
    /**
     * The list of loaded FooterApplicationValueObject objects.
     * @type Array
     */
    apps: [],
    /**
     * @private
     *
     * ID marker for the display component of a FooterApplicationValueObject
     * @type String
     */
    uiMarker: "-ui",
    /**
     * @private
     * The list of loaded FooterApplicationValueObject objects.
     * @type Array
     */
    appContainers: [],
    /**
     * @private
     *
     * The HTML UI elements.
     */
    displayUI: "<div id='outerFooter'>"
        + "<div id='footer'>"
        + "<div id='footerApplicationBar'>"
        + "<ul id='footerIconContainer'></ul>"
        + "<span class='footerBrandingLogo'></span>"
        + "<div id='footerAppContainer'>"
        + "</div>"
        + "</div>"
        + "</div>"
        + "</div>",
    /**
     * @private
     *
     * Initialization method.
     */
    initialize: function() {
        $('body').append(Footer.displayUI);

        $('.footerBrandingLogo').click(function() {
            var nav = Navigation.findNavigationEntry("institutionHomePage");

            if (nav
                && nav instanceof NavigationEntryValueObject) {
                Navigation.navigate(nav);
            }
        });
    },
    /**
     * Method for adding an application to the Footer.
     * @param {FooterApplicationValueObject} footerApplication The FooterApplicationValueObject to add.
     */
    add: function(footerApplication) {
        if (footerApplication instanceof FooterApplicationValueObject) {
            var icon = "<li><span id='" + footerApplication.appid + "' class='" + footerApplication.className + "'></span></li>";
            var ui = $("<div id='" + footerApplication.appid + this.uiMarker + "'></div>");

            ui.append(footerApplication.displayUI);

            $('#footerIconContainer').append(icon);
            $('#footerContainer').append(ui);

            this.apps.push(footerApplication);
        }
    },


    /**
     * Method for removing an application from the Footer.
     * @param {String} appid The id of the FooterApplicationValueObject to remove.
     */
    remove: function(appid) {
        for (var x = 0; x < this.apps.length; x++) {
            if (this.apps[x].appid == appid) {
                $('#' + this.apps[x].appid).parent().remove();
                $('#' + this.apps[x].appid + this.uiMarker).remove();
            }
        }
    },

    /** Function to create a div in the footerAppContainer
     * @constructor
     *
     * @param {footerDiv} object of type footerAppDiv
     * @return {footerAppDiv} object of type footerAppDiv
     *
     * @author prashanth
     */
    createContainer: function(footerDiv) {
        if (footerDiv instanceof footerAppDiv) {
            for (i = 0; i < Footer.appContainers.length; i++) {

                if (Footer.appContainers[i].appId == footerDiv.appId) {

                    $('#footerAppContainer').find('#' + footerDiv.appId).remove();
                }
            }

            var ui = $("<div id='" + footerDiv.appId + "'></div>");
            var arrIndex = $("#footerAppContainer").children().length;

            if (footerDiv.index != -1 && footerDiv.index != null && footerDiv.index <= $("#footerAppContainer").children().length) {
                if ($("#footerAppContainer").children().length > 0) {
                    if (footerDiv.index != 0) {
                        $("#footerAppContainer").find('div:eq(' + (footerDiv.index - 1) + ')').after(ui);
                    }
                    else
                    if (footerDiv.index == 0) {
                        $("#footerAppContainer").find('div:eq(' + footerDiv.index + ')').before(ui);
                    }
                }
                else {
                    if (footerDiv.index == 0) {
                        $("#footerAppContainer").append(ui);
                    }
                }
            }
            else {
                $("#footerAppContainer").append(ui);
            }
            $('#footer').find('#' + footerDiv.appId).html(footerDiv.html);
            this.appContainers.push(footerDiv);
        }
        return footerDiv;
    },

    /** Function to get a div from the footerAppContainer
     * @constructor
     *
     * @param {String} appId the appId of the managed application
     * @return {footerAppDiv} object of type footerAppDiv
     *
     * @author prashanth
     */
    getAppContainer: function(appId) {
        var children = $("#footerAppContainer").children().size();
        var appNewDiv;
        var exists = 'false';
        for (i = 0; i < Footer.appContainers.length; i++) {
            if (Footer.appContainers[i].appId == appId) {
                exists = 'true';
                appNewDiv = Footer.appContainers[i];
                break;
            }
        }
        if (exists == "true") {
            return appNewDiv;
        }
        else {
            return Footer.createContainer(new footerAppDiv(children, appId, ""));
        }
    }
};

/**
 * @class NavigationRC Class to support auto selection of navigation items when the application loads
 *
 * @author jai.chandramouli
 */
var NavigationRC = {
    /**
     * Identifier prefix
     */
    id: 'list',
    /**
     * NavigationEntryValueObject containing the current page details loaded from service
     */
    navEntry:null,
    /**
     * List to contain the page heirarchy
     */
    pathList: [],
    /**
     * @private
     * Indicates if the Navigation system has been initialized.
     */
    initialized: false,
    /**
     * @private
     * Indicates if all entries have been loaded
     */
    loadComplete: false,
    /**
     * @private
     * The navigation service's web service endpoint.
     */
    endpoints: ["/menu"],
    /**
     * @private
     * The active endpoint index.
     * @default 0
     */
    endpointIndex: -1,

    initialize: function(pageName, seq) {
        if (pageName == null)
            pageName = NavigationRC.getPageName();
        if (pageName == "")
            return;

        NavigationRC.endpointIndex += 1;
        if (NavigationRC.endpointIndex >= NavigationRC.endpoints.length) {
            return false;
        }
        var ep = NavigationRC.endpoints[NavigationRC.endpointIndex];

        var endpoint = Application.getApplicationPath()
            + ep
            + "?pageName=" + pageName;

        if (seq != null)
            endpoint = endpoint + "&seq=" + seq;

        ServiceManager.get(endpoint, NavigationRC.handleServiceResults);
    },

    reInitialize: function(pageName, seq) {
        NavigationRC.initialized = false;
        NavigationRC.endpointIndex = -1;
        NavigationRC.loadComplete = false;
        NavigationRC.initialize(pageName, seq);
    },

    getPageName: function() {
        var loc = window.location.href;
        if ( loc.indexOf( "page=" ) != -1 ) {
            return loc.substring( loc.indexOf( "page=" ) + 5, loc.length )
        } else {
            return ""
        }
    },

    /**
     * @private
     *
     * Processes a XML Document that represents available navigation entries and establish
     * the navigation system.
     * @param {XMLDocument} xmldoc The XML Document to parse.
     */
    handleServiceResults: function(xmldoc) {
        if (!xmldoc) {
            NavigationRC.initialized = false;
            return;
        }
        if (xmldoc.status) { // means its an XMLHttpRequest object

            if (xmldoc.status == 404
                || xmldoc.status == 500) {
                NavigationRC.initialize();
                return;
            }
            if (xmldoc.status == 400) {
                return;
            }
        }
        var vo = NavigationRC.loadXML(xmldoc);

        if (CommonContext.standalone == true) {
            var nav = vo[0];
            if (nav != null) {

                NavigationRC.navEntry = nav;

                NavigationRC.pathList = nav.menu.split("/");

                NavigationRC.doInitialLoad();

                NavigationRC.initialized = true;
            }
        }
    },
    /**
     * Processes a XML Document that represents available navigation entries.
     *
     * @param {XMLDocument} xmldoc The XML Document to parse.
     * @return NavigationEntryValueObject[] The navigation entries loaded.
     */
    loadXML: function(xmldoc) {
        if (!xmldoc) {
            return null;
        }

        var entries = xmldoc.getElementsByTagName("NavigationEntryValueObject");

        var vo = [];

        for (var x = 0; x < entries.length; x++) {
            if (!entries[x].attributes) {
                continue;
            }

            var nav = new NavigationEntryValueObject();

            for (var y = 0; y < entries[x].attributes.length; y++) {
                nav[entries[x].attributes[y].nodeName] = entries[x].attributes[y].nodeValue;
            }

            vo.push(nav);
        }

        return vo;
    },

    doInitialLoad: function() {
        scrollableList.findElement('#browseMenu').addClass('visibility');
        NavigationRC.loadNext(scrollableList);
    },

    loadNext: function(scrollableMenu) {
        if (NavigationRC.pathList.length == 0) {
            if (!NavigationRC.loadComplete) {
                if (NavigationRC.navEntry) {
                    var leafId = NavigationRC.id + '_' + NavigationRC.navEntry.caption;
                    scrollableMenu.selectedItem(leafId);
                }
            }
            scrollableMenu.findElement('#browseMenu').removeClass('visibility');
            NavigationRC.loadComplete = true;
            NavigationRC.id = "list";
            return;
        }

        NavigationRC.id += '_' + NavigationRC.pathList.shift();

        var item = scrollableMenu.findElement('.navList > .scrollableListFolder[id="' + NavigationRC.id + '"]');
        if (item.length > 0) {
//            item.click();
            scrollableMenu.load(item);
        } else {
            // this should be a leaf item, select breadcrumb item
            EventDispatcher
                .dispatchEvent(scrollableMenu.events.click, NavigationRC.id);

            NavigationRC.loadNext(scrollableMenu);
        }
    }
};


function BreadCrumbValueObject(id, label, url) {
    this.id = id;
    this.label = label;
    this.url = url;
}

var BreadCrumb = {

    items: [],

    UI: $("<div id='breadcrumb-panel'>"
        + "<div id='breadcrumbHeader'>"
        + "</div>"
        + "</div>"),

    create: function () {
        $('#header-main-section').after(BreadCrumb.UI);
    },

    setFullBreadcrumb : function(breadCrumbItems, pageTitle) {
        BreadCrumb.updateBreadcrumbItems(breadCrumbItems);
        BreadCrumb.addBackButton();
        BreadCrumb.showPageTitleAsBreadcrumb(pageTitle);
        BreadCrumb.registerBreadcrumbClickListener();
    },

    updateBreadcrumbItems: function(breadcrumbItems){
        var index = 0;
        $.each(breadcrumbItems, function(label, url) {
            index = index + 1;
            var breadCrumbItem = new BreadCrumbValueObject(index,label, url.trim());
            BreadCrumb.items.push(breadCrumbItem);
            BreadCrumb.drawItem(breadCrumbItem);
        });
    },

    drawItem: function (item) {
        var breadcrumbHeader = BreadCrumb.UI.find('#breadcrumbHeader');
        var breadcrumbItem = "<span class='breadcrumbButton' data-id='"+item.id+"'>"+item.label+"</span>";
        if(item.url.length){
            breadcrumbItem = "<a class='breadcrumbButton' data-id='"+item.id+"' data-path='"+item.url+"' href='#'>"+item.label+"</a>";
        }
        breadcrumbHeader.append(breadcrumbItem);
    },

    addBackButton: function () {
        var leafItemId = _.last(BreadCrumb.items, [1])[0].id;
        var previousNavigableURL = BreadCrumb.getPreviousBreadCrumbNavigationLocation(leafItemId);

        if(previousNavigableURL.length){
            var backButton = "<a id='breadcrumbBackButton' href='#'></a>";
            BreadCrumb.UI.prepend(backButton);
            BreadCrumb.registerBackButtonClickListener();
        }
    },

    showPageTitleAsBreadcrumb : function(pageTitle) {
        if(!_.isUndefined(pageTitle) && pageTitle.trim().length){
            $('<div id="breadcrumbPageTitle">'+pageTitle+'</div>').insertBefore('#breadcrumbHeader');
        }
        else{
            $('#breadcrumbHeader').addClass('breadcrumb-show-leaf');
        }
    },

    registerBreadcrumbClickListener: function(){
        $('a.breadcrumbButton').on('click',function(){
            var uri = $(this).attr('data-path');
            window.location = Application.getApplicationPath() + uri;
        })
    },

    registerBackButtonClickListener: function(){
        $('#breadcrumbBackButton').on('click',function(){
            var breadcrumbItem =  $('.breadcrumbButton:last').attr('data-id');
            var location = BreadCrumb.getPreviousBreadCrumbNavigationLocation(breadcrumbItem);
            window.location = location;
        })
    },

    getPreviousBreadCrumbNavigationLocation: function(breadcrumbId){
        var previousNavigableURL = "";
        var itemsWithURL = BreadCrumb.items.filter(function(breadcrumb) {
            return (breadcrumb.url.length > 0 && (breadcrumb.id < parseInt(breadcrumbId))) ;
        });

        var previousBreadcrumbWithURI = _.last(itemsWithURL, [1]);
        if(previousBreadcrumbWithURI.length){
            previousNavigableURL = Application.getApplicationPath() + previousBreadcrumbWithURI[0].url;
        }
        return previousNavigableURL;
    }
};


var TitlePanel = {
    create: function () {
        $('#header-main-section').after("<div id='title-panel'></div>");
    }
}

/**
 * @class Contains application specific details.
 */
var Application = {

    /**
     * Associated events.
     */
    events : {
        initialized :"auroraInitialized"
    },

    appDetails: [],

    /**
     * Ex: http://m038034.sct.com:8000/s14s80/twbkwbis.P_GenMenu
     */
    initialize: function() {
        Application.appDetails = Application.getURL().split("//");
    },
    /**
     * Returns the complete window location url
     */
    getURL: function() {
        return window.location.href;
    },
    /**
     * Returns the protocol.
     * Ex: http:
     */
    getProtocol: function() {
        return Application.appDetails[0];
    },
    /**
     * Returns the host name of the application.
     * Ex: m038034.sct.com:8000
     */
    getHost: function() {
        var end_at = Application.appDetails[1].indexOf('/');
        return Application.appDetails[1].substring(0, end_at);
    },
    /**
     * Returns the application path from the window location.
     * Ex: http://m038034.sct.com:8000/s14s80
     */
    getApplicationPath: function() {

        var applicationPath = $('meta[name=menuBaseURL]').attr("content");
        if(applicationPath){
            return applicationPath;
        }

        var end_at = Application.appDetails[1].indexOf('/');
        var app = Application.appDetails[1].substring(end_at + 1, Application.appDetails[1].lastIndexOf('/'));
        var protocol = Application.getProtocol();
        var host = Application.getHost();
        return protocol + "//" + host + "/" + app;
    },
    /**
     * Returns the application path from the window location.
     * Ex: http://m038034.sct.com:8000/s14s80
     */
    getMenuEndPoint: function() {

        var menuEndPoint = $('meta[name=menuEndPoint]').attr("content");
        if(menuEndPoint){
            return menuEndPoint;
        }
    },
    /**
     * Returns the package.procedure name of the current page.
     * Ex: bmenu.P_MainMnu
     */
    getProc: function() {
        var procDetails = Application.appDetails[1].split('?');
        if (procDetails[1]) {
            var paramObj = deparam(procDetails[1], true);
            if (paramObj.name) {
                return paramObj.name;
            }
        }
        //if paramObj.name doesn't exist, continue
        var start_at = procDetails[0].lastIndexOf('/');
        return procDetails[0].split('#')[0].substring(start_at + 1);
    },

    isUserAuthenticated: function() {
        var username = CommonContext.user;
        if (username) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Redirects the browser to the specified <code>url</code>. In case of IE, the method ensures that the 'REFERER' header
     * is sent by simulating an anchor link click.
     * @param {String} url
     */
    navigateToURL: function(url) {
        if (url.indexOf('http') == -1) {
            url = Application.getApplicationPath() + "/" + url;
        }

        if (!jQuery.browser.msie) {
            document.location = url;
            return;
        }
        var a = document.createElement("a");
        a.setAttribute("href", url);
        a.style.display = "none";
        $("body").append(a);
        a.click();
    },

    /**
     * returns the path of the resources
     */
    getResourcePath: function() {
        var path = $('script[src*="common-controls.js"]').attr("src");
        return path.substring(0, path.lastIndexOf('/'));
    }
};

function setMepDescription(mepDescription) {
    if (mepDescription != null) {
        $('.mepHomeContextText').text(mepDescription);
        CommonContext.mepHomeContext = mepDescription;
    }
}

function setCurrentPage(currentPage) {
    CommonContext.currentPage = currentPage;
}


/**
 * Tools menu class to manage the menu items under the Tools section in the Aurora header
 */
var NonHierarchicalMenu = {

    /**
     * Dropdown menu
     */
    dropDown: "",

    /**
     * container for menu items
     */
    canvas: "",

    /**
     * HTML for rendering section
     */
    sectionHtml: $("<div class='canvas-section'/></div>"),

    /**
     * HTML for rendering menu items
     */
    itemHtml: $("<div class='canvas-item vertical-align'/></div>"),

    callbackPostItemClick: null,

    /**
     * show/hide tools button
     */
    visible: function (flag) {
        if (flag) {
            this.dropDown.show();
        } else {
            this.dropDown.hide();
        }
    },
    /**
     * adds section title to the tools menu
     * @param id
     * @param label
     */
    addSection: function (id, label) {
        var sec = this.sectionHtml.clone();
        sec.attr("id", id);
        sec.text(label);
        this.canvas.append(sec);
        return sec;
    },

    /**
     * removes the specified section
     * @param id
     */
    removeSection: function (id) {

    },

    /**
     * adds a menu item to the specified section and also attaches a callback, if provided
     * @param id
     * @param label
     * @param sectionId
     * @param callback
     */
    addItem: function (id, label, sectionId, callback) {
        var item = this.itemHtml.clone();
        var handlerPostItemClick = this.callbackPostItemClick;
        item.attr('id', id);
        item.text(label);
        item.addClass('pointer');
        item.attr('tabindex',0);
        item.click(function (e) {
            if (callback)
                callback(e);
            handlerPostItemClick.call();
        });
        item.keyup(function(e){
            if(e.keyCode == 13 || e.keyCode == 32)
            {
                if (callback)
                    callback(e);
                handlerPostItemClick.call();
            }
        });
        if (sectionId)
            this.canvas.find('#' + sectionId).after(item);
        else
            this.canvas.append(item);
        return item;
    },

    /**
     * removes an menu item from the tools menu
     * @param id
     */
    removeItem: function (id) {

    }
}


var ProfileMenu = Object.create(NonHierarchicalMenu);
ProfileMenu.initialize = function() {
    ControlBar.node.find('#userDiv').append("<div id='userCanvas'>"
        + "<div id='userMenu'><div id='userList' class='user-list'></div>"
        + "</div>"
        + "</div>");
    this.dropDown = ControlBar.node.find("#userCanvas");
    this.canvas =  ControlBar.node.find('#userList');
    this.callbackPostItemClick = toggleProfileMenu;

    ControlBar.node.find('#user').bind("click", toggleProfileMenu);
}
ProfileMenu.closeMenu = function() {
    if (!$('#userCanvas').is(':hidden')) {
        $('#userCanvas').removeClass('user-active');
        $('#user').removeClass('user-expanded');
    }
}

var ToolsMenu = Object.create(NonHierarchicalMenu);
ToolsMenu.initialize = function() {
    $('#toolsButton').attr("title", ResourceManager.getString("areas_label_tools_shortcut"));
    $('#toolsButton').find('div div a').text(ResourceManager.getString("areas_label_tools"));

    $('#toolsButton').append("<div id='toolsCanvas' class='toolsMenuShadow'>"
        + "<div id='toolsMenu'><div id='toolsList' class='tools-list'></div>"
        + "</div>"
        + "</div>");
    this.dropDown = ControlBar.node.find("#toolsCanvas");
    this.canvas =  ControlBar.node.find('#toolsList');
    this.callbackPostItemClick = toggleToolsMenu;

    $('#tools').bind("click", toggleToolsMenu);
}
ToolsMenu.closeMenu = function() {
    if (!$('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').removeClass('tools-active');
        $('#tools').removeClass('tools-expanded');
    }
}

var SignInMenu = Object.create(NonHierarchicalMenu);
SignInMenu.initialize = function() {
    var signInDom = $("<div id='signInButton'  ><a class='signIn-mobile'  />"
        + "<div id='signInCanvas' class='vertical-align'><div id='signInMenu'><div id='signList' class='signIn-list'>"
        + "</div></div></div>"
        + "</div>");
    ControlBar.append(signInDom);

    this.dropDown = ControlBar.node.find("#signInCanvas");
    this.canvas = ControlBar.node.find('#signList');
    this.callbackPostItemClick = toggleSignMenu;

    ControlBar.node.find('.signIn-mobile').click(function () {
        if ($('.signIn-list div').length > 1) {
            toggleSignMenu();
        } else {
            signIn();
        }
        return false;
    });
}
SignInMenu.closeMenu = function() {
    if (!$('#signInCanvas').is(':hidden')) {
        $('#signInCanvas').removeClass('signIn-active');
        $('.signIn-mobile').removeClass('signIn-expanded');
    }
}
SignInMenu.addAccessibilityInfo= function(selector, elemAriaLabel, elemTitle) {
    var elemDiv = ControlBar.node.find(selector);
    elemDiv.attr('title',elemTitle);
    elemDiv.attr('aria-label', elemAriaLabel);
}

/**
 * Class to manage user controls on the top right corner of the Aurora header
 */
var ControlBar = {

    node: $("<div id='header-east-part-user-controls'>"
        + "</div>"),

    canvas: null,

    initialize: function() {
        this.canvas = this.node;

    },

    attach: function(node) {
        this.node.append(node);
    },

    append: function(node, appendAfterId) {
        if (appendAfterId)
            this.node.find(appendAfterId).after(node);
        else
            this.node.append(node);
    },

    appendTo: function(node, appendToId) {
        if (appendToId)
            $( node ).appendTo( this.node.find(appendToId));
        else
            $( node ).appendTo( this.node );
    },

    prepend: function(node, prependBeforeId) {
        if (prependBeforeId)
            this.node.find(prependBeforeId).before(node);
        else
            this.node.prepend(node);
    }
}


$(document).ready(function(){

    if($('meta[name=headerAttributes]').attr("content")){
        var headerAttributes = JSON.parse($('meta[name=headerAttributes]').attr("content"));
        var breadcrumbItems = headerAttributes.breadcrumb;
        var pageTitle = headerAttributes.pageTitle;
        $('#title-panel').text(pageTitle);
        if(!_.isEmpty(breadcrumbItems)){
            BreadCrumb.setFullBreadcrumb(breadcrumbItems, pageTitle);
        }
    }

    ContentManager.setContentPosition();

    $(window).on('resize',function(){
        ContentManager.setContentPosition();
    });
})
