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
        var header ="<div id='header'><div id='header-main-section'>"
            + "<div id='header-main-section-west-part'>"
            + "<a id='bannerMenu' href='#' alt='Banner Menu'></a>"
            + "<a id='branding' href='#' class='institutionalBranding'></a>"
            + "</div></div>";

        return $(header);
    },

    addAttributesToHeader: function () {
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

    placeUserControls: function (options) {
        $('#header-main-section').append(UserControls( options ));
    },

    addNavigationControls: function () {
        BreadCrumb.create();
        ToolsMenu.initialize();
        setupBannerMenu();

        if (isMobile()) {
            SignInMenu.initialize();
            SignInMenu.addItem("sign-in", 'Sign In');
            SignInMenu.addItem("guest-sign-in", 'Guest SignIn');
        }

        var shortcuts = [
            'shift+home', function() {
                // click the first link in the home div.
                // just $().click() doesn't work as the element is not an input
                $('#branding')[0].click();
            },
            'alt+m', toggleBrowseMenu,
            'ctrl+shift+F', signIn,
            'alt+n', toggleNotificationCenter,
            'alt+l',toggleToolsMenu
        ];
        key && key.bind.apply( window, shortcuts );
    }

}

function setupBannerMenu(){
    $('#header').after("<div id=menuContainer role=application/>");
    $('#bannerMenu').on('click',function(e) {
        if ($('#menu').hasClass('show')) {
            $('#menu').addClass('hide');
            $('#menu').removeClass('show');
        } else {
            $('#menu').addClass('show');
            $('#menu').removeClass('hide');
        }
    });

    /*$('body').on('click',function(e){
     if ($('#menu').hasClass('show')) {
     $('#menu').addClass('hide');
     $('#menu').removeClass('show');
     }
     });*/
}

function toggleNotificationCenter(){
    window.notificationCenter.toggle();
}


function closeOpenMenus() {
    if (!$('#browseMenu').is(':hidden') && !$('#browseButtonState').hasClass('over') &&
        !$('#browseMenu').hasClass('over')) {
        toggleBrowseMenu()
    }

    if (!$('#toolsMenu').is(':hidden') && !$('#toolsMenu').hasClass('over')) {
        toggleToolsMenu()
    }
}

function closeAllMenus() {
    if (!$('#browseMenu').is(':hidden')) {
        toggleBrowseMenu()
    }

    if (!$('#toolsMenu').is(':hidden')) {
        toggleToolsMenu()
    }
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
    var browseMenu = $('#browseMenu');
    var browseButtonState = $('#browseButtonState');
    var browseButton = browseButtonState.find('#browseButton');
    if (browseMenu.is(':hidden')) {
        browseButton.removeClass("browseButton");
        browseButton.addClass("browseTab");

        browseButton.find('#browseArrow').removeClass('browseButtonDownArrow');
        browseButton.find('#browseArrow').addClass('upArrow');

        browseButtonState.addClass('active over');

        closeOpenMenus();
        browseMenu.slideDown('normal', function() {
            // add a handler to close the Browsemenu when the mouse is clicked outside
            $('body').click(function() {
                closeOpenMenus();
            });

            // scroll the selectedItem into view
            scrollSelectedItemIntoView();

        });

        $('#browseButtonState, #browseMenu').bind('mouseenter', function() {
            $(this).addClass("over");
        });
        $('#browseButtonState, #browseMenu').bind('mouseleave', function() {
            $(this).removeClass("over");
        });
        $('#browseMenu ul:first li:first').focus();

    } else {
        browseButton.removeClass("browseTab");
        browseButton.addClass("browseButton");

        browseButton.find('#browseArrow').removeClass('upArrow');
        browseButton.find('#browseArrow').addClass('browseButtonDownArrow');

        browseMenu.slideUp('normal', function() {
            browseButtonState.removeClass('active');
        });
        browseButton.mouseleave();
        // force clearing any existing handler
        $('body').unbind('click');
        $('#menuArrow').focus();
    }
    return false;
}

function toggleToolsMenu() {
    if ($('#toolsMenu').is(':hidden')) {
        $('#toolsButton').removeClass("toolsButton");
        closeOpenMenus();
        $('#toolsMenu').slideDown('normal', function() {
            // add a handler to close the Browsemenu when the mouse is clicked outside
            $('body').click(function() {
                closeOpenMenus();
            });
        });

        $('#toolsMenu').bind('mouseenter', function() {
            $(this).addClass("over");
        });
        $('#toolsMenu').bind('mouseleave', function() {
            $(this).removeClass("over");
        });

        $('#toolsMenu').find('.selectedToolsItem').focus();
    } else {
        $('#toolsButton').addClass("toolsButton");
        $('#toolsMenu').slideUp('normal');
        $('.toolsButton').mouseleave();
        // force clearing any existing handler
        $('body').unbind('click');
    }
    return false;
}


