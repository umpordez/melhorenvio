const V = require('argument-validator');
const MelhorEnvioBaseClient = require('./core/base-client');

const servicesMelhorEnvio = {
    'PAC': 1,
    'SEDEX': 2
}

class MelhorEnvio extends MelhorEnvioBaseClient {
    // https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos
    async calcFrete(from, to, products, services, options = {}) {

        V.string(from, 'from');
        V.string(to, 'to');
        V.isArray(services);

        const servicesSelected = [];
        for (const service of services) {
            const s = servicesMelhorEnvio[service.toUpperCase()];
            if (s) { servicesSelected.push(s); }
        }

        const res = await this.doRequest('POST', 'api/v2/me/shipment/calculate', {
            from: { postal_code: from },
            to: { postal_code: to },
            products,
            options: {
                // aviso de recabimento
                receipt: false,
                // mão própria
                own_hand: false
            },
            services: servicesSelected.join(',')
        });

        return res;
    }
}

module.exports = MelhorEnvio;
