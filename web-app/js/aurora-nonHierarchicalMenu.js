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
    addItem: function (id, label, sectionId, callback) {
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
        item.text(label);
        item.addClass('pointer');
        item.attr('tabindex',0);
        item.on('click',_fnMouseEventsHandlerForMenu);
        item.on('keydown',_fnKeyBoardEventsHandlerForMenu);

        if (sectionId)
            this.canvas.find('#' + sectionId).after(item);
        else
            this.canvas.append(item);
        return item;

        function _fnMouseEventsHandlerForMenu(e){
            _fnAction(e);
        }

        function isTabNavigation(elem) {
            var navigationStyle=$(elem).css('--navigation');
            if (navigationStyle.indexOf("tab") > -1) {
                return true;
            } else {
                return false;
            }
        }

        function _fnKeyBoardEventsHandlerForMenu(e){
            var currentTarget = e.target;
            var code = (e.keyCode ? e.keyCode : e.which);
            switch(code)    {
                case KEY_CODE.DOWN_ARROW:
                    if(!isTabNavigation(currentTarget) && $(currentTarget).next('.canvas-item').length){
                        $(currentTarget).next('.canvas-item').focus();
                    }
                    break;
                case KEY_CODE.UP_ARROW:
                    if(!isTabNavigation(currentTarget) && $(currentTarget).prev('.canvas-item').length){
                        $(currentTarget).prev('.canvas-item').focus();
                    }
                    break;
                case KEY_CODE.ENTER:
                    _fnAction(e);
                    break;
                case KEY_CODE.SPACE:
                    _fnAction(e)
                    break;
                case KEY_CODE.ESC:
                    closeMenu();
                    break;
                case KEY_CODE.TAB:
                    if(isTabNavigation(currentTarget) && $(currentTarget).next('.canvas-item').length){
                        $(currentTarget).next('.canvas-item').focus();
                    }
                    break;
            }
        }

        function _fnAction(e) {
            if (callback)
                callback(e);
            handlerPostItemClick.call();
        }
    },

    /**
     * removes an menu item from the tools menu
     * @param id
     */
    removeItem: function (id) {

    }
}