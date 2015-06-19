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
    sectionHtml: $("<div class='canvas-section'></div>"),
    sectionSpanHtml: $("<span></span>"),


    /**
     * HTML for rendering menu items
     */
    itemHtml: $("<div class='canvas-item'/></div>"),
    itemSpanHtml: $("<span></span>"),

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
        if(id && label){
        var sec = this.sectionHtml.clone();
        var secSpan= this.sectionSpanHtml.clone();
        sec.attr("id", id);
        secSpan.text(label);
        sec.append(secSpan);
        this.canvas.append(sec);
        return sec;}

    },

    /**
     * removes the specified section
     * @param id
     */
    removeSection: function (id) {
        var sec = this.sectionHtml.clone();
        this.canvas.parent().find('#' + id).remove();
    },

    /**
     * removes the specified Item
     * @param id
     */
    removeItem: function (id) {
        this.canvas.parent().find('#' + id).remove();
    },


    /** readOnly/make Item Editable in a menu
     * * @param id
     */

    readOnlyItem:function (itemId) {
        toggleReadOnlyStatus(itemId, true);
    },
    makeItemEditable:function (itemId) {
        toggleReadOnlyStatus(itemId,  false);
    },


    /** hide/visible a menu item
     * * @param id
     */

  hideItem:function(itemId) {
       toggleVisibleStatus(itemId, false);

  },
  makeItemVisible:function (itemId) {
     toggleVisibleStatus(itemId,  true);
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
        var itemSpan= this.itemSpanHtml.clone();
        var handlerPostItemClick = this.callbackPostItemClick;
        if(id && label) {
            item.attr('id', id);
            item.attr('role', "menuitem");
            itemSpan.text(label);
            item.attr('tabindex', 0);
            item.addClass('pointer');
            item.on('click', _fnMouseEventsHandlerForMenu);
            item.on('keydown', _fnKeyBoardEventsHandlerForMenu);
            item.append(itemSpan);
            if (readonly != undefined && readonly == true) {
                item.attr("readonly", readonly).css({"color": "#d6d6d6", "cursor": "unset"});
            }
            if (sectionId)
                this.canvas.find('#' + sectionId).append(item);
            else
                this.canvas.append(item);
            return item;
        }

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
                    _fnAction(e);
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

    fnSetLastFocus:function(){
        window.lastFocus = $(document.activeElement);
    },

    fnSetFocusOnCloseMenuItems:function(){
        if (window.lastFocus != null) {
            $(window.lastFocus).focus();
        }
    }
};

function toggleReadOnlyStatus(id,status){
    if (status==true ){
        ToolsMenu.canvas.find('#' + id).attr("readonly", true).css({"color": "#d6d6d6", "cursor": "unset"});
    }
    if(status==false ){
        ToolsMenu.canvas.find('#' + id).attr("readonly", false).css({"color": "#000", "cursor": "pointer"});
    }
};


function toggleVisibleStatus(id,status){
        if (status==false ){
            ToolsMenu.canvas.parent().find('#' + id).css({"display": "none"});
        }
        if(status==true ){
            ToolsMenu.canvas.parent().find('#' + id).css({"display": "block"});
        }

};


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
};
ProfileMenu.closeMenu = function() {
    if (!$('#userCanvas').is(':hidden')) {
        $('#userCanvas').removeClass('user-active');
        $('#user').removeClass('user-expanded');
        if(window.lastFocus !=null) {
            $(window.lastFocus).focus();
        }
    }
};

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
};
ToolsMenu.closeMenu = function() {
    if (!$('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').removeClass('tools-active');
        $('#toolsButton').removeClass('tools-expanded');
        if(window.lastFocus !=null) {
            $(window.lastFocus).focus();
        }
    }
};


ToolsMenu.toggleVisibleStatus = function(id , status) {
    alert(" inside ToggleStatus" +status + id);
    if (status==false ){
        alert(" inside ToggleStatus hide"+status+""+id);
        this.canvas.parent().find('#' + id).css({"display": "none"});
    }
    if(status==true ){
        alert(" inside ToggleStatus visible"+status+""+id);
        this.canvas.parent().find('#' + id).css({"display": "block"});
    }

    //(itemId, toggleStatus);

};


var SignInMenu = Object.create(NonHierarchicalMenu);
SignInMenu.initialize = function() {
    var signInDom = $("<div id='signInButton' class='non-hierarchical-menu'  ><a class='signIn-mobile menu-icon' aria-expanded='false' href='javascript:void(0);' />"
        + "<div id='signInCanvas'><div id='signInMenu'><div id='signList' class='signIn-list'>"
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
};
SignInMenu.closeMenu = function() {
    if (!$('#signInCanvas').is(':hidden')) {
        $('#signInCanvas').removeClass('signIn-active');
        $('.signIn-mobile').removeClass('signIn-expanded');
        if(window.lastFocus !=null) {
            $(window.lastFocus).focus();
        }
    }
};

