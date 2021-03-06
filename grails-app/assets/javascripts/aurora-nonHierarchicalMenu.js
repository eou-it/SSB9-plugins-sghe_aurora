/*********************************************************************************
 Copyright 2015-2021 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
var NonHierarchicalMenu = (function() {
    return {
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
        sectionHtml: $("<div class='canvas-section' role='menuitem' aria-haspopup='true'></div>"),
        sectionSpanHtml: $("<span></span>"),
        sectionContentHtml: $("<div class='canvas-section-content'  role='menu'></div>"),
        /**
         * HTML for rendering menu items
         */
        itemHtml: $("<div class='canvas-item' role='menuitem'/></div>"),
        itemSpanHtml: $("<span></span>"),
        callbackPostItemClick: null,
        /**
         * show/hide tools button
         */
        visible: function(flag) {
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
        addSection: function(id, label) {
            if (id && label) {
                var titleId=id+"_title";
                var section = this.sectionHtml.clone();
                var sectionSpan = this.sectionSpanHtml.clone();
                var sectionContent = this.sectionContentHtml.clone();
                section.attr("id", titleId);
                sectionContent.attr("id",id);
                sectionContent.attr("aria-label",label);
                sectionContent.attr("xe-section",id);
                section.attr("xe-for", id);
                sectionSpan.text(label);
                section.append(sectionSpan);
                this.canvas.append(section);
                this.canvas.append(sectionContent);
                //Extend Tools menu sections
                if (typeof xe !== 'undefined' && xe.extensionsFound) {
                    var menuSection = _.find(xe.extensions.sections, function (section) {
                        return section.name == id;
                    });
                    if (menuSection) {
                        if(menuSection.exclude) {
                            section.addClass('xe-exclude');
                            sectionContent.addClass('xe-exclude');
                        }
                    }
                }
                return section;
            }
        },
        /**
         * removes the specified section
         * @param id
         */
        removeSection: function(id) {
            this.canvas.parent().find('#' + id).remove();
        },
        /**
         * removes the specified Item
         * @param id
         */
        removeItem: function(id) {
            this.canvas.parent().find('#' + id).remove();
        },
        /** readOnly/make Item Editable in a menu
         * * @param id
         */
        readOnlyItem: function(itemId) {
            var obj = this.canvas;
            toggleReadOnlyStatus(obj, itemId, true);
        },
        makeItemEditable: function(itemId) {
            var obj = this.canvas;
            toggleReadOnlyStatus(obj, itemId, false);
        },
        /** hide/visible a menu item
         * * @param id
         */
        hideItem: function(itemId) {
            var obj = this.canvas;
            toggleVisibleStatus(obj, itemId, false);
        },
        makeItemVisible: function(itemId) {
            toggleVisibleStatus(obj, itemId, true);
        },
        /**
         * adds a menu item to the specified section and also attaches a callback, if provided
         * @param id
         * @param label
         * @param sectionId
         * @param callback
         */
        addItem: function(id, label, sectionId, callback, readonly) {
            var KEY_CODE = {
                ENTER: 13,
                ESC: 27,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                SPACE: 32,
                TAB: 9
            };
            var item = this.itemHtml.clone();
            var itemSpan = this.itemSpanHtml.clone();
            var handlerPostItemClick = this.callbackPostItemClick;
            if (id && label) {
                item.attr('id', id);
                item.attr('xe-field',id);
                itemSpan.text(label);
                item.attr('tabindex', 0);
                item.addClass('pointer');
                item.on('click', _fnMouseEventsHandlerForMenu);
                item.on('keydown', _fnKeyBoardEventsHandlerForMenu);
                item.append(itemSpan);
                if (readonly == true) {
                    item.attr('tabindex', -1);
                    item.attr("readonly", readonly);
                }
                if (sectionId) {
                    var sectionContent = this.canvas.find('#' + sectionId);
                    if (sectionContent.find('.canvas-item').length == 0) {
                        sectionContent.attr("aria-activedescendant", id);
                    }
                    sectionContent.append(item);
                } else
                    this.canvas.append(item);
                //Extend Tools menu item
                if (typeof xe !== 'undefined' && xe.extensionsFound) {
                    var menuSectionExtns = _.find(xe.extensions.sections, function (section) {
                        if(section.name === sectionId || section.name === 'extzToolList') {
                            return section.name;
                        }
                    });
                    if (menuSectionExtns && 'fields' in menuSectionExtns) {
                        menuSectionExtns.fields.forEach(function (field, key) {
                            if (field.name === id) {
                                if (field.exclude) {
                                    item.addClass('xe-exclude')
                                }
                            }
                        });
                    }
                }
                return item;
            }

            function _fnMouseEventsHandlerForMenu(e) {
                _fnAction(e);
            }

            function isTabNavigation(elem) {
                var isMenuStyle = $(elem).closest('.non-hierarchical-menu').find('.menu-icon:visible');
                if (isMenuStyle.length > 0) {
                    return false
                } else {
                    return true;
                }
            }

            function _fnKeyBoardEventsHandlerForMenu(e) {
                var currentTarget = e.target;
                var container = currentTarget.offsetParent;
                var code = (e.keyCode ? e.keyCode : e.which);
                switch (code) {
                    case KEY_CODE.DOWN_ARROW:
                        var nextElem = getNextTabbableElement($(currentTarget), $(container));
                        if (!isTabNavigation(currentTarget) && nextElem.length ) {
                            nextElem.focus();
                            e.preventDefault();
                        }
                        break;
                    case KEY_CODE.UP_ARROW:
                        var prevElem = getPreviousTabbableElement($(currentTarget), $(container));
                        if (!isTabNavigation(currentTarget) && prevElem.length) {
                            prevElem.focus();
                            e.preventDefault();
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
                        if (!isTabNavigation(currentTarget)) {
                            e.preventDefault();
                        }
                        break;
                }
                if (code === KEY_CODE.TAB) {
                    return true;
                } else {
                    return false;
                }
            }

            function _fnAction(e) {
                var readonlyAttr = item.attr("readonly");
                if (readonlyAttr == undefined || readonlyAttr == false) {
                    if (callback)
                        callback(e);
                    handlerPostItemClick.call();
                }
            }
        },
        fnSetLastFocus: function() {
            window.lastFocus = $(document.activeElement);
        },
        fnSetFocusOnCloseMenuItems: function() {
            if (window.lastFocus != null) {
                $(window.lastFocus).focus();
            }
        }
    };

    function toggleReadOnlyStatus(obj, id, status) {
        if (status == true) {
            obj.find('#' + id).attr('tabindex', -1);
            obj.find('#' + id).attr("readonly", true).css({
                "color": "#d6d6d6",
                "cursor": "unset"
            });
        }
        if (status == false) {
            obj.find('#' + id).attr('tabindex', 0);
            obj.find('#' + id).attr("readonly", false).css({
                "color": "#41566f",
                "cursor": "pointer"
            });
        }
    };

    function toggleVisibleStatus(obj, id, status) {
        if (status == false) {
            obj.parent().find('#' + id).css({
                "display": "none"
            });
        }
        if (status == true) {
            obj.parent().find('#' + id).css({
                "display": "block"
            });
        }
    };
})();
var ProfileMenu = Object.create(NonHierarchicalMenu);
ProfileMenu.initialize = function() {
    ControlBar.node.find('#userDiv').append("<div id='userCanvas'>" + "<div id='userMenu' role='menu'><div id='userList' class='user-list'></div>" + "</div>" + "</div>");
    this.dropDown = ControlBar.node.find("#userCanvas");
    this.canvas = ControlBar.node.find('#userList');
    this.callbackPostItemClick = toggleProfileMenu;
    ControlBar.node.find('#user').bind("click", toggleProfileMenu);
};
ProfileMenu.closeMenu = function() {
    if (!$('#userCanvas').is(':hidden')) {
        $('#userCanvas').removeClass('user-active');
        $('#user').removeClass('user-expanded');
        if (window.lastFocus != null) {
            $(window.lastFocus).focus();
        }
    }
};
var ToolsMenu = Object.create(NonHierarchicalMenu);
ToolsMenu.initialize = function() {
    ControlBar.node.find('#toolsButton').attr("title", ResourceManager.getString("areas_label_tools_shortcut"));
    ControlBar.node.find('#toolsButton').attr("xe-section",'extzToolIcon');
    ControlBar.node.find('#toolsButton').find('div div a').text(ResourceManager.getString("areas_label_tools"));
    ControlBar.node.find('#toolsButton').append("<div id='toolsCanvas'>" + "<div id='toolsMenu' role='menu'><div id='toolsList' class='tools-list' xe-section='extzToolList'></div>" + "</div>" + "</div>");
    this.dropDown = ControlBar.node.find("#toolsCanvas");
    this.canvas = ControlBar.node.find('#toolsList');
    this.callbackPostItemClick = toggleToolsMenu;
    ControlBar.node.find('#tools').bind("click", toggleToolsMenu);

    try {
        if (angular.module("xe-ui-components")) {
            var userPreferenceDiv = document.getElementById('userPreferenceDiv');
            if (null != userPreferenceDiv && undefined != userPreferenceDiv && window.Application.isUserAuthenticated()) {
                userPreferenceDiv.setAttribute("ng-controller","PopupCtrl");
                ToolsMenu.addItem(
                    "Preference",
                    $.i18n.prop("userpreference.popup.language.heading"),
                    "",
                    userPreferencePopup
                );
            }
        }
    } catch(e){
        console.log('Language Setting menu item is not added because xe-ui-components Module is not defined.');
    }


    try{
        if(angular.module("aboutModal")){

            ToolsMenu.addItem(
                "about",
                $.i18n.prop("aurora.areas_label_about_title"),
                "",
                aboutDialogPopUp
            );

        }
    } catch(e){
        console.log('Not adding About menu item because aboutModal Module is not found in resource.');
    }

    try {
        if (angular.module("keyboardshortcut") && angular.module("xe-ui-components")) {
            var shortcutDialogDiv = document.getElementById('shortcut_module_added');
            if (null != shortcutDialogDiv && undefined != shortcutDialogDiv) {
                //shortcutOverlay();
                ToolsMenu.addItem(
                    "keyboard",
                    $.i18n.prop("aurora.toolsmenu.keyboard.shortcuts.heading"),
                    "",
                    shortcutOverlayAddition
                );
            }
        }
    } catch (e) {
        console.log('Not adding Keyboard shortcut  menu item because keyboardshortcut Module is not found in resource.');
        if( document.getElementById('shortcut_module_added')){
            document.getElementById('shortcut_module_added').style.display = 'none';
        }
    }

    var linkedUrl = document.getElementsByName("privacyPolicyUrl")[0].content;
    if (linkedUrl) {
        ToolsMenu.addItem(
            "privacyPolicy",
            $.i18n.prop("aurora.privacypolicy_label"),
            "",
            function privacyPolicylinkUrl() {
                var Uri = document.getElementsByName("privacyPolicyUrl")[0].content
                window.open(Uri, '_blank');
            }
        );
    }

};

