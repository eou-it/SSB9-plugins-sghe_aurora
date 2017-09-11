/*******************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

modules = {
    'auroraCommon' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'js/utils.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/config.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/aurora-nonHierarchicalMenu.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-controls.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/aurora-breadcrumb-title.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/aurora-menu.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-integration.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/unifiedmenu/m.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-navigation.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-platform.js']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-theme.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'js/appnav-keyboard-shortcuts.js']
    }

    'aurora' {
        dependsOn "auroraCommon"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-header.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-breadcrumb.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-menu.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-tools.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-profile.css'], attrs:[media:'screen, projection']
    }

    'auroraRTL' {
        dependsOn "auroraCommon"
        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/rtl.css'],       attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-header-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-header-rtl-patch.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-menu-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-tools-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-profile-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-breadcrumb-rtl.css'], attrs:[media:'screen, projection']
     }
}
