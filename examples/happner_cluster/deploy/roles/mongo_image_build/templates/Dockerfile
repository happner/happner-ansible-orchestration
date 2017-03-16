FROM ubuntu:14.04
MAINTAINER ig-grant

#### General ####
RUN apt-get update && apt-get install -y curl wget git git-core curl build-essential

#### Set up MongoDB ####

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
RUN apt-get update && apt-get install -y mongodb-org
RUN mkdir -p /data/db

### This doesn't need exposing as the Ansible playbook will set up the ports
#EXPOSE 12707

CMD mongod

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
