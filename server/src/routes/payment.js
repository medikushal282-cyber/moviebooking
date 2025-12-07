const express = require('express');
const router = express.Router();

// In-memory store for payment status (use Redis in production)
const paymentStatus = new Map();

// Endpoint to simulate payment scan/completion
router.get('/simulate/:id', (req, res) => {
    const { id } = req.params;
    paymentStatus.set(id, 'completed');

    // Return a simple success page
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Successful</title>
            <style>
                body {
                    background: #1a0b1f;
                    color: #fff;
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .success-icon {
                    color: #10b981;
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="success-icon">✓</div>
            <h1>Payment Verified</h1>
            <p>You can now return to the booking page.</p>
        </body>
        </html>
    `);
});

// Endpoint to check payment status
router.get('/status/:id', (req, res) => {
    const { id } = req.params;
    const status = paymentStatus.get(id) || 'pending';
    res.json({ status });
});

module.exports = router;
