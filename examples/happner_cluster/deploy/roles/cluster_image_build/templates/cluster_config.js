module.exports = {
    domain: 'DOMAIN_NAME',
    happn: {
        announceHost: "#announceHost",
        cluster: {
            requestTimeout: 2 * 1000,
            responseTimeout: 2 * 1000
        },
        services: {
            data: {
                config: {
                    datastores: [
                        {
                            name: "mongo",
                            provider: "happn-service-mongo-2",
                            isDefault: true,
                            settings: {
                                database: "#mongoDb",
                                collection: "#mongoCollection",
                                url: "#mongoUrl"
                            }
                        }
                    ]
                }
            },
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
