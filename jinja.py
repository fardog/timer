import time
import os
import sys
import codecs

from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from jinja2 import Template
from pathtools import path

from config import config_dev


class JinjaTemplateProcessor():

    def mkdirs(self, source_path, dest_path, working_path):
        common_prefix = os.path.commonprefix([
            source_path,
            working_path,
            ])
        new_paths = "%s/%s" % (dest_path,
                os.path.dirname(source_path).replace(common_prefix, ""))
        if not os.path.exists(new_paths):
            os.makedirs(new_paths)

        return new_paths

    def write_templates(self, source_path, dest_path, config=config_dev):
        # Open our input file
        template_file = codecs.open(source_path, 'r')
        template = Template(template_file.read())

        dest_file_name = os.path.basename(source_path).replace(".tpl", "")
        dest_file = \
                codecs.open("%s/%s" % (dest_path, dest_file_name), 'w')

        dest_file.write(template.render(jinjaconfig=config))

        return dest_file_name


class JinjaEventHandler(PatternMatchingEventHandler):

    def on_modified(self, event):
        template_processor = JinjaTemplateProcessor()

        output_dir = template_processor.mkdirs(event.src_path,
                path.absolute_path(config_dev.dest_path),
                path.absolute_path(config_dev.source_path))

        output_file = template_processor.write_templates(event.src_path,
                output_dir)

        print "jinja wrote file %s" % output_file

if __name__ == "__main__":
    event_handler = JinjaEventHandler(patterns=["*.tpl.html"])
    observer = Observer()
    observer.schedule(event_handler,
            path=config_dev.source_path,
            recursive=True)
    observer.start()
    print "jinja is watching"
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
