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
        var header ="<header id='header-main-section' class='aurora-theme' role='banner'>"
            + "<div id='header-main-section-west-part'>"
            + "<div id='bannerMenuDiv' tabindex='-1'><a id='bannerMenu' href='javascript:void(0);' alt='Banner Menu'></a><div id='menuContainer' role='application'></div></div>"
            + "<div id='brandingDiv' tabindex='-1'><a id='branding' href='javascript:void(0);' class='institutionalBranding'></a></div>"
            + "</header>";

        return $(header);
    },

    fillWestPart: function () {
        $('#bannerMenuDiv').attr("title",ResourceManager.getString("areas_label_browse_title"));
        $("#bannerMenu").attr("aria-label",ResourceManager.getString("areas_label_browse_description"));
        $('#branding').attr("alt", ResourceManager.getString("areas_label_branding"));
        //Add href to branding
        var path = $('meta[name=menuBaseURL]').attr('content') || document.location.href;
        var origin = document.location.origin || (document.location.protocol + '//' + document.location.host);
        var appUrl = path.substring(0,path.indexOf('/ssb'));
        $('#branding').attr('href', appUrl);
        $('#brandingDiv').attr("title", ResourceManager.getString("areas_label_home_title"));
        $('#branding').attr("aria-label", ResourceManager.getString("areas_label_home_description"));

    },

    placeEastPart: function (options) {
        var eastPartElement =  $("<div id='header-main-section-east-part'>"
            + "</div>");

        $('#header-main-section').append(eastPartElement.append(UserControls( options )));
        var notificationDiv = "<div id='notification-center' title='"+ResourceManager.getString("notification_title")+"'></div>";
        eastPartElement.append(notificationDiv);
    },

    addNavigationControls: function () {
        BreadCrumbAndPageTitle.create();
        setupBannerMenu();

        if($('meta[name=headerAttributes]').attr("content")){
            var headerAttributes = JSON.parse($('meta[name=headerAttributes]').attr("content"));
            BreadCrumbAndPageTitle.draw(headerAttributes);
        }

        var shortcuts = [
            'shift+home', function() {
                // click the first link in the home div.
                // just $().click() doesn't work as the element is not an input
                $('#branding')[0].click();
            },
            'alt+m', toggleBrowseMenu,
            'ctrl+shift+F', toggleSignInAndSignOut,
            'alt+n', toggleNotificationCenter,
            'alt+l',toggleToolsMenu,
            'alt+p',toggleProfileMenu
        ];
        key && key.bind.apply( window, shortcuts );
    },

    addBodyClickListenerToCloseAllMenus: function() {
        $('body').on('click', function (e) {
            closeAllMenus(e.target);
        });
    }

};

function setupBannerMenu() {
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
        $('#menu').addClass('hide').removeClass('show');
        $('#banerMenu').removeClass('show');
        $('#menuContainer').addClass('hide').removeClass('show');
        scrollableList.getLastFocusedElement().focus();
    } else {
        scrollableList.setLastFocusedElement(document.activeElement);
        $('#menu').addClass('show').removeClass('hide');
        $('#menuContainer').removeClass('hide').addClass('show');
        $('#menuList').find('li:first').focus();
        $('#bannerMenu').addClass('show');
    }
}

function toggleSignMenu() {
    scrollableList.closeMenu();
    ToolsMenu.closeMenu();
    if ($('#signInCanvas').is(':hidden')) {
        $('#signInCanvas').addClass('signIn-active');
        $('.signIn-mobile').addClass('signIn-expanded');
        $('#signList > .canvas-item:visible:first').focus();
    } else {
        $('#signInCanvas').removeClass('signIn-active');
        $('.signIn-mobile').removeClass('signIn-expanded');
        $('.signIn-mobile').focus();
    }
}

function toggleProfileMenu() {
    scrollableList.closeMenu();
    ToolsMenu.closeMenu();
    if ($('#userCanvas').is(':hidden')) {
        $('#userCanvas').addClass('user-active');
        $('#user').addClass('user-expanded');
        $('#userList > .canvas-item:visible:first').focus();
    } else {
        $('#userCanvas').removeClass('user-active');
        $('#user').removeClass('user-expanded');
        $('#user').focus();
    }
    return false;
}

