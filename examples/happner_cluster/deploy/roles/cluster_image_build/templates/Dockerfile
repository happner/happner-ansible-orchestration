FROM ubuntu:14.04
MAINTAINER ig-grant

# Declare args
ARG NVM_DIR=$HOME/.nvm
ARG NVM_VERSION=0.32.0
ARG NODE_VERSION=4.6.2
ARG BUILD_VERSION=0.0.0

#### General ####
RUN apt-get update && apt-get install -y curl wget git git-core curl build-essential

#### Install NVM (Node Version Manager) ####

# Replace sh with bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

## Create cluster dir and copy tarball
RUN mkdir -p home

## This step simply causes the image build to run from this step if the build version has changed
RUN BUILD_VERSION="{{cluster_build_version}}"

COPY cluster.tar home

# extract tarball
RUN tar -xvf home/cluster.tar -C home
#RUN echo "{{ cluster_image_tag }}" > /home/happner_cluster/version.txt
#RUN echo "{{ cluster_repo.after }}" > /home/happner_cluster/git_revision.txt

# Install npm dependencies
RUN cd /home/happner_cluster/examples/happner_cluster/app && npm install

### Set up working directory
WORKDIR /home/happner_cluster/examples/happner_cluster/app


# CMD ping localhost
CMD node server >> server.log


# CMD ["/bin/bash"]

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
