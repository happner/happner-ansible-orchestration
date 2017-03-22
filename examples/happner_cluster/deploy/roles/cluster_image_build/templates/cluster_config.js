// #version

module.exports = {
    name: "#name",
    domain: 'DOMAIN_NAME',
    happn: {
        announceHost: "#announceHost",
        cluster: {
            requestTimeout: 10 * 1000,
            responseTimeout: 10 * 1000
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
                    seed: "#seed",
                    seedWait: 1000,
                    hosts: "#hosts"
                }
            }
        }
    }
};
