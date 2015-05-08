/*********************************************************************************
 Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
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

       function createUI(){
            var menu = "<div id='menu' role='application' class='menu-wrapper hide'>"+
                        "<ul id='menuList'></ul></div>";
            $(root).append(menu);
        }


        /**
         * ScrollableList UI component initialization method.
         */
        this.initialize = function() {
            _that = this;
            this.findElement('#menuList > .scrollableListFolder').live('click', function() {
                var menuName = ($(this)).attr('id');
                _that.load(menuName);
            });
            createUI();
            this.initialized = true;
        },

        this.findElement = function (expr) {
            if (expr != undefined && $.trim(expr) != "") {
                return $(this.root + ' ' + expr);
            } else {
                return $(this.root);
            }
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

                if (_fnGetCurrentSelectedMenu()) {
                    this.load(_fnGetCurrentSelectedMenu());
                    this.initialized = true;
                    return;
                }

                _fnMenuInitialize(len);
                this.initialized = true;
            }
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
                        _that.findElement('#menuList').append("<li id='" + _that.marker + x + "'  class='scrollableListFolder' tabIndex='0' role='treeitem' aria-expanded='false' aria-level='1'><span>" + x + "</span></li>");
                    } else {
                        var temp = "list_" + x;
                        _that.findElement(_that.escapeLocator('#' + temp)).remove();
                        _that.findElement('.selectedListItem').removeClass("selectedListItem");
                        var menuItem = "";
                        menuItem = "<li id='"+_that.marker + x +"' class='scrollableListFolder' tabindex='0' role='treeitem' aria-expanded='false' aria-level='1'>"
                            +"<div class='menu-item' style='align:center'>"
                            +"<div class='menu-text'><span>" + x + "</span></div>"
                            +"<div class='menu-icon'></div>"
                            +"</div></li>";
                        _that.findElement('#menuList').append(menuItem);
                    }
                }
            }
        };

        this.escapeLocator = function (itemId) {
            return itemId.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
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

        function _fnLoadMenu(item, list)  {
            var next = $('#menuList');
            var thisObj = this;
            var menuItem = "";
            $('#menuList> li').remove();
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
                    menuItem = "<li id='"+ id +"' class='scrollableListFolder' tabindex='-1' role='treeitem' aria-expanded='false' aria-level='"+columnIndex+"'>"
                        +"<div class='menu-item'>"
                        +"<div class='menu-text'> <span title=\"" + liTitle + "\">" +liCaption+"</span></div>"
                        +"<div class='menu-icon'></div>"
                        +"</div>";
                    next.append(menuItem);
                } else if (list[x] instanceof NavigationEntryValueObject) {
                    if (x != Navigation.nonLeafNavEntryValObjKey) {
                        var navItem = list[x];
                        var liCaption = _that.getCaption(list[x])['caption'];
                        var liTitle = _that.getCaption(list[x])['title'];
                        menuItem = "<li id='"+ id +"' class='scrollableListFolder' tabindex='0' role='treeitem' aria-expanded='false' aria-level='1'>"
                            +"<div class='menu-item'>"
                            +"<div class='menu-text'> <span title=\"" + liTitle + "\">"
                            +"<a href=\"" + navItem.url + "\">"+liCaption+"</a>"
                            +"</span></div>"
                            +"</div>";
                        next.append(menuItem);
                    }
                } else {
                    ErrorManager.show("Unknown entry encountered.");
                }
            }

            EventDispatcher
                .dispatchEvent(_that.events.click, item);

            // NavigationRC might have more menu items to be fetched automatically
            NavigationRC.loadNext(_that);
        };

        function addBackButton(){
            var subMenuName = _fnGetSelectedMenuName();
            var backButton = "<li><div class='menu-item'>"
                +"<div class='menu-back-icon'></div><div class='menu-text'><a href='#' id='backButton'> "+subMenuName+" </a></div>"
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
                next.append(addBackButton());
                $('#backButton').on('click',_fnBackButtonClickHandler);
            }
        };

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
            Navigation.setScrollableMenu(this);
            Navigation.nextNavItem(name, item);
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
        },

        this.closeMenu = function(target) {
            var currentElement = target;
            var menuDiv = $(currentElement).parents('#menu');
            if (!menuDiv.length && $(currentElement).attr('id') !== "backButton") {
                if ($('#menu').hasClass('show')) {
                    $('#menu').addClass('hide');
                    $('#menu').removeClass('show');
                    $('#menuContainer').addClass('hide');
                    $('#menuContainer').removeClass('show');
                }
            }
        }
}
;