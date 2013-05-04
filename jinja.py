import time
import os
import codecs
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from jinja2 import Template

import jinjaconfig

os.chdir("source/")

class JinjaEventHandler(PatternMatchingEventHandler):

    def on_modified(self, event):
        template_file = codecs.open(event.src_path, 'r')
        template = Template(template_file.read())

        output_file_name = os.path.basename(event.src_path).replace(".tpl", "")
        output_file = \
                codecs.open("../app/%s" % output_file_name, 'w')

        output_file.write(template.render(jinjaconfig=jinjaconfig))
        print "jinja wrote file %s" % output_file_name


if __name__ == "__main__":
    event_handler = JinjaEventHandler(patterns=["*.tpl.html"])
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=True)
    observer.start()
    print "jinja is watching"
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
