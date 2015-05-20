/*******************************************************************************
Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

modules = {
    'auroraCommon' {
        dependsOn "jquery"

        resource url:[plugin: 'sghe-aurora', file: 'js/utils.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/config.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-controls.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-integration.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-navigation.js']
        resource url:[plugin: 'sghe-aurora', file: 'js/common-platform.js']
    }

    'aurora' {
        dependsOn "auroraCommon"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform.css'], attrs:[media:'screen, projection']
    }

    'auroraRTL' {
        dependsOn "auroraCommon"

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/rtl.css'],       attrs:[media:'screen, projection']
    }
}
