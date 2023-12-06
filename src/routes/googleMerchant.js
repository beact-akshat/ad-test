const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const { log } = require('../helper/logger');

module.exports = {
    googleMerchant: async () => {
        try {
            const jwtClient = new JWT({
                keyFile: './src/routes/merchant-center.json',
                scopes: ['https://www.googleapis.com/auth/content']
            });

            jwtClient.authorize((err, tokens) => {
                if (err) throw new Error('Error Authorizing:', err)
            });
            const content = google.content('v2.1');
            const merchantId = '121872651';

            return content.products.list({
                auth: jwtClient,
                merchantId: merchantId,
                maxResults: 20
            })
                .then(response => {
                    return response
                })
                .catch(error => {
                    throw new Error(error.message)
                })

        } catch (error) {
            throw new Error(error.message)
        }
    }
}
