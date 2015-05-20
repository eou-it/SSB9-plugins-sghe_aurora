/*********************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

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
    addItem: function (id, label, sectionId, callback, readonly) {
        var KEY_CODE = {
            ENTER: 13
            ,       ESC: 27
            ,       LEFT_ARROW: 37
            ,       UP_ARROW: 38
            ,       RIGHT_ARROW: 39
            ,       DOWN_ARROW: 40
            ,       SPACE: 32
            ,       TAB: 9
        };

        var item = this.itemHtml.clone();
        var handlerPostItemClick = this.callbackPostItemClick;
        item.attr('id', id);
        item.attr('role',"link");
        item.text(label);
        item.attr('tabindex',0);
        item.addClass('pointer');
        item.on('click',_fnMouseEventsHandlerForMenu);
        item.on('keydown',_fnKeyBoardEventsHandlerForMenu);
        if (readonly!= undefined && readonly == true) {
            item.attr("readonly", "readonly").off('click');
        }
        if (sectionId)
            this.canvas.find('#' + sectionId).after(item);
        else
            this.canvas.append(item);
        return item;

        function _fnMouseEventsHandlerForMenu(e){
            _fnAction(e);
        }

        function isTabNavigation(elem) {
            var isMenuStyle = $(elem).closest('.non-hierarchical-menu').find('.menu-icon:visible');
            if (isMenuStyle.length>0) {
                return false
            } else {
                return true;
            }
        }

        function _fnKeyBoardEventsHandlerForMenu(e){
            var currentTarget = e.target;
            var code = (e.keyCode ? e.keyCode : e.which);
            switch(code)    {
                case KEY_CODE.DOWN_ARROW:
                    var nextElem =  $(currentTarget).nextAll('.canvas-item').first();
                    if(!isTabNavigation(currentTarget) && nextElem.length){
                        nextElem.focus();
                    }
                    break;
                case KEY_CODE.UP_ARROW:
                    var prevElem =  $(currentTarget).prevAll('.canvas-item').first();
                    if(!isTabNavigation(currentTarget) && prevElem.length){
                        prevElem.focus();
                    }
                    break;
                case KEY_CODE.ENTER:
                    _fnAction(e);
                    break;
                case KEY_CODE.SPACE:
                    _fnAction(e)
                    break;
                case KEY_CODE.ESC:
                    $(currentTarget).closest('.non-hierarchical-menu').find('.menu-icon').click();
                    break;
                case KEY_CODE.TAB:
                    if(!isTabNavigation(currentTarget)){
                        e.preventDefault();
                    }
                    break;
            }
            return true;
        }

        function _fnAction(e) {
            var readonlyAttr = item.attr("readonly");
            if (readonlyAttr== undefined || readonlyAttr == false) {
                if (callback)
                    callback(e);
                handlerPostItemClick.call();
            }
        }
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
    ControlBar.node.find('#toolsButton').attr("title", ResourceManager.getString("areas_label_tools_shortcut"));
    ControlBar.node.find('#toolsButton').find('div div a').text(ResourceManager.getString("areas_label_tools"));

    ControlBar.node.find('#toolsButton').append("<div id='toolsCanvas'>"
        + "<div id='toolsMenu'><div id='toolsList' class='tools-list'></div>"
        + "</div>"
        + "</div>");
    this.dropDown = ControlBar.node.find("#toolsCanvas");
    this.canvas =  ControlBar.node.find('#toolsList');
    this.callbackPostItemClick = toggleToolsMenu;

    ControlBar.node.find('#tools').bind("click", toggleToolsMenu);
}
ToolsMenu.closeMenu = function() {
    if (!$('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').removeClass('tools-active');
        $('#tools').removeClass('tools-expanded');
    }
}

var SignInMenu = Object.create(NonHierarchicalMenu);
SignInMenu.initialize = function() {
    var signInDom = $("<div id='signInButton' class='non-hierarchical-menu'  ><a class='signIn-mobile menu-icon'  href='javascript:void(0);' />"
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

