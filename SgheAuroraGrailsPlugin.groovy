/*******************************************************************************
Copyright 2009 - 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
class SgheAuroraGrailsPlugin {
    // the plugin version
    def version = "9.28.2"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.2.1 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    // TODO Fill in these fields
    def author = "Your name"
    def authorEmail = ""
    def title = "Plugin summary/headline"
    def description = '''\\
Brief description of the plugin.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/sghe-aurora"

    def doWithWebDescriptor = { xml ->
        def mimeMappings = xml.'mime-mapping'
        def node
        if(mimeMappings.size()) {
            node  = mimeMappings
        } else {
            node= xml[0]
        }

        node + {
            'mime-mapping'{
                'extension'('svg')
                'mime-type'('image/svg+xml')
            }
        }
        node + {
            'mime-mapping'{
                'extension'('svgz')
                'mime-type'('image/svg+xml')
            }
        }
    }

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}
