import datetime
from fabric.operations import local, run

def deploy():
    local("cp -fR app/* deploy/")
    with lcd("deploy"):
        local("git add .")
        local("git commit -a -m 'Update %s'" % datetime.datetime.now())
        local("git push origin gh-pages")
