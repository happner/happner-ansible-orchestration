
# happner-ansible-orchestration

## Introduction

This repo contains a set of sample Ansible scripts and Docker files that can be used for deploying happn and happner clusters.

The directory structure of the samples is as follows:

    * examples
        + happn-cluster
            + app - a lightweight node app containing minimal code to start a cluster node
            + deploy - a set of Ansible scripts and Docker file for orchestrating the deployment of the app
                + playbooks - the starting point for kicking off a build
                + roles 
                    + cluster_image_build - files required to deploy a cluster
                        + defaults - contains a main.yml file in which default values are set
                        + tasks - all the heavy lifting for the build takes place here
                        + templates - contains the Dockerfile that will be deployed to the relevant Docker host
                    + mongo_image_build - files required to deploy a mongo server
                        + defaults - contains a main.yml file in which default values are set
                        + tasks - all the heavy lifting for the build takes place here
                        + templates - contains the Dockerfile that will be deployed to the relevant Docker host
        + happner-cluster - [TODO]

### Where do I start?

When deploying with Ansible, all things start with a `playbook`. In the samples, there are 2 playbooks; one for a cluster deployment
 and one for a Mongo server deployment that the cluster nodes require for data storage.
 
To understand how the sample files relate to each other, start with a `playbook`, eg `deploy > playbooks > happn-cluster.yml` 
and you will notice a reference to `roles`. This refers to the `deploy > roles` directory and a specific sub-directory containing 
all files required for that playbook to run, eg: `deploy > roles > cluster_image_build`. You can see how these relate to each
other in the directory tree above.
 

## Ansible deployment and orchestration

Docker is great for building images that can be spun up into containers within seconds. However it is not a deployment or orchestration tool. Ansible enables us to deploy our images to remote Docker hosts and to then spin up containers on demand.
 For reference, there is a section at the end of this README that gives more detail on Docker builds.
 
### Installing Ansible (Ubuntu)

```
sudo apt-get install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```

### Installing Ansible (OSX)

If you have __Homebrew__ installed, then its just:

`> brew install ansible`

Otherwise, see [https://valdhaus.co/writings/ansible-mac-osx/](https://valdhaus.co/writings/ansible-mac-osx/) for 
other techniques.

### Docker host prerequistes

Ansible requires that the Docker hosts run Python 2.* . If this is missing (or version 3.* is installed), install Python 2 
as illustrated below: 

```
> sudo apt-get install python-minimal
# checking version
> python --version
Python 2.7.12
```

### Using Ansible to build Docker images and deploy to Docker hosts

#### Deploying a cluster

* Prerequisites: 
  * A "fleet" of Docker hosts (eg: AWS instances with Docker engine installed on each)
  * A build server with Ansible installed
  * Set up SSH access to the remote hosts using the following process (assuming you are "Bob"):
    * On each host, ensure that the SSH server is running, and that you can access the host via SSH from the build server
    * On your deployment/build server, generate a new SSH key pair (this will be used by Ansible) using:
    ```
    ssh-keygen -t rsa
    ...
    ```
    * Assuming that you saved the keys in the ~/.ssh directory, copy the newly generated PUBLIC key to each Docker host 
    as follows:
    ```
    cat ~/.ssh/id_rsa.pub | ssh root@dockerhost 'cat >> .ssh/authorized_keys'
    ``` 
    * The above command will login to the Docker host as __root__, and then copy the newly generated public key to the 
    authorised_keys file
    * Open your Ansible __hosts__ file in the project root, and ensure that the Docker host IP's and SSH credentials 
    are correct, eg:
    ```
    [my_docker_host_group]
    192.168.1.36 ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa
    192.168.1.37 ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa
    192.168.1.40 ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa
    ....
    ```
      * where each entry is a Docker host
      * SSH credentials to each is provided alongside the host IP

* Orchestration and build process:
  * Build server (running Ansible) detects when changes are made on a Github repo
  * An Ansible playbook is started
  * Connects to the Docker host fleet and executes the build steps in the playbook to build a Docker image  
  * Starts a Docker container remotely (including environment variables to set things such as ports, cluster info etc.)

* Commands run on the build server when a repo change is detected:
 * Executing a playbook uses the following pattern:
 
  ```
  > ansible-playbook -i [file containing host list] -vvvv -c [connection type] playbooks/happn-cluster.yml
  ```
  * where the -vvvv switch is the level of verbosity
  
 * Based on the sample happn-cluster playbook found in the `/playbooks` directory:
 
  ```
  > ansible-playbook -i cluster_hosts -vvvv playbooks/happn-cluster.yml
  ```

## For reference: Docker automation

The cluster node can be deployed inside a Docker container; the prerequisites for this are as follows:

### Install Docker engine on a physical machine or VM (such as AWS):

* Create your cloud instance (eg: an Ubuntu 14.04 AWS instance)
* Install the Docker engine on this instance using these instructions: [https://docs.docker.com/engine/installation/linux/ubuntulinux/](https://docs.docker.com/engine/installation/linux/ubuntulinux/)

### Create a Dockerfile for your project

* Create a folder for your Dockerfile on the instance, eg:
  `> mkdir -p /home/projects/happn-cluster`  
* Create a Dockerfile:
  `> cd /home/projects/happn-cluster && touch Dockerfile`
* Add the contents of the sample Dockerfile found in [https://github.com/happner/happn-cluster/blob/master/docker/staging/Dockerfile](https://github.com/happner/happn-cluster/blob/master/docker/staging/Dockerfile) to this new file
* You are now ready to kick off a Docker build

### Build a Docker image of the project

#### Staging

* Building the image from the newly created Dockerfile will do the following:
  * Install Ubuntu version 14.04
  * Install a specific version of Node (based on parameters passed in to the build) - this defaults to 4.6.2
  * Clones the repo ([https://github.com/happner/happn-cluster.git](https://github.com/happner/happn-cluster.git))
  * Runs `> npm install`
  * Installs MongoDB on the same image as the application
* To run the build:
  `> cd /home/projects/happn-cluster && sudo docker build -t happn-cluster:v1 .` (don't forget the '.' at the end!)
  * This will take some time and will output progress to the terminal
  
### Running a container based on the Docker image

* To run a container based on the newly created image, use the following command:
`> sudo docker run -p 8005:8005 -it --rm happner/happn-cluster:v1`
...where:
  * `-p 8005:8005` maps a container port to a port on the AWS instance (this can be whatever port you like, but ensure that the config file of the happn-cluster natches this)
* This will start the container, and display a shell prompt once started (note that MongoDB will also be started in a forked process, so you may need to wait a few seconds)
* You are now inside the container
* To ensure that everything is working as expected, run the tests:
  `> npm test`
  * This will kick off all the tests
  
  
### Resources

* Great intro: [https://thornelabs.net/2014/03/08/install-ansible-create-your-inventory-file-and-run-an-ansible-playbook-and-some-ansible-commands.html](https://thornelabs.net/2014/03/08/install-ansible-create-your-inventory-file-and-run-an-ansible-playbook-and-some-ansible-commands.html)
* [http://docs.ansible.com/ansible/intro_getting_started.html](http://docs.ansible.com/ansible/intro_getting_started.html)
* [https://github.com/ansible/ansible](https://github.com/ansible/ansible)
* [https://github.com/ansible/ansible-examples](https://github.com/ansible/ansible-examples)
* [https://galaxy.ansible.com/list#/roles](https://galaxy.ansible.com/list#/roles?page=1&page_size=10)
* [http://www.hashbangcode.com/blog/ansible-ssh-setup-playbook](http://www.hashbangcode.com/blog/ansible-ssh-setup-playbook)
