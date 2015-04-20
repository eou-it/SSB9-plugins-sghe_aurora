/*******************************************************************************
 Copyright 2015 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

modules = {
    'aurora' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-header.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-breadcrumb.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-menu.css'], attrs:[media:'screen, projection']

        resource url:[plugin: 'sghe-aurora', file: 'js/utils.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/config.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-controls.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-integration.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-navigation.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-platform.js']
    }

    'auroraRTL' {
        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/aurora-breadcrumb-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/rtl.css'],       attrs:[media:'screen, projection']
    }
}