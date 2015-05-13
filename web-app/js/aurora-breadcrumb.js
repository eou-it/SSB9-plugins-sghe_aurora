/*********************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/


$(document).ready(function(){

    if($('meta[name=headerAttributes]').attr("content")){
        var headerAttributes = JSON.parse($('meta[name=headerAttributes]').attr("content"));
        var breadcrumbItems = headerAttributes.breadcrumb;
        var pageTitle = headerAttributes.pageTitle;
        $('#title-panel').text(pageTitle);
        if(!_.isEmpty(breadcrumbItems)){
            BreadCrumb.setFullBreadcrumb(breadcrumbItems, pageTitle);
        }
    }

    ContentManager.setContentPosition();

    $(window).on('resize',function(){
        ContentManager.setContentPosition();
    });
})

function BreadCrumbValueObject(id, label, url) {
    this.id = id;
    this.label = label;
    this.url = url;
}

var BreadCrumb = {

    items: [],

    UI: $("<div id='breadcrumb-panel' class='vertical-align'>"
        + "<div id='breadcrumbHeader'>"
        + "</div>"
        + "</div>"),

    create: function () {
        $('#header-main-section').after(BreadCrumb.UI);
    },

    setFullBreadcrumb : function(breadCrumbItems, pageTitle) {
        BreadCrumb.updateBreadcrumbItems(breadCrumbItems);
        BreadCrumb.addBackButton();
        BreadCrumb.showPageTitleAsBreadcrumb(pageTitle);
        BreadCrumb.registerBreadcrumbClickListener();
    },

    updateBreadcrumbItems: function(breadcrumbItems){
        var index = 0;
        $.each(breadcrumbItems, function(label, url) {
            index = index + 1;
            var breadCrumbItem = new BreadCrumbValueObject(index,label, url.trim());
            BreadCrumb.items.push(breadCrumbItem);
            BreadCrumb.drawItem(breadCrumbItem);
        });
    },

    drawItem: function (item) {
        var breadcrumbHeader = BreadCrumb.UI.find('#breadcrumbHeader');
        var breadcrumbItem = "<span class='breadcrumbButton' data-id='"+item.id+"'>"+item.label+"</span>";
        if(item.url.length){
            breadcrumbItem = "<a class='breadcrumbButton' data-id='"+item.id+"' data-path='"+item.url+"' href='#'>"+item.label+"</a>";
        }
        breadcrumbHeader.append(breadcrumbItem);
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
        }
        else{
            $('#breadcrumbHeader').addClass('breadcrumb-show-leaf');
        }
    },

    registerBreadcrumbClickListener: function(){
        $('a.breadcrumbButton').on('click',function(){
            var uri = $(this).attr('data-path');
            window.location = Application.getApplicationPath() + uri;
        })
    },

    registerBackButtonClickListener: function(){
        $('#breadcrumbBackButton').on('click',function(){
            var breadcrumbItem =  $('.breadcrumbButton:last').attr('data-id');
            var location = BreadCrumb.getPreviousBreadCrumbNavigationLocation(breadcrumbItem);
            window.location = location;
        })
    },

    getPreviousBreadCrumbNavigationLocation: function(breadcrumbId){
        var previousNavigableURL = "";
        var itemsWithURL = BreadCrumb.items.filter(function(breadcrumb) {
            return (breadcrumb.url.length > 0 && (breadcrumb.id < parseInt(breadcrumbId))) ;
        });

        var previousBreadcrumbWithURI = _.last(itemsWithURL, [1]);
        if(previousBreadcrumbWithURI.length){
            previousNavigableURL = Application.getApplicationPath() + previousBreadcrumbWithURI[0].url;
        }
        return previousNavigableURL;
    }
};
