source_path = "./source/"
dest_path = "./stage/"

css = [
        "/css/app.{date}.min.css",
        ]

javascripts_header = [
        "/js/header.{date}.min.js",
        ]

javascripts_footer = [
        "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js",
        "/js/footer.{date}.min.js",
        ]

minify_names = {
        'css': "/css/app.{date}.min.css",
        'javascripts_header': "/js/header.{date}.min.js",
        'javascripts_footer': "/js/footer.{date}.min.js",
        }
