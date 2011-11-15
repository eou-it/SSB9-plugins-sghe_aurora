/** *****************************************************************************
 Copyright 2008-2011 SunGard Higher Education. All Rights Reserved.

 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is
 limited solely to SunGard Higher Education licensees, and is further subject
 to the terms and conditions of one or more written license agreements between
 SunGard Higher Education and the licensee in question. SunGard, Banner and
 Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 ****************************************************************************** */

modules = {
    'aurora' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "aurora"

        resource url:[plugin: 'sghe-aurora', file: 'js/utils.js'],  disposition: 'head'
        resource url:[plugin: 'sghe-aurora', file: 'js/config.js'],  disposition: 'head'
        resource url:[plugin: 'sghe-aurora', file: 'js/common-controls.js'],  disposition: 'head'
        resource url:[plugin: 'sghe-aurora', file: 'js/common-integration.js'],  disposition: 'head'
        resource url:[plugin: 'sghe-aurora', file: 'js/common-navigation.js'],  disposition: 'head'
        resource url:[plugin: 'sghe-aurora', file: 'js/common-platform.js'],  disposition: 'head'
    }
}