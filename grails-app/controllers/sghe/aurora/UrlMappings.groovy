package sghe.aurora

class UrlMappings {

    static mappings = {
        "/ssb/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
    }
}
