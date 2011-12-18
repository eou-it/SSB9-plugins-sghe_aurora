/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

modules = {
    'aurora' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform.css'], attrs:[media:'screen, projection']

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
        resource url:[plugin: 'sghe-aurora', file: 'css/rtl.css'],       attrs:[media:'screen, projection']
    }
}