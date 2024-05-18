const playersRouter = require('./src/players');
const cors = require('cors');


const express = require('express');

const app = express();
const port = 8080;

const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(cors());

app.use('/playersInfoSolo', createProxyMiddleware({ 
    target: 'https://mobalytics.gg/api/lol/graphql/v1/query', 
    changeOrigin: true 
}));

app.use('/playersInfoFlex', createProxyMiddleware({ 
    target: 'https://mobalytics.gg/api/lol/graphql/v1/query', 
    changeOrigin: true 
}));

app.use('/playersSoloStats', createProxyMiddleware({ 
    target: 'https://mobalytics.gg/api/lol/graphql/v1/query', 
    changeOrigin: true 
}));

app.use('/playersFlexStats', createProxyMiddleware({ 
    target: 'https://mobalytics.gg/api/lol/graphql/v1/query', 
    changeOrigin: true 
}));

app.use('/buscar',createProxyMiddleware({
    target: 'https://lol-web-api.op.gg/api/v1.0/internal/bypass/summoners/v2/las/autocomplete',
    changeOrigin: true,
    onProxyReq: function(proxyReq, req, res) {
        const params = new URLSearchParams(req.query);
        const newUrl = proxyReq.path + '?' + params.toString();
        proxyReq.path = newUrl;
    }
}));



app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.use('/players', playersRouter);

app.listen(port, () => {
    console.log(`La aplicación está escuchando en el puerto ${port}`);
});

module.exports = app;