source_path = "./source/"
dest_path = "./www/"

css = [
        "/css/app.{date}.min.css",
        ]

javascripts_header = [
        "phonegap.js",
        "/js/header.{date}.min.js",
        ]

javascripts_footer = [
        "/js/vendor/jquery.min.js",
        "/js/footer.{date}.min.js",
        ]

minify_names = {
        'css': "/css/app.{date}.min.css",
        'javascripts_header': "/js/header.{date}.min.js",
        'javascripts_footer': "/js/footer.{date}.min.js",
        }
