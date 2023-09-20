require('../test-helper');

const assert = require('assert');
const MelhorEnvioBaseClient = require('../../core/base-client');
const MelhorEnvio = require('../../index');

describe('Melhor Envio', () => {
    const { SANDBOX_TOKEN, PROD_TOKEN } = process.env;

    it('initialize client', () => {
        const client = new MelhorEnvioBaseClient(SANDBOX_TOKEN, 'sandbox');

        assert(client.env === 'sandbox');
        assert(client.accessToken === SANDBOX_TOKEN);
        assert(/sandbox\.melhorenvio/.test(client.config.baseUrl));
    });

    it('tests doRequest to me', async() => {
        const client = new MelhorEnvioBaseClient(PROD_TOKEN, 'prod');
        const res = await client.doRequest('GET', 'api/v2/me');

        assert(res);
        assert(typeof res.id !== 'undefined');

        assert(client.lastRequest);
        assert(client.lastResponse);

        assert(client.lastRequest.headers);
        assert(client.lastRequest.url);

        assert(client.lastResponse.headers);
        assert(client.lastResponse.body);
    });

    it('tests doRequest to calcFrete', async() => {
        const client = new MelhorEnvioBaseClient(PROD_TOKEN, 'prod');
        const res = await client.doRequest('POST', 'api/v2/me/shipment/calculate', {
            from: { postal_code: '96020360' },
            to: { postal_code: '01018020' },
            products: [
                {
                    id: '123',
                    width: 11,
                    height: 17,
                    length: 11,
                    weight: 0.3,
                    insurance_value: 10.1,
                    quantity: 1
                }
            ],
            options: {
                receipt: false,
                own_hand: false
            },
            services: '1,2'
        });

        assert(res);
        assert(res.length);

        assert(client.lastRequest);
        assert(client.lastResponse);

        assert(client.lastRequest.headers);
        assert(client.lastRequest.url);

        assert(client.lastResponse.headers);
        assert(client.lastResponse.body);
    });

    it('tests melhorEnvio.calcFrete', async() => {
        const client = new MelhorEnvio(PROD_TOKEN, 'prod');
        const res = await client.calcFrete(
            '96020360',
            '01018020',
            [
                {
                    id: '123',
                    width: 30,
                    height: 30,
                    length: 30,
                    weight: 5,
                    insurance_value: 100,
                    quantity: 3
                }
            ],
            ['sedex', 'pac']
        );

        console.log(res);
        assert(res);
    });
});
