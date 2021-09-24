const app = require('./app');
const Docker = require('dockerode')
const docker = new Docker()

async function main() {
    if (!docker.getContainer('dogecoind_regtest')) {
        const container = await docker.createContainer({
            Image: 'xanimo/dogecoin-core:ubuntu',
            name: 'dogecoind_regtest',
            PortBindings: { ['18444/tcp']: [{ HostIp: '0.0.0.0', HostPort: '18444' }], ['18332/tcp']: [{ HostIp: '0.0.0.0', HostPort: '18332' }] },
            NetworkMode: 'host'
        })
        
        console.log('container created')
            
        await container.start({})
        
        console.log('container started')
    }
}

main()

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