function aboutDialogPopUp () {

    var dialogDiv = document.getElementById('dialogAppDiv');
    dialogDiv.setAttribute("ng-app","dialogApp");
    dialogDiv.setAttribute("ng-controller","ModalCtrl");
    var scope = angular.element(document.getElementById('dialogAppDiv')).scope();
    if(!scope){
        dialogDiv.innerHTML = "<xe-about-modal show='modalShown' api='aboutApi' focusbackelement='tools'></xe-about-modal>";
        angular.element(document.getElementById('dialogAppDiv')).ready(function() {
            angular.bootstrap(document.getElementById('dialogAppDiv'), ['dialogApp']);
        });
        scope = angular.element(document.getElementById('dialogAppDiv')).scope();
    }
    scope.$apply(function(){
        scope.toggleModal();
    })
}


function shortcutOverlayAddition(){
    shortcutOverlay();
    var dialogDiv = document.getElementById('shortcut_module_added');
   /* dialogDiv.setAttribute("ng-app","keyboardshortcut");
    dialogDiv.setAttribute("ng-controller","shortcutModal");*/
    var scope = angular.element(document.getElementById('shortcut_module_added')).scope();
    if(!scope){
        angular.element(document.getElementById('shortcut_module_added')).ready(function() {
            angular.bootstrap(document.getElementById('shortcut_module_added'), ['keyboardshortcut']);
        });
        scope = angular.element(document.getElementById('shortcut_module_added')).scope();
    }
    scope.$apply(function(){
        scope.toggleshortcut();
    })
}

