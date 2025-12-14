/**
 * Simple GitHub Webhook Server
 * 
 * Listens for GitHub push events and triggers deployment
 * Run with: node scripts/webhook-server.js
 * Or add to PM2: pm2 start scripts/webhook-server.js --name webhook
 */

const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-me';
const PORT = process.env.WEBHOOK_PORT || 9000;
const DEPLOY_SCRIPT = '/var/www/bank/scripts/deploy.sh';

function verifySignature(payload, signature) {
    if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'your-webhook-secret-change-me') {
        console.log('⚠️  Warning: Using default webhook secret. Set WEBHOOK_SECRET env var!');
        return true;
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature || ''), Buffer.from(digest));
}

function runDeploy() {
    console.log('🚀 Running deployment...');

    exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Deploy error:', error.message);
            return;
        }
        if (stderr) {
            console.error('Deploy stderr:', stderr);
        }
        console.log('Deploy output:', stdout);
        console.log('✅ Deployment complete!');
    });
}

const server = http.createServer((req, res) => {
    // Health check endpoint
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', message: 'Webhook server running' }));
        return;
    }

    // Webhook endpoint
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const signature = req.headers['x-hub-signature-256'];

            if (!verifySignature(body, signature)) {
                console.log('❌ Invalid signature');
                res.writeHead(401);
                res.end('Invalid signature');
                return;
            }

            try {
                const payload = JSON.parse(body);

                if (payload.ref === 'refs/heads/main') {
                    console.log(`📦 Push to main by ${payload.pusher?.name || 'unknown'}`);
                    console.log(`📝 Commit: ${payload.head_commit?.message || 'No message'}`);

                    runDeploy();

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'deploying' }));
                } else {
                    console.log(`ℹ️  Push to ${payload.ref} - ignoring (not main)`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'ignored', reason: 'not main branch' }));
                }
            } catch (e) {
                console.error('❌ Parse error:', e.message);
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });

        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`🎣 Webhook server listening on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Webhook URL:  http://YOUR_VPS_IP:${PORT}/webhook`);
});
