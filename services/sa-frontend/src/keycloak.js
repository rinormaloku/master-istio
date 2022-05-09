import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
        url: window.location.href + 'auth',
        realm: 'master',
        clientId: 'sa-frontend'
    }
)

export default keycloak
