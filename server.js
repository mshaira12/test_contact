const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👇 sert tes fichiers HTML/CSS/JS
app.use(express.static(__dirname));

const RESEND_API_KEY = 're_FpDe4D2P_8imKq1BjNFi2zm4R5aMDjNjU'; // ta clé Resend

app.post('/contact', async (req, res) => {
  try {
    const { name, _replyto, message } = req.body;
    if (!_replyto || !message) {
      return res.status(400).json({ status: 'error', message: 'Missing fields' });
    }

    // Utilise le fetch natif de Node 24
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Shayra ProTech <onboarding@resend.dev>',
        to: ['m_shaira@yahoo.fr'], // ton email perso
        subject: `Contact form: ${name || 'No name'}`,
        html: `<p><strong>Name:</strong> ${name || 'No name'}</p><p><strong>Email:</strong> ${_replyto}</p><p><strong>Message:</strong> ${message}</p>`
      })
    });

    const data = await response.text();
    if (!response.ok) throw new Error(data);

    res.json({ status: 'success', message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