function toggleSignInMenu() {
    if ($('#signInMenu').is(':hidden')) {
        $('#signInButton').removeClass("signInButton");
        closeOpenMenus();
        $('#signInMenu').slideDown('normal', function() {
            // add a handler to close the Browsemenu when the mouse is clicked outside
            $('body').click(function() {
                closeOpenMenus();
            });
        });

        $('#signInMenu').bind('mouseenter', function() {
            $(this).addClass("over");
        });
        $('#signInMenu').bind('mouseleave', function() {
            $(this).removeClass("over");
        });

        $('#signInMenu').find('.selectedToolsItem').focus();
    } else {
        $('#signInButton').addClass("toolsButton");
        $('#signInMenu').slideUp('normal');
        $('.signInButton').mouseleave();
        // force clearing any existing handler
        $('body').unbind('click');
    }
    return false;
}


function signIn(){
    $('#signInText')[0].click();
}


function UserControls( options ) {

    ControlBar.initialize();

    var toolsDiv = $("<div id='toolsButton'><a id='tools' href='#'></a></div>");
    ControlBar.append(toolsDiv);
    var toolsContainer = $("<div id='toolsContainer'/>");
    ControlBar.append(toolsContainer);


    // add user context
    if (CommonContext.user == null) {
        var location = $('meta[name=loginEndpoint]').attr("content") || ApplicationConfig.loginEndpoint;
        if (isMobile()) {
            var signInContainer = $("<div id='signInContainer'/>");
            ControlBar.append(signInContainer);
            var signInButton = $("<div id='signInButton'><a id='signInText'  href='#'>ddd</a></div>");
            ControlBar.append(signInButton);
        } else {
            var signInDiv = $("<div id='signInDiv'><a id='signInText' href="+location+">"+ResourceManager.getString("userdetails_signin")+"</a></div>");
            ControlBar.append(signInDiv);
        }

    } else {
        var userDiv = $("<div id='userDiv'><a id='user' href='#'></a><span id='username'>"+CommonContext.user+"</span></div>");
        ControlBar.append(userDiv);
    }
    var notificationDiv = "<div id='notification-center'></div>";
    ControlBar.append(notificationDiv);


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
        + "<span id='breadcrumbHeader'>"
        + "</span>"
        + "</div>"),

    create: function () {
        $('#header').append(BreadCrumb.UI);
    },

    setBreadcrumbLeaf : function(breadCrumbItems,pageTitle) {
        BreadCrumb.updateBreadcrumbItems(breadCrumbItems);
        BreadCrumb.addBackButton();
        var breadcrumbItemLeaf = BreadCrumb.items[BreadCrumb.items.length-1];
        BreadCrumb.drawItem(breadcrumbItemLeaf);
        BreadCrumb.showPageTitleAsBreadcrumb(pageTitle);
    },

    setFullBreadcrumb : function(breadCrumbItems) {
        BreadCrumb.updateBreadcrumbItems(breadCrumbItems);
        _.each(BreadCrumb.items,function(breadcrumItem){
            BreadCrumb.drawItem(breadcrumItem);
        });
        this.registerBreadcrumClickListener();
    },

    updateBreadcrumbItems: function(breadcrumbItems){
        var index = 0;
        $.each(breadcrumbItems, function(label, url) {
            index = index + 1;
            var breadCrumbItem = new BreadCrumbValueObject(index,label, url.trim());
            BreadCrumb.items.push(breadCrumbItem);
        });
    },

    drawItem: function (item) {
        var cHeader = BreadCrumb.UI.find('#breadcrumbHeader');
        var breadcrumbItem = "<span class='breadcrumbButton' data-id='"+item.id+"' href='#'>"+item.label+"</span>";
        if(item.url.length){
            breadcrumbItem = "<a class='breadcrumbButton' data-id='"+item.id+"' href='#'>"+item.label+"</a>";
        }
        cHeader.append(breadcrumbItem);
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
            $('#breadcrumbHeader').addClass('hidden');
        }
    },

    registerBreadcrumClickListener: function(){
        $('a.breadcrumbButton').on('click',function(){
            var location = BreadCrumb.getBreadCrumbNavigationLocation($(this).attr('data-id'));
            window.location = location;
        })
    },

    registerBackButtonClickListener: function(){
        $('#breadcrumbBackButton').on('click',function(){
            var breadcrumbItem =  $('.breadcrumbButton:last').attr('data-id');
            var location = BreadCrumb.getPreviousBreadCrumbNavigationLocation(breadcrumbItem);
            window.location = location;
        })
    },

    getBreadCrumbNavigationLocation: function(breadcrumbId){
        var navigationUrl;
        $.each( BreadCrumb.items, function( index, breadcrumbObject ) {
            if(breadcrumbObject.id == parseInt(breadcrumbId)){
                navigationUrl = Application.getApplicationPath() + breadcrumbObject.url;
                return false;
            }
        });

        return navigationUrl;
    },

    getPreviousBreadCrumbNavigationLocation: function(breadcrumbId){
        var previousNavigableURL = "";
        var itemsWithURL = BreadCrumb.items.filter(function(breadcrumb) {
           return (breadcrumb.url.length > 0 && (breadcrumb.id < parseInt(breadcrumbId))) ;
        });

        var previousBreadcrumbWithURL = _.last(itemsWithURL, [1]);
        if(previousBreadcrumbWithURL.length){
            previousNavigableURL = Application.getApplicationPath() + previousBreadcrumbWithURL[0].url;
        }
        return previousNavigableURL;
    }
};