function toggleToolsMenu() {
    scrollableList.closeMenu();
    SignInMenu.closeMenu();
    ProfileMenu.closeMenu();
    if ($('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').addClass('tools-active');
        $('#toolsButton').addClass('tools-expanded');
        $('#toolsList > .canvas-section-content .canvas-item:visible:first').focus();
    } else {
        $('#toolsCanvas').removeClass('tools-active');
        $('#toolsButton').removeClass('tools-expanded');
        $('#tools').focus();
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
    if (CommonContext.mepHomeContext) {
        MepDesciption.populateMepDescForOthers();
    }
    var toolsDiv = $("<div id='toolsButton' class='non-hierarchical-menu'><a href='javascript:void(0);' id='tools' aria-expanded='false' class='menu-icon'></a></div>");
    ControlBar.append(toolsDiv);
    ToolsMenu.initialize();

    ControlBar.node.find("#toolsButton").attr('title',ResourceManager.getString("areas_label_tools_title"));
    ControlBar.node.find("#tools").attr('aria-label', ResourceManager.getString("areas_label_tools_description"));
    if (CommonContext.mepHomeContext) {
        MepDesciption.populateMepDescForMobile();
    }

    // add user context
    if (CommonContext.user == null) {

        SignInMenu.initialize();
        SignInMenu.addItem("signIn", ResourceManager.getString("userdetails_signin"),undefined,
            function () {
                signIn();
            }
        );
        ControlBar.addAccessibilityInfo('#signIn',ResourceManager.getString("userdetails_signin_description"),ResourceManager.getString("userdetails_signin_title"));
        ControlBar.node.find('#signIn').attr('role', 'link');
        var guestSignInLink;
        if("true" == $('meta[name=guestLoginEnabled]').attr("content")) {
            SignInMenu.addItem("guestSignIn",ResourceManager.getString("guestuserdetails_signin"),undefined,
                function () {
                    window.location = ApplicationConfig.loginEndpoint;
                }
            );
            ControlBar.node.find('#guestSignIn').attr('role', 'link');
        }

    } else {
        var userDiv = $("<div id='userDiv' class='non-hierarchical-menu'><a id='user' aria-expanded='false' class='menu-icon' href='javascript:void(0);'></a></div>");
        ControlBar.append(userDiv);
        UserName.populateUserNameForOthers();
        ProfileMenu.initialize();
        UserName.populateUserNameForMobile();
        ProfileMenu.addItem("signOut", ResourceManager.getString("userdetails_signout"),undefined,
            function () {
                signOut();
            }
        );
        ControlBar.node.find("#userDiv").attr('title',ResourceManager.getString("userdetails_profile_title"));
        ControlBar.node.find("#user").attr('aria-label', ResourceManager.getString("userdetails_profile_description"));
    }

    if (options.showHelp && typeof(options.showHelp) == 'boolean' && options.showHelp || options.showHelp == null) {
        var helpLink = $("<a id='helpText' class='helpText pointer'>" + ResourceManager.getString("userdetails_help") + "</a>");
        ControlBar.append(helpLink);

        helpLink.click(function() {
            if (CommonContext.currentPage == "mainPage" || CommonContext.currentPage == null) {
                productName = "main";
            }

            var h = Application.getApplicationPath() + "/help/url";

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
    displayUI: "<footer class='banner-footer'  role='contentinfo'>"
       +"<div>&copy; <span class='year'></span> <span class='companyName'></span> <span class='otherInfo'></span></div>"
        +"</footer>",
    /**
     * @private
     *
     * Initialization method.
     */
    initialize: function() {
        $('body').append(Footer.displayUI);

        $( "footer.banner-footer" ).find($( "span.year")).text( $.i18n.prop("footer.copyright_year") );
        $( "footer.banner-footer" ).find($("span.companyName")).text( $.i18n.prop("footer.company_name"));
        $( "footer.banner-footer" ).find($("span.otherInfo")).text( $.i18n.prop("footer.other_info"));

        this.hideCopyrightNowOrAfterDelay();
    },


    /** method to hide footer now or after delay * */

    hideCopyrightNowOrAfterDelay : function () {
        var DAY_IN_MS = 24*60*60*1000;
        var now = new Date().getTime();

        var lastLoginTime = sessionStorage.getItem( 'xe.lastLogin.time' );
        var lastLoginName = sessionStorage.getItem( 'xe.lastLogin.name' );

        var currentUserName = window.CommonContext && CommonContext.user || '';
        console.log(currentUserName);

             sessionStorage.setItem('xe.lastLogin.time', now);
                if(currentUserName){
                    sessionStorage.setItem('xe.lastLogin.name', currentUserName);
                }
             if ((lastLoginName === currentUserName ) &&
                 (lastLoginTime + DAY_IN_MS > new Date().getTime())) {
                 $("footer.banner-footer").hide(); // already logged in today. Hide now
             } else {
                 var fadeCopyrightDelay;
                 if($('meta[name=footerFadeAwayTime]').attr("content")!="[:]"){
                     fadeCopyrightDelay =$('meta[name=footerFadeAwayTime]').attr("content");
                     fadeCopyrightDelay=parseInt(fadeCopyrightDelay);
                 }else{
                     fadeCopyrightDelay=2000;
                 }
                 $('footer.banner-footer').fadeOut(fadeCopyrightDelay);
             }

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
    },


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


var MepDesciption = {
    populateMepDescForOthers : function() {
        ControlBar.append($("<div id='mepDiv'><span>"+CommonContext.mepHomeContext+"</span></div>"));
    },

    populateMepDescForMobile : function() {
        ToolsMenu.addItem("mepDescForMobile",CommonContext.mepHomeContext,undefined, function() {}, true );
        var elem=ControlBar.node.find('#mepDescForMobile');
        elem.attr('tabindex', -1);
        elem.removeClass('pointer');
    }
};

var UserName = {
    populateUserNameForOthers: function() {
        ControlBar.append($("<div id='username'><span>"+CommonContext.user+"</span></div>'"));
    },

    populateUserNameForMobile : function() {
        ProfileMenu.addItem("usernameForMobile",CommonContext.user,undefined, function() {}, true );
        var elem = ControlBar.node.find('#usernameForMobile');
        elem.attr('tabindex', -1);
        elem.removeClass('pointer');
    }
};

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
    },

    addAccessibilityInfo: function(selector, elemAriaLabel, elemTitle) {
        var elemDiv = ControlBar.node.find(selector);
        elemDiv.attr('tabindex', 0);
        elemDiv.attr('aria-label',elemAriaLabel );
        var elementText=elemDiv.text();
        var spanElementId=elemDiv.attr('id')+"Title";
        var insideElement="<span tabindex='-1' title='"+elemTitle+"' id="+spanElementId+">"+elementText+"</span>";
        elemDiv.html(insideElement);
    }
};
