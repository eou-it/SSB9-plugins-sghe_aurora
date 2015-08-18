/*********************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/


$(document).ready(function(){
    ContentManager.setContentPosition();
    $(window).on('resize',function(){
        ContentManager.setContentPosition();
    });
})


var BreadCrumbAndPageTitle = (function () {

    var items = [];

    var UI = $("<div id='breadcrumb-panel'></div>" +
        "<div id='title-panel'></div>");

    function setFullBreadcrumb(breadCrumbItems, pageTitle) {
        $('#breadcrumb-panel').empty();
        $('#breadcrumb-panel').append("<div id='breadcrumbHeader'></div>");
        updateBreadcrumbItems(breadCrumbItems);
        showPageTitleAsBreadcrumb(pageTitle);
    };

    function BreadCrumbValueObject (id, label, url) {
        this.id = id;
        this.label = label;
        this.url = url;
    };

    function updateBreadcrumbItems(breadcrumbItems){
        var index = 0;
        $.each(breadcrumbItems, function(label, url) {
            index = index + 1;
            var breadCrumbItem = new BreadCrumbValueObject(index,label, url.trim());
            items.push(breadCrumbItem);
            drawItem(breadCrumbItem);
        });

        addBackButton();
        registerBreadcrumbClickListener();
    };

    function drawItem(item) {
        var breadcrumbHeader = UI.find('#breadcrumbHeader');
        var breadcrumbItem = "<span class='breadcrumbButton' data-id='"+item.id+"'>"+item.label+"</span>";
        if(item.url.length){
            breadcrumbItem = "<a class='breadcrumbButton' data-id='"+item.id+"' data-path='"+item.url+"' href='#'>"+item.label+"</a>";
        }
        breadcrumbHeader.append(breadcrumbItem);
    };

    function addBackButton() {
        var leafItemId = _.last(items, [1])[0].id;
        var previousNavigableURL = getPreviousBreadCrumbNavigationLocation(leafItemId);

        if(previousNavigableURL.length){
            var backButton = "<a id='breadcrumbBackButton' href='#'></a>";
             $('#breadcrumb-panel').prepend(backButton);
            registerBackButtonClickListener();
        }
    };

    function showPageTitleAsBreadcrumb(pageTitle) {
        if(!_.isUndefined(pageTitle) && pageTitle.trim().length){
            $('<div id="breadcrumbPageTitle">'+pageTitle+'</div>').insertBefore('#breadcrumbHeader');
        }
        else{
            $('#breadcrumbHeader').addClass('breadcrumb-show-leaf');
        }
    };

    function registerBreadcrumbClickListener(){
        $('a.breadcrumbButton').on('click',function(){
            var uri = $(this).attr('data-path');
            window.location = Application.getApplicationPath() + uri;
        })
    };

    function registerBackButtonClickListener(){
        $('#breadcrumbBackButton').on('click',function(){
            var breadcrumbItem =  $('.breadcrumbButton:last').attr('data-id');
            var location = getPreviousBreadCrumbNavigationLocation(breadcrumbItem);
            window.location = location;
        })
    };

    function getPreviousBreadCrumbNavigationLocation(breadcrumbId){
        var previousNavigableURL = "";
        var itemsWithURL = items.filter(function(breadcrumb) {
            return (breadcrumb.url.length > 0 && (breadcrumb.id < parseInt(breadcrumbId))) ;
        });

        var previousBreadcrumbWithURI = _.last(itemsWithURL, [1]);
        if(previousBreadcrumbWithURI.length){
            previousNavigableURL = Application.getApplicationPath() + previousBreadcrumbWithURI[0].url;
        }
        return previousNavigableURL;
    }

    return{
        create : function () {
            $('#header-main-section').after(UI);
        },

        draw: function(headerAttributes){
            var breadcrumbItems = headerAttributes.breadcrumb;
            var pageTitle = headerAttributes.pageTitle;
            $('#title-panel').empty();
            if(!_.isEmpty(pageTitle)){
                $('#title-panel').append("<div>"+pageTitle+"</div>");
            }
            if(!_.isEmpty(breadcrumbItems)){
                setFullBreadcrumb(breadcrumbItems, pageTitle);
            }
        }
    }
})();