var TitlePanel = {
    create: function (pageTitle) {
        if(!_.isUndefined(pageTitle) && pageTitle.trim().length){
            $('#header').append("<div id='title-panel'>"+pageTitle+"</div>");
        }
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

function ScrollableMenuTable(root) {
    /**
     * Flag to check if the ScrollableList is initialized
     * @type Boolean
     * @default false
     */
    this.initialized = false,
    /**
     * The scrolling speed.
     * @type Number
     * @default 5
     */
        this.speed = 5,
    /**
     * The height of the scrollable components.
     * @type Number
     * @default 110
     */
        this.height = 110,
    /**
     * @private
     *
     * The JavaScript interval id used to control scroll behavior.
     * @type Number
     */
        this.interval = null,
    /**
     * @private
     *
     * The JQuery object representing the currently selected list during scrolling.
     * @type Element
     */
        this.selectedList = null,
    /**
     * @private
     *
     * The JQuery object representing the last selected list item.
     * @type Element
     */
        this.selectedListItem = null,
    /**
     * @private
     *
     * The internal marker suffixed to all generated ids.
     * @type String
     * @default "list_"
     */
        this.marker = "list_",
    /**
     * Total number of columns to display on initialization
     */
        this.totalColumns = 2,
    /**
     * Total number of columns that are added at runtime
     */
        this.numColumns = 0,
    /**
     * The root component holding the menu
     */
        this.root = root,
    /**
     * Events associated with the ScrollableList.
     */
        this.events = {
            click: "navigationItemClick"
        },

    /**
     * Keyboard navigation keys
     */
        this.MOVE_LEFT = 37,
        this.MOVE_RIGHT = 39,
        this.MOVE_UP = 38,
        this.MOVE_DOWN = 40,
        this.SELECT_KEY_DOWN1 = 32,
        this.SELECT_KEY_DOWN2 = 13,
        this.CLOSE_KEY = 27,
        this.TAB_KEY = 9,

        this.construct = function () {
            this.initialize();
        },

    /**
     * ScrollableList UI component initialization method.
     */
        this.initialize = function() {
            // remove existing menu if any,
            while (this.numColumns > 0) {
                this.removeColumn();
            }
            this.findElement("#scrollableListContainer").empty();

            var thisObj = this;

            this.add(this.totalColumns);
            this.findElement('.navList > .scrollableListFolder').live('click', function() {
                thisObj.load($(this));
            });
            var menu = Navigation.menuList;
            for (var x in menu) {
                if (typeof menu[x] == "function") {
                    continue;
                }
                if (x != "none") {
                    if (menu[x] instanceof Array) {
                        this.findElement('.navList:first').append("<li id='" + this.marker + x + "'  class='parent scrollableListFolder'  tabindex='0' role='treeitem' aria-expanded='false'><span>" + x + "</span></li>");
                    } else {
                        this.findElement('.navList:first').append("<li class='scrollableListItem'  tabindex='0' role='treeitem' aria-expanded='false'><span title='" + menu[x] + "'>" + menu[x] + "</span></li>");
                    }
                }
            }
            this.refresh();
            this.attachScrollButtonHandlers();
            //Intialise keyboard shortcut for Browse menu
            this.initializeKeyboardShortcuts()
            this.initialized = true;
        },

        this.findElement = function (expr) {
            if (expr != undefined && $.trim(expr) != "") {
                return $(this.root + ' ' + expr);
            } else {
                return $(this.root);
            }
        },

        this.initializeKeyboardShortcuts = function() {
            var thisObj = this;
            $('#browseMenu li').live('keydown', function(e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                var hasClassHeader = $(this).parents('.columns:first').hasClass('header');
                var prevColumnInColCont = $(this).parents('.columns:first').prev('.columns');
                var listContainer = $(this).parents('.#scrollableListContainer:first');
                var mainPageFlag = $(e.target).parents('#mainMenuContainer:first').length;
                $('#browseButtonState').addClass("over");
                $('#browseMenu').addClass("over");
                switch (code) {
                    case thisObj.MOVE_LEFT://left arrow key is pressed
                        // if its not the first column in browse menu
                        if (!hasClassHeader) {
                            if (prevColumnInColCont.length) {
                                prevColumnInColCont.find('li.selectedListItem').focus();
                            }
                            else {
                                listContainer.find('.columns:first li.selectedListItem').focus();
                            }
                        }
                        break;
                    case thisObj.MOVE_RIGHT://right arrow key is pressed
                        // if its not a leaf node and not a selected list item do click()
                        if ($(this).hasClass('scrollableListFolder') && !($(this).hasClass('selectedListItem'))) {
                            $(this).click();
                        } else if ($(this).hasClass('selectedListItem')) {
                            if (hasClassHeader) {
                                listContainer.find('#columnsContainer .columns:first li:first').focus();
                            }
                            //if its a first list is in scrollableListContainer
                            else if ($(this).parents('.columns:first').next('.columns').length) {
                                if (!($(this).hasClass('scrollableListFolder'))) break;  //If its not a scrollableListFolder don't move the focus to next list
                                $(this).parents('.columns:first').next('.columns').find('li:first').focus();
                            }
                        }
                        break;
                    case thisObj.MOVE_UP: //up arrow key is pressed : select the previous list element if exits
                        if ($(this).prev('li').length) {
                            $(this).prev('li').focus();
                        }
                        break;
                    case thisObj.MOVE_DOWN://down arrow key is pressed : select the next list element if exits
                        if ($(this).next('li').length) {
                            $(this).next('li').focus();
                        }
                        break;
                    case thisObj.SELECT_KEY_DOWN1://Spacebar key is pressed
                        $(this).click();
                        break;
                    case thisObj.SELECT_KEY_DOWN2://Enter key is pressed
                        $(this).click();
                        break;
                    case thisObj.CLOSE_KEY://Esc key is pressed
                        if (mainPageFlag) {
                            break;
                        }
                        else {
                            $('#browseArrow').click();
                            $('#menuArrow').focus();
                        }
                        break;
                    case thisObj.TAB_KEY://Tab key is pressed
                        if (mainPageFlag) {
                            break;
                        }
                        else {
                            return false;
                            break;
                        }
                }
                $('#browseButtonState').removeClass("over");
                $('#browseMenu').removeClass("over");
            });
        },

        this.clickListItem = function(indexList) {
            for (var x in indexList) {
                var column = this.findElement('.columns')[x];
                if (column != undefined) {

                    var item = $(column).find('.navList > li')[indexList[x]];
                    if (item != undefined && item.length > 0) {
                        item.click();
                    }
                }
            }
        },

        this.reinitialize = function(len) {
            if (this.initialized == true) {
                this.initialized = false;


                if (this.selectedListItem) {
                    this.load(this.selectedListItem);
                    this.initialized = true;
                    return;
                }

                var menu = Navigation.menuList;
                for (var x in menu) {
                    if (typeof menu[x] == "function") {
                        continue;
                    }

                    if (x != "none") {
                        if (len == 1) {
                            this.findElement('.navList:first').append("<li id='" + this.marker + x + "'  class='parent scrollableListFolder' tabIndex='0' role='treeitem' aria-expanded='false' aria-level='1'><span>" + x + "</span></li>");
                        } else {
                            var temp = "list_" + x;
                            this.findElement(this.escapeLocator('#' + temp)).remove();
                            this.findElement('.selectedListItem').removeClass("selectedListItem");
                            this.findElement('.navList:first').append("<li id='" + this.marker + x + "'  class='parent scrollableListFolder' tabIndex='0' role='treeitem' aria-expanded='false' aria-level='1'><span>" + x + "</span></li>");
                        }
                    }
                }
                this.refresh();
                this.initialized = true;
            }
        },

        this.escapeLocator = function (itemId) {
            return itemId.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
        },
    /**
     * Adds an additional ScrollableList to the parent component.
     * @param {Number} count The number of list components to add (optional).
     */
        this.add = function(count) {
            if (!count
                || count <= 0) {
                count = 1;
            }

            var trackWidth = 0;
            for (var x = 0; x < count; x++) {
                if (x == 0) {
                    this.findElement('#scrollableListContainer').append(""
                            + "<div id='btn-l' class='btn-l' />"
                    );
                    this.findElement('#scrollableListContainer').append(""
                            + "<div id='columnsContainer' role='group'><div id='columnsContainerTrack' /></div>"
                    );


                    this.findElement('#scrollableListContainer').append(""
                            + "<div id='btn-r' class='btn-r' />"
                    );

                } else {
                    this.addColumn();
                }
            }
        },
    /**
     * Adds a column to the ScrollableList
     */
        this.addColumn = function() {
            var mainMenuSep = (this.findElement('#columnsContainerTrack').parents("#mainMenuContainer").length > 0)
                ? "<div class='mainpage-column-sep' ></div>"
                : "";

            this.findElement('#columnsContainerTrack').append(""
                + "<div class='columns' >"
                + "<span class='scrollUpButton' ></span>"
                + "<div class='scrollContainer' >"
                + "<ul class='navList' role='group'></ul>"
                + mainMenuSep
                + "</div>"
                + "<span class='scrollDownButton' ></span>"
                + "</div>");

            this.numColumns++;
            var columnWidth = this.findElement('#columnsContainerTrack').find('.columns:last').width();
            this.findElement('#columnsContainerTrack').css('width', ((this.numColumns * columnWidth) + this.numColumns) + 'px');


            this.setScrollButtonStates();
        },
    /**
     * Removes the last column from the ScrollableList and sets the columnsContainerTrack width
     */
        this.removeColumn = function(col) {
            this.findElement('#columnsContainerTrack').find('.columns:last').remove();

            this.numColumns--;
            var trackWidth = this.findElement('#columnsContainerTrack').find('.columns:first').width();
            this.findElement('#columnsContainerTrack').css('width', ((this.numColumns * trackWidth) + this.numColumns) + 'px');
        },

    /**
     * Loads list content and populates the next list for a selected list item.
     * @param {Element} item The JQuery element for the selected list item.
     */


        this.load = function(item) {
            var loc = item.attr('id').replace(this.marker, "").split("_");
            var thisObj = this;

            item.parent().parent().parent().nextAll().find('.navList').each(function(i) {
                thisObj.removeColumn();
            })

            this.addColumn();

            // show loader to the newly added column
            // hidden below after data is loaded
            var scrollContainer = null;
            if (!item.parents('.columns').hasClass('header')) {
                scrollContainer = item.parents('.columns').next().find('.scrollContainer');
            }
            else scrollContainer = item.parents('.#scrollableListContainer:first').find('#columnsContainer .columns:first').find('.scrollContainer');
            scrollContainer.addClass('loader');

            var next = null;
            if (item.parent().hasClass('navListStart')) {
                next = item.parent().parent().parent().next().next().find('.navList:first');
            } else {
                next = item.parent().parent().parent().next().find('.navList');
            }

            next.css("top", "0");

            this.selectedItem(item.attr('id'));

            var list = Navigation.menuList;

            for (var x = 0; x < loc.length; x++) {
                if (list[loc[x]]) {
                    if (list[loc[x]] instanceof Array) {
                        list = list[loc[x]];
                    }
                }
            }

            for (var x in list) {
                if (typeof list[x] == "function") {
                    continue;
                }

                if ((list[x].path == "null.zul" || list[x].path == "null") && x != Navigation.nonLeafNavEntryValObjKey) {
                    var name = list[x].name;
                    this.loadFromService(item, name);
                }

                var id = item.attr('id') + "_" + x;
                var columnIndex = next.parents('.columns:first').index() + 1;

                if ((list[x] instanceof Array || list[x]['type'] == 'MENU') && x != Navigation.nonLeafNavEntryValObjKey) {

                    var liCaption = this.getCaption(list[x][Navigation.nonLeafNavEntryValObjKey])['caption'];
                    var liTitle = this.getCaption(list[x][Navigation.nonLeafNavEntryValObjKey])['title'];

                    var test = $('<li></li>');
                    test.addClass('parent scrollableListFolder')
                        .attr('id', id)
                        .attr('tabindex', '-1')
                        .attr('role', 'treeitem')
                        .attr('aria-expanded', 'false')
                        .attr('aria-level', columnIndex);
                    var span = $('<span></span>');
                    span.attr('title', liTitle);
                    span.text(liCaption);
                    test.append(span);
                    next.append(test);


                } else if (list[x] instanceof NavigationEntryValueObject) {

                    if (x != Navigation.nonLeafNavEntryValObjKey) {
                        var navItem = list[x];
                        var liCaption = this.getCaption(list[x])['caption'];
                        var liTitle = this.getCaption(list[x])['title'];
                        var liTag = "<li id=\"" + id + "\" class=\"scrollableListItem\" tabindex=\"-1\"  role=\"treeitem\"  aria-level=" + columnIndex + ">" +
                            "<span title=\"" + liTitle + "\">" +
                            "<a href=\"" + navItem.url + "\">" +
                            liCaption +
                            "</a>" +
                            "</span>" +
                            "</li>";

                        var leaf = $(liTag);
                        next.append(leaf);
                    }

                } else {
                    ErrorManager.show("Unknown entry encountered.");
                }
            }

            // remove loader after data is loaded
            scrollContainer.removeClass('loader');
            scrollContainer.find('li:first').focus();
            this.refresh();

            EventDispatcher
                .dispatchEvent(this.events.click, item.attr('id'));

            // NavigationRC might have more menu items to be fetched automatically
            NavigationRC.loadNext(thisObj);

            // Remove column separator menu items has scroll bar.
            var menuItem = scrollContainer.find(".mainpage-column-sep");

            if ((menuItem.length > 0)
                && (scrollContainer.height() < scrollContainer.attr("scrollHeight"))) {
                menuItem.css({display: "none"});
                scrollContainer.parent().css({width: "240px"});
            }
        },

        this.getCaption = function (navEntry) {
            var captionInfo = [];

            captionInfo['caption'] = navEntry.pageCaption;
            captionInfo['title'] = navEntry.pageCaption;
            if (navEntry.captionProperty == "true") {
                captionInfo['caption'] = captionInfo['caption'] + "<br/>" + "(" + navEntry.form + ")";
                captionInfo['title'] = captionInfo['title'] + " (" + navEntry.form + ")";
            }

            return captionInfo;

        },


//element id's pre-fixed with * needs to be escaped when using
        // as jquery id selectors.
        this.escapeId = function (itemId) {
            return itemId.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
        },


        this.escapeApostrophe = function (str) {
            return str.replace(/(['])/g, '\\$1');
        },

        this.navigateScript = function (listItem) {
            return "Navigation.navigate(&#39;" + listItem.id + "&#39;)";
        },

        this.scrollableListItemClickHandler = function (listItem) {
            return "toggleBrowseMenu(); " + this.navigateScript(listItem);

        },

    /**
     * loads data using the service
     * @param item jQuery object of the clicked HTML element
     * @param name the name in the NavigationEntryValueObject
     */
        this.loadFromService = function(item, name) {
            this.selectedListItem = item;
            Navigation.setScrollableMenu(this);
            Navigation.nextNavItem(name, item);
        },

        this.setSelectedListItem = function (id) {
            this.selectedItem(id);
            var node = this.findElement('.navList > .scrollableListFolder[id="' + id + '"]');
            if (node.length == 0) {  // this is not a folder node
                // check for leaf nodes
                var node = this.findElement('.navList > .scrollableListItem[id="' + id + '"]');
                if (node.length == 0)
                    return;
            }
            this.selectedListItem = node;
        },

        this.selectedItem = function(id) {
            // for folder nodes
            var node = scrollableList.findElement('.navList > .scrollableListFolder[id="' + id + '"]');
            if (node.length == 0) {  // this is not a folder node
                // check for leaf nodes
                var node = scrollableList.findElement('.navList > .scrollableListItem[id="' + id + '"]');
                if (node.length == 0)
                    return;
                node.parent().find("li").removeClass("selectedListPage");
                node.addClass("selectedListPage");
                node.focus();
            } else {
                node.parent().find("li").removeClass("selectedListItem");
                node.parent().find("li").attr('aria-expanded', 'false');
                node.addClass("selectedListItem");
                node.attr('aria-expanded', 'true');
                node.focus();
            }
        },

        this.getSelectedListItem = function (id) {
            var node = this.findElement('.navList > .scrollableListFolder[id="' + id + '"]');
            if (node.length == 0) {  // this is not a folder node
                // check for leaf nodes
                var node = this.findElement('.navList > .scrollableListItem[id="' + id + '"]');
                if (node.length == 0)
                    return;
            }
            return node;
        },

    /**
     * Refreshes the scrolling state of all displayed list components.
     */
        this.refresh = function() {
            this.findElement('.navList').each(function(i) {
                if ($(this).height() > this.height) {
                    var up = $(this).parent().parent().find('.scrollUpButton');
                    if (!up.hasClass("upButton")) {
                        up.removeClass("upButtonDisabled");
                        up.addClass("upButton");
                        up.append("<span class='navUpArrow'></span>");
                    }

                    var down = $(this).parent().parent().find('.scrollDownButton');
                    if (!down.hasClass("downButton")) {
                        down.removeClass("downButtonDisabled");
                        down.addClass("downButton");
                        down.append("<span class='navDownArrow'></span>");
                    }
                } else {
                    var up = $(this).parent().parent().find('.scrollUpButton');
                    up.removeClass("upButton");
                    up.addClass("upButtonDisabled");
                    up.empty();

                    var down = $(this).parent().parent().find('.scrollDownButton');
                    down.removeClass("downButton");
                    down.addClass("downButtonDisabled");
                    down.empty();
                }
            });
        },


    /**
     * @private
     *
     * Callback method for scrolling a list up.
     */
        this.scrollup = function() {
            if (this.selectedList) {
                var top = this.selectedList.find('.navList').attr('offsetTop');
                var newTop = (top < 0) ? top + this.speed : top;

                this.selectedList.find('.navList').css("top", newTop + "px");
            }
        },
    /**
     * @private
     *
     * Callback method for scrolling a list down.
     */
        this.scrolldown = function() {
            if (this.selectedList) {
                var height = this.selectedList.find('.navList').attr('offsetHeight');
                var top = this.selectedList.find('.navList').attr('offsetTop');
                var newTop = ((height + top) > this.height) ? top - this.speed : top;

                this.selectedList.find('.navList').css("top", newTop + "px");
            }
        },
    /**
     * @private
     *
     * Attaches necessary handlers for left/right scroll buttons.
     */
        this.attachScrollButtonHandlers = function() {
            // scroll buttons --------------------------------
            var colWidth = this.findElement('#columnsContainerTrack').find('.columns:first').css('width');
            var isScrolling = false;

            function resetIsScrolling() {
                isScrolling = false;
            }

            this.findElement("#btn-l").css("visibility", "hidden");
            this.findElement("#btn-r").css("visibility", "hidden");

            // right button
            // -----------------------------------------------
            this.findElement("#btn-r").live("mouseover", function() {
                $(this).css({
                    "border-color" : "#369",
                    "background-position" : "-52px center"
                });
            });
            this.findElement("#btn-r").live("mouseout", function() {
                $(this).css({
                    "border-color" : "#666",
                    "background-position" : "-18px center"
                });
            });
            this.findElement("#btn-r").live("click", function() {
                if (!isScrolling) {
                    isScrolling = true;
                    this.findElement("#columnsContainerTrack").animate({
                        marginLeft: "-=" + colWidth
                    }, 500, function() {
                        this.setScrollButtonStates();
                        setTimeout(resetIsScrolling, 250);
                    });
                }
            });
            // left button
            // -----------------------------------------------
            this.findElement("#btn-l").live("mouseover", function() {
                $(this).css({
                    "border-color" : "#369",
                    "background-position" : "-36px center"
                });
            });
            this.findElement("#btn-l").live("mouseout", function() {
                $(this).css({
                    "border-color" : "#666",
                    "background-position" : "-1px center"
                });
            });
            this.findElement("#btn-l").live("click", function() {
                if (!isScrolling) {
                    isScrolling = true;
                    this.findElement("#columnsContainerTrack").animate({
                        marginLeft: "+=" + colWidth
                    }, 500, function() {
                        this.setScrollButtonStates();
                        setTimeout(resetIsScrolling, 250);
                    });
                }
            });
            // common
            this.findElement("#btn-r, #btn-l").live("mousedown", function() {
                $(this).css({
                    "border-color" : "#036"
                });
            });
            this.findElement("#btn-r, #btn-l").live("mouseup", function() {
                $(this).css({
                    "border-color" : "#369"
                });
            });
        },

        this.slideDownScrollButtons = function() {
            if (this.findElement("#btn-l").hasClass('visible')) {
                this.findElement("#btn-l").slideDown();
            }
            if (this.findElement("#btn-r").hasClass('visible')) {
                this.findElement("#btn-r").slideDown();
            }
        },

        this.slideUpScrollButtons = function() {
            if (this.findElement("#btn-l").hasClass('visible')) {
                this.findElement("#btn-l").slideUp();
            }
            if (this.findElement("#btn-r").hasClass('visible')) {
                this.findElement("#btn-r").slideUp();
            }
        },

        this.setScrollButtonStates = function() {
            var columnWidth = this.findElement('#columnsContainerTrack').find('.columns:first').width();
            var trackMarginLeft = this.findElement('#columnsContainerTrack').css('margin-left');
            trackMarginLeft = trackMarginLeft == 'auto' ? 0 : parseInt(trackMarginLeft);
            // left scroll
            if (trackMarginLeft == 0) {
                this.findElement("#btn-l").fadeOut(250);
                this.findElement("#btn-l").removeClass('visible');
            } else {
                this.findElement("#btn-l").fadeIn(250);
                this.findElement("#btn-l").addClass('visible');
            }
            // right scroll
            if (((this.numColumns * columnWidth) + trackMarginLeft) <= this.findElement('#columnsContainer').width()) {
                this.findElement("#btn-r").fadeOut(250);
                this.findElement("#btn-r").removeClass('visible');
            } else {
                this.findElement("#btn-r").fadeIn(250);
                this.findElement("#btn-r").addClass('visible');
            }
        },


        this.getPath = function(list, id, path) {
            if (path == null)
                path = '';

            if (list[id] != null) {
                return path += '/' + id;
            } else {
                for (var x in list) {
                    var p = path + '/' + x;

                    if (list[x] instanceof Array)
                        var newPath = this.getPath(list[x], id, p);
                    if (newPath != undefined) {
                        return newPath;
                    }
                }
            }
        }
}
;

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
    sectionHtml: $("<li><div class='menu-section'/><ul></ul></li>"),

    /**
     * HTML for rendering menu items
     */
    itemHtml: $("<li><div class='menu-item'></div></li>"),

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
        var d = sec.find('div');
        d.attr("id", id);
        d.text(label);
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
        var i = item.find('div');
        var handlerPostItemClick = this.callbackPostItemClick;
        i.attr('id', id);
        i.text(label);

        item.click(function (e) {
            if (callback)
                callback(e);
            handlerPostItemClick.call();
        });
        if (sectionId)
            this.canvas.find('#' + sectionId).next('ul').append(item);
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

var ToolsMenu = Object.create(NonHierarchicalMenu);
ToolsMenu.initialize = function() {
        $('#toolsButton').attr("title", ResourceManager.getString("areas_label_tools_shortcut"));
        $('#toolsButton').find('div div a').text(ResourceManager.getString("areas_label_tools"));
        $('#toolsContainer').prepend("<div id='toolsMenu'>"
            + "<div class='browseMenuShadow'>"
            + "<div id='toolsCanvas'></div>"
            + "</div>"
            + "</div>");
        this.dropDown = $("#toolsContainer");
        this.dropDown.find("#toolsCanvas").append("<ul/>")
        this.canvas = this.dropDown.find("#toolsCanvas ul");
        this.callbackPostItemClick = toggleToolsMenu;

        $('#toolsButton').bind("click", toggleToolsMenu);
        var parent=$('#toolsButton');
        if (parent.length > 0) {
            $('#toolsContainer').position({
                my: "right top",
                at: "right bottom",
                of: parent
            });
        }

}

var SignInMenu = Object.create(NonHierarchicalMenu);
SignInMenu.initialize = function() {
    $('#signInContainer').prepend("<div id='signInMenu'>"
        + "<div class='browseMenuShadow'>"
        + "<div id='signInCanvas'></div>"
        + "</div>"
        + "</div>");
    this.dropDown = $("#signInContainer");
    this.dropDown.find("#signInCanvas").append("<ul/>")
    this.canvas = this.dropDown.find("#signInCanvas ul");
    this.callbackPostItemClick = toggleSignInMenu;

    $('#signInButton').bind("click", toggleSignInMenu);
    var parent=$('#signInButton');
    if (parent.length > 0) {
        $('#signInContainer').position({
            my: "right top",
            at: "right bottom",
            of: parent
        });
    }

}



/**
 * Class to manage user controls on the top right corner of the Aurora header
 */
var ControlBar = {

    node: $("<div id='header-main-section-east-part'>"
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

    prepend: function(node, prependBeforeId) {
        if (prependBeforeId)
            this.node.find(appendAfterId).before(node);
        else
            this.node.prepend(node);
    }
}


$(document).ready(function(){
    var pageTitle = JSON.parse($('meta[name=menuDefaultBreadcrumbId]').attr("content")).pageTitle;
    if(isDesktop() || isTablet()){
        TitlePanel.create(pageTitle);
    }
    ContentManager.setContentPosition();
})
