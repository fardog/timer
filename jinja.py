import time
import os
import sys
import codecs
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from jinja2 import Template

import jinjaconfig

os.chdir("source/")

class JinjaEventHandler(PatternMatchingEventHandler):

    def on_modified(self, event):
        # Open our input file
        template_file = codecs.open(event.src_path, 'r')
        template = Template(template_file.read())

        common_prefix = os.path.commonprefix([
            os.getcwd(),
            event.src_path,
            ])
        output_directory = "../app%s" % os.path.dirname(event.src_path).replace(common_prefix, "")
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)

        # Open our output file
        output_file_name = os.path.basename(event.src_path).replace(".tpl", "")
        output_file = \
                codecs.open("%s/%s" % (output_directory, output_file_name), 'w')

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
