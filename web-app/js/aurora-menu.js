/*********************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

function ScrollableMenuTable(root, menuList) {
    /**
     * Flag to check if the ScrollableList is initialized
     * @type Boolean
     * @default false
     */
      this.initialized = false;
    /**
     * The scrolling speed.
     * @type Number
     * @default 5
     */
        this.speed = 5;
    /**
     * The height of the scrollable components.
     * @type Number
     * @default 110
     */
        this.height = 110;
    /**
     * @private
     *
     * The JavaScript interval id used to control scroll behavior.
     * @type Number
     */
        this.interval = null;

        this.menuList = [];

    /**
     * @private
     *
     * The internal marker suffixed to all generated ids.
     * @type String
     * @default "list_"
     */
        this.marker = "list_";

    /**
     * The root component holding the menu
     */
        this.root = root;

     /** last focused element **/

        this.lastFocusedElement;

    /**
     * Events associated with the ScrollableList.
     */
        this.events = {
            click: "navigationItemClick"
        };

        this.setMenuList= function(menuList){
            this.menuList = menuList;
        };

        this.getMenuList = function(){
            return menuList;
        };

        this.construct = function () {
            this.initialize();
        };

        this.setLastFocusedElement = function(target){
            this.lastFocusedElement = target;
        };

        this.getLastFocusedElement = function(){
            return this.lastFocusedElement;
        }

        var currentSelectedMenuFullPath = null;

        var _that;

        var SPLIT_CHAR = "_";

        var KEY_CODE = {
                    ENTER: 13
            ,       ESC: 27
            ,       LEFT_ARROW: 37
            ,       UP_ARROW: 38
            ,       RIGHT_ARROW: 39
            ,       DOWN_ARROW: 40
        };



        function _fnGetSelectedMenuName(){
            var menuName = currentSelectedMenuFullPath;
            menuName = menuName.substr(menuName.lastIndexOf(SPLIT_CHAR));
            menuName = menuName.replace(SPLIT_CHAR,"");
            return menuName;
        }

        function _fnGetParentMenuPath(){
           var currMenuFullPath = currentSelectedMenuFullPath;
           var parentMenuPath = currMenuFullPath.substr(0,currMenuFullPath.lastIndexOf(SPLIT_CHAR));
           return parentMenuPath;
        }

       function _fnCreateMenuUI(){
            var menu = "<nav id='menu' role='application' class='menu-wrapper hide menu-common'>"+
                        "<ul id='menuList' class='menu-common'></ul></nav>";
            $(root).append(menu);
       };

       function _fnSetupMenuItemEvent()    {
            $('#menuList > .scrollableListFolder').on('click',_fnMouseEventsHandlerForMenu);
            $('#menuList > .scrollableListFolder').on('keydown',_fnKeyBoardEventsHandlerForMenu);
        };

        function _fnMouseEventsHandlerForMenu(e){
            var currTarget = e.target;
            var target = $(currTarget).closest('li');
            if(_isLeafNode(currTarget)){
                $(target).find('a:first')[0].click();
            } else {
                _fnOpenUpSubMenu(target);
            }
        };

        function _fnOpenUpSubMenu(target) {
            var menuName = $(target).attr('id');
            if(_isNotOriginMenu(menuName)){
                _that.load(menuName);
            } else {
                _fnMenuInitialize();
            }
        };

        function _fnSetFocusToLastElement(){
           var target = _that.getLastFocusedElement();
            if(target){
                $(target).focus();
            }
        };

        function _fnKeyBoardEventsHandlerForMenu(e){
            var currentTarget = e.target;
            var code = (e.keyCode ? e.keyCode : e.which);
            if((code !==KEY_CODE.LEFT_ARROW) && (code!==KEY_CODE.RIGHT_ARROW))  {
                switch(code)    {
                    case KEY_CODE.ESC:
                        _fnHideBannerMenu();
                        _fnSetFocusToLastElement();
                        break;
                    case KEY_CODE.ENTER:
                        if(_isLeafNode(currentTarget))    {
                           $(currentTarget).find('a:first')[0].click();
                        } else {
                            _fnOpenUpSubMenu(currentTarget);
                        }
                        break;
                    case KEY_CODE.DOWN_ARROW:
                        if($(currentTarget).next('li').length){
                            $(currentTarget).next('li').focus();
                        }
                        break;
                    case KEY_CODE.UP_ARROW:
                        if($(currentTarget).prev('li').length){
                            $(currentTarget).prev('li').focus();
                        }
                        break;
                }
            } else {
                _fnLeftAndRightNavigation(code,currentTarget);
            }
            return false;
        };

        function _fnLeftAndRightNavigation(keyCode, currentTarget){
            if(isRTLMode()){
                switch(keyCode){
                    case KEY_CODE.LEFT_ARROW:
                        _fnLeftKeyRTLModeRightKeyLTRMode(currentTarget);
                        break;
                    case KEY_CODE.RIGHT_ARROW:
                        _fnRightKeyRTLModeLeftKeyLTRMode(currentTarget);
                        break;
                }
              } else {
                switch(keyCode){
                    case KEY_CODE.RIGHT_ARROW:
                        _fnLeftKeyRTLModeRightKeyLTRMode(currentTarget);
                        break;
                    case KEY_CODE.LEFT_ARROW:
                        _fnRightKeyRTLModeLeftKeyLTRMode(currentTarget);
                        break;
                }
            }
        };

        function _fnLeftKeyRTLModeRightKeyLTRMode(currentTarget){
            if(!_isLeafNode(currentTarget)){
                $(currentTarget).click();
            }
        };

        function _fnRightKeyRTLModeLeftKeyLTRMode(currentTarget){
            if(_isLeafNode(currentTarget) || _isNotOriginMenu(currentTarget)){
                $(currentTarget).parent().find('li:first').click();
            }
        };

        function _isNotOriginMenu(currentTarget){
            var liObj = $(currentTarget)[0];
            var result = false;
            if(!$(liObj).hasClass('origin-menu'))    {
                result = true;
            }
            return result;
        };

        function _isLeafNode(target)  {
          var leafNode = $(target).closest('li').find('a');
          var len = leafNode.length;
          var isLeafNode = false;
          if(len > 0){
              isLeafNode=true;
          }
          return isLeafNode;
        };

        function _fnMenuInitialize(len){
            var menu = _that.getMenuList();
            $('#menuList> li').remove();
            for (var x in menu) {
                if (typeof menu[x] == "function") {
                    continue;
                }

                if (x != "none") {
                    if (len == 1) {
                        _that.findElement('#menuList').append("<li id='" + _that.marker + x + "'  class='scrollableListFolder menu-common origin-menu' tabIndex='0' role='treeitem' aria-expanded='false' aria-level='1'><span class='menu-common'>" + x + "</span></li>");
                    } else {
                        var temp = "list_" + x;
                        _that.findElement(_that.escapeLocator('#' + temp)).remove();
                        _that.findElement('.selectedListItem').removeClass("selectedListItem");
                        var menuItem = "";
                        menuItem = "<li id='"+_that.marker + x +"' class='scrollableListFolder menu-common origin-menu' tabindex='0' role='treeitem' aria-expanded='false' aria-level='1'>"
                            +"<div class='menu-item menu-common'>"
                            +"<div class='menu-text menu-common'><span class='menu-common'>" + x + "</span></div>"
                            +"<div class='menu-icon menu-common'></div>"
                            +"</div></li>";
                        _that.findElement('#menuList').append(menuItem);
                    }
                }
            }
            $('#menuList').find('li:first').focus();
            _fnSetupMenuItemEvent();
        };

       function _fnGetMenuItemsFor(loc){
            var list = _that.getMenuList();
            for (var x = 0; x < loc.length; x++) {
                if (list[loc[x]]) {
                    if (list[loc[x]] instanceof Array) {
                        list = list[loc[x]];
                    }
                }
            }
            return list;
        };

        function _fnLoadMenu(item)  {
            var next = $('#menuList');
            var menuItem = "";
            $('#menuList> li').remove();

            var menuFullPath = item.replace(this.marker,"");
            var loc = menuFullPath.split(SPLIT_CHAR);
            var list = _fnGetMenuItemsFor(loc);

            $('#menuList').append(_fnAddBackButtonUI());
            $('#backButton').on('click',_fnBackButtonClickHandler);

            for (var x in list) {
                if (typeof list[x] == "function") {
                    continue;
                }

                if ((list[x].path == "null.zul" || list[x].path == "null") && x != Navigation.nonLeafNavEntryValObjKey) {
                    var name = list[x].name;
                    _that.loadFromService(item, name);
                }

                var id = item + SPLIT_CHAR + x;
                var columnIndex = next.parents('.columns:first').index() + 1;
                if ((list[x] instanceof Array || list[x]['type'] == 'MENU') && x != Navigation.nonLeafNavEntryValObjKey) {
                    var liCaption = _that.getCaption(list[x][Navigation.nonLeafNavEntryValObjKey])['caption'];
                    var liTitle = _that.getCaption(list[x][Navigation.nonLeafNavEntryValObjKey])['title'];
                    menuItem = "<li id='"+ id +"' class='scrollableListFolder menu-common' tabindex='0' role='treeitem' aria-expanded='false' aria-level='"+columnIndex+"'>"
                        +"<div class='menu-item menu-common'>"
                        +"<div class='menu-text menu-common'> <span class='menu-common' title=\"" + liTitle + "\">" +liCaption+"</span></div>"
                        +"<div class='menu-icon menu-common'></div>"
                        +"</div>";
                    next.append(menuItem);
                } else if (list[x] instanceof NavigationEntryValueObject) {
                    if (x != Navigation.nonLeafNavEntryValObjKey) {
                        var navItem = list[x];
                        var liCaption = _that.getCaption(list[x])['caption'];
                        var liTitle = _that.getCaption(list[x])['title'];
                        menuItem = "<li id='"+ id +"' class='scrollableListFolder menu-common' tabindex='0' role='treeitem' aria-expanded='false' aria-level='1'>"
                            +"<div class='menu-item menu-common'>"
                            +"<div class='menu-text menu-common'> <span title=\"" + liTitle + "\">"
                            +"<a class='menu-common' href=\"" + navItem.url + "\">"+liCaption+"</a>"
                            +"</span></div>"
                            +"</div>";
                        next.append(menuItem);
                    }
                } else {
                    ErrorManager.show("Unknown entry encountered.");
                }
            }

            $('#menuList').find('li:nth-child(2)').focus();
            $("#menuList").scrollTop(0);
            _fnSetupMenuItemEvent();
            EventDispatcher.dispatchEvent(_that.events.click, item);
            // NavigationRC might have more menu items to be fetched automatically
            NavigationRC.loadNext(_that);

        };

        function _fnAddBackButtonUI(){
            var subMenuName = _fnGetSelectedMenuName();
            var parentMenu = _fnGetParentMenuPath();
            var backButton = "<li id='"+parentMenu+"' class='scrollableListFolder menu-common' tabindex='0'><div class='menu-item'>"
                +"<div class='menu-back-icon menu-common'></div><div class='menu-subheader-text menu-common'>"
                +"<span class='menu-common' title="+subMenuName+"><a href='#' id='backButton'>"+subMenuName+"</a></span></div>"
                +"</div>"
            return backButton;
        };


       function _fnBackButtonClickHandler(){
            var currParentMenu = _fnGetParentMenuPath();
            currentSelectedMenuFullPath = currParentMenu;
            if(currParentMenu != "list")  {
                _fnLoadMenu(currParentMenu);
            } else {
                _fnMenuInitialize();
            }
            return false;
        };

        function _fnHideBannerMenu(){
            $('#menuContainer').removeClass('show').addClass('hide');
            $('#menu').removeClass('show').addClass('hide');
            $('#bannerMenu').addClass('hide').removeClass('show');
        }

        /**
         * ScrollableList UI component initialization method.
         */
        this.initialize = function() {
            _that = this;
            _fnCreateMenuUI();
            this.initialized = true;
        };

        this.findElement = function (expr) {
            if (expr != undefined && $.trim(expr) != "") {
                return $(this.root + ' ' + expr);
            } else {
                return $(this.root);
            }
        };


        this.reinitialize = function(len) {
            if (this.initialized == true) {
                this.initialized = false;
                if (currentSelectedMenuFullPath) {
                    this.load(currentSelectedMenuFullPath);
                    this.initialized = true;
                    return;
                }
                _fnMenuInitialize(len);
                this.initialized = true;
            }
        };

        this.getCaption = function (navEntry) {
            var captionInfo = [];
            captionInfo['caption'] = navEntry.pageCaption;
            captionInfo['title'] = navEntry.pageCaption;
            if (navEntry.captionProperty == "true") {
                captionInfo['caption'] = captionInfo['caption'] + "<br/>" + "(" + navEntry.form + ")";
                captionInfo['title'] = captionInfo['title'] + " (" + navEntry.form + ")";
            }
            return captionInfo;
        };

        this.escapeLocator = function (itemId) {
            return itemId.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
        };

       /**
         * Loads list content and populates the next list for a selected list item.
         * @param {Element} item The JQuery element for the selected list item.
       */

        this.load = function(item) {
            currentSelectedMenuFullPath = item;
            _fnLoadMenu(item);
        };


        /**
         * loads data using the service
         * @param item jQuery object of the clicked HTML element
         * @param name the name in the NavigationEntryValueObject
         */
        this.loadFromService = function(item, name) {
            Navigation.setScrollableMenu(this);
            Navigation.nextNavItem(name, item);
        },


        this.closeMenu = function(target) {
            var currentElement = target;
            if (!$(target).hasClass('menu-common')) {
                if ($('#menu').hasClass('show')) {
                    _fnHideBannerMenu();
                    _fnSetFocusToLastElement();
                 }
            }
        }
};
