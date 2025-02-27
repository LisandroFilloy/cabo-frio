const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');  // Importar nodemailer

// Configuración de Nodemailer
const REMITENTE = 'no.reply.lisandro@gmail.com'; // Cambia esto por tu correo
const PASSWORD = 'wnjbeiiovnafvpsl'; // Cambia esto por tu contraseña de aplicación generada

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: REMITENTE,
    pass: PASSWORD,
  },
});

router.post('/', async (req, res) => {
  try {
    // Recibimos los datos desde el frontend
    const { subject, receiver, text } = req.body;

    if (!subject || !receiver || !text) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: subject, receiver, text.' });
    }

    // Configuración del correo
    const mailOptions = {
      from: REMITENTE, 
      to: receiver, 
      subject: subject, 
      text: text, 
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Correo enviado con éxito.', info });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.', details: error.message });
  }
});

module.exports = router;