function shortcutOverlay(){
    var dialogDiv = document.getElementById('shortcut_module_added');
    dialogDiv.setAttribute("ng-app","keyboardshortcut");
    dialogDiv.setAttribute("ng-controller","shortcutModal");
}

function userPreferencePopup() {
    var scope = angular.element(document.getElementById('userPreferenceDiv')).scope();
    if(!scope){
        angular.element(document.getElementById('userPreferenceDiv')).ready(function() {
            angular.bootstrap(document.getElementById('userPreferenceDiv'), ['userPreference']);
        });
        scope = angular.element(document.getElementById('userPreferenceDiv')).scope();
    }
    scope.showDiv =  true;
    scope.$apply(function(){
        scope.togglepopup();
    })
}
ToolsMenu.closeMenu = function() {
    if (!$('#toolsCanvas').is(':hidden')) {
        $('#toolsCanvas').removeClass('tools-active');
        $('#toolsButton').removeClass('tools-expanded');
        if (window.lastFocus != null) {
            $(window.lastFocus).focus();
        }
    }
};
var SignInMenu = Object.create(NonHierarchicalMenu);
SignInMenu.initialize = function() {
    var signInDom = $("<div id='signInButton' class='non-hierarchical-menu'  ><a class='signIn-mobile menu-icon' aria-expanded='false' href='javascript:void(0);' />" + "<div id='signInCanvas'><div id='signInMenu'><div id='signList' class='signIn-list'>" + "</div></div></div>" + "</div>");
    ControlBar.append(signInDom);
    this.dropDown = ControlBar.node.find("#signInCanvas");
    this.canvas = ControlBar.node.find('#signList');
    this.callbackPostItemClick = toggleSignMenu;
    ControlBar.node.find('.signIn-mobile').click(function() {
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
        if (window.lastFocus != null) {
            $(window.lastFocus).focus();
        }
    }
};
