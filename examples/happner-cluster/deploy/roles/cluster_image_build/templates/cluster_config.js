module.exports = {
    domain: 'DOMAIN_NAME',
    happn: {
        cluster: {
            requestTimeout: 2 * 1000,
            responseTimeout: 2 * 1000
        },
        services: {
            membership: {
                config: {
                    join: "static",
                    seed: "#seed",
                    seedWait: 1000,
                    port: "#port",
                    hosts: "#hosts"
                }
            }
        }
    }
};
