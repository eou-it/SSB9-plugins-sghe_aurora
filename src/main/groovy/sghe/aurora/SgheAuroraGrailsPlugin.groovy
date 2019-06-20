package sghe.aurora

import grails.plugins.*

class SgheAuroraGrailsPlugin extends Plugin {

    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "3.3.2 > *"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp"
    ]
    def title = "Sghe Aurora" // Headline display name of the plugin

    def profiles = ['web']

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/sghe-aurora"


    Closure doWithSpring() { {->

        }
    }
	

    void doWithDynamicMethods() {

    }

    void doWithApplicationContext() {

    }

    void onChange(Map<String, Object> event) {

    }

    void onConfigChange(Map<String, Object> event) {

    }

    void onShutdown(Map<String, Object> event) {

    }
}
