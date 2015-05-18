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

        function _fnSetCurrentSelectedMenu(currentSelMenu)  {
            currentSelectedMenuFullPath = currentSelMenu;
        }

        function _fnGetCurrentSelectedMenu(){
            return currentSelectedMenuFullPath;
        }

        function _fnGetSelectedMenuName(){
            var menuName = _fnGetCurrentSelectedMenu();
            menuName = menuName.substr(menuName.lastIndexOf(SPLIT_CHAR));
            menuName = menuName.replace(SPLIT_CHAR,"");
            return menuName;
        }

        function _fnGetParentMenuPath(){
           var currMenuFullPath = _fnGetCurrentSelectedMenu();
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
            var target = $(e.target).closest('li');
            _fnOpenUpSubMenu(target);
        };

        function _fnOpenUpSubMenu(target) {
            /** Need to be revisited **/
            var menuName = ($(target)).attr('id');
            if(menuName !== 'list'){
                _that.load(menuName);
            }
            else {
                _fnMenuInitialize();
            }
        }

        function _fnKeyBoardEventsHandlerForMenu(e){
            var currentTarget = e.target;
            var code = (e.keyCode ? e.keyCode : e.which);
            if((code !==KEY_CODE.LEFT_ARROW) && (code!==KEY_CODE.RIGHT_ARROW))  {
                console.log('inside it');
                switch(code)    {
                    case KEY_CODE.ESC:
                        _fnHideBannerMenu();
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
        };

        function _fnLeftAndRightNavigation(keyCode, currentTarget){
            console.log('leftandright navigation');
            if(isRTLMode()){
                console.log('rlt mode',keyCode);
                switch(keyCode){
                    case KEY_CODE.LEFT_ARROW:
                        if(!_isLeafNode(currentTarget)){
                            $(currentTarget).click();
                        }
                        break;
                    case KEY_CODE.RIGHT_ARROW:
                        if(_isLeafNode(currentTarget)){
                            $(currentTarget).parent().find('li:first').click();
                        } else if(isNotOriginMenu(currentTarget)) {
                            $(currentTarget).click();
                        }
                        break;
                }

            } else {
                console.log('ltr mode',keyCode);
                switch(keyCode){
                    case KEY_CODE.RIGHT_ARROW:
                        if(!_isLeafNode(currentTarget)){
                            $(currentTarget).click();
                        }
                        break;
                    case KEY_CODE.LEFT_ARROW:
                        if(_isLeafNode(currentTarget)){
                            $(currentTarget).parent().find('li:first').click();
                        } else if(isNotOriginMenu(currentTarget)) {
                            $(currentTarget).click();
                        }
                        break;
                }
            }
        };

        function isNotOriginMenu(currentTarget){
            var id = $(currentTarget).attr('id');
            var result = false;
            var array = id.split("_");
            if(array.length > 2){
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
                        _that.findElement('#menuList').append("<li id='" + _that.marker + x + "'  class='scrollableListFolder menu-common' tabIndex='0' role='treeitem' aria-expanded='false' aria-level='1'><span class='menu-common'>" + x + "</span></li>");
                    } else {
                        var temp = "list_" + x;
                        _that.findElement(_that.escapeLocator('#' + temp)).remove();
                        _that.findElement('.selectedListItem').removeClass("selectedListItem");
                        var menuItem = "";
                        menuItem = "<li id='"+_that.marker + x +"' class='scrollableListFolder menu-common' tabindex='0' role='treeitem' aria-expanded='false' aria-level='1'>"
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

        function _fnLoadMenu(item, list)  {
            var next = $('#menuList');
            var thisObj = this;
            var menuItem = "";
            $('#menuList> li').remove();

            console.log("$.i18n.prop('default.language.direction')",$.i18n.prop('default.language.direction'));

            _fnAddBackButtonIfItIsSubMenu();

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
                    menuItem = "<li id='"+ id +"' class='scrollableListFolder menu-common' tabindex='-1' role='treeitem' aria-expanded='false' aria-level='"+columnIndex+"'>"
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
                +"<span class='menu-common' title="+subMenuName+"><a class='menu-common' href='#' id='backButton'> "+subMenuName+" </a></span></div>"
                +"</div>"
            return backButton;
        };

        function _isCurrentMenuASubMenu(){
            var result = true;
            var currentMenuFullPath = _fnGetCurrentSelectedMenu();
            if(currentMenuFullPath == "list"){
                return false;
            }
            return result;
        };

        function _fnAddBackButtonIfItIsSubMenu(){
            if(_isCurrentMenuASubMenu()) {
                var next = $('#menuList');
                next.append(_fnAddBackButtonUI());
                $('#backButton').on('click',_fnBackButtonClickHandler);
            }
        };

        /*** Need to be revisited ***/
        function _fnBackButtonClickHandler(){
            var currParentMenu = _fnGetParentMenuPath();
            var loc = currParentMenu.split(SPLIT_CHAR);
            var list;
            _fnSetCurrentSelectedMenu(currParentMenu);
            if(currParentMenu != "list")  {
                list = _fnGetMenuItemsFor(loc);
                _fnLoadMenu(currParentMenu,list);
            } else {
                _fnMenuInitialize();
            }
            return false;
        };

        function _fnHideBannerMenu(){
            $('#menuContainer').removeClass('show').addClass('hide');
            $('#menu').removeClass('show').addClass('hide');
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
                if (_fnGetCurrentSelectedMenu()) {
                    this.load(_fnGetCurrentSelectedMenu());
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
            _fnSetCurrentSelectedMenu(item);
            var menuFullPath = item.replace(this.marker,"");
            var loc = menuFullPath.split(SPLIT_CHAR);
            var thisObj = this;
            var list = _fnGetMenuItemsFor(loc);
            _fnLoadMenu(item, list);
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
                 }
            }
        },

        this.initialize();
};