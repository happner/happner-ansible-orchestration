# Multi-host, single container deployment

This deployment scenario has the following characteristics:

- assumes the target environment is a cloud such as **AWS**
- each target server runs **Docker**
- a SINGLE cluster node is deployed onto each Docker host and runs in a container




## Playbooks and roles

- see *happner-ansible-orchestration/examples/happn-cluster/deploy/multi_host_single_container/roles*
- ​


## Template files

- see *happner-ansible-orchestration/examples/happn-cluster/deploy/multi_host_single_container/roles/cluster_image_build/templates/*

- **cluster_config.json**

  - one of the critical steps in the deployment process is the ability of the **cluster-info** playbook to dynamically work through each host and determine it's **internal** IP address

  - once this is done, the **membership** section of the **cluster_config.json** template file is dynamically populated, by injecting the member info gathered by the cluster-info playbook, into `#port` and `#hosts` placeholders (see below)

    ```json
    ...
    "membership": {
          "config": {
            "join": "static",
            "seed": true,
            "seedWait": 1000,
            "port": "#port",
            "hosts": "#hosts"
          }
        },
     ...
    ```

- **Dockerfile**

  - this is the main Dockerfile that is deployed to the Docker host and used to initiate the image build