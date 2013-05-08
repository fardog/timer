import datetime
from fabric.operations import local, run
from fabric.context_managers import cd, lcd

FAVICONS = {
        'ico': {
            'size': 32,
            'name': 'favicon.ico',
            },
        'apple-57': {
            'size': 57,
            'name': 'apple-touch-icon-precomposed.png',
            },
        'apple-72': {
            'size': 72,
            'name': 'apple-touch-icon-72x72-precomposed.png',
            },
        'apple-114': {
            'size': 114,
            'name': 'apple-touch-icon-114x114-precomposed.png',
            },
        'apple-144': {
            'size': 144,
            'name': 'apple-touch-icon-144x144-precomposed.png',
            },
        'fb': {
            'size': 300,
            'name': 'opengraph-icon.png',
            },
        }

def make_favicons():
    with lcd("app/assets/favicons/"):
        for k, v in FAVICONS.items():
            local("convert favicon.svg -resize %s %s" % (v['size'], v['name']))

def deploy():
    make_favicons();
    local("cp -fR app/* deploy/")
    with lcd("deploy"):
        local("git add .")
        local("git commit -a -m 'Update %s'" % datetime.datetime.now())
        local("git push origin gh-pages")
