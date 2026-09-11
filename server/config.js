const path = require('node:path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'gramseva-karnataka-pilot-secret-key-2026',
  JWT_EXPIRY: '7d',
  PILOT_VILLAGE: 'Honnur',
  PILOT_GP: 'Honnur Gram Panchayat',
  PILOT_DISTRICT: 'Mandya',
  MAIL: {
    HOST: process.env.MAIL_HOST || 'smtp.ethereal.email',
    PORT: process.env.MAIL_PORT || 587,
    USER: process.env.MAIL_USERNAME || '',
    PASS: process.env.MAIL_PASSWORD || '',
    FROM: process.env.MAIL_FROM || '"GramSeva Honnur GP" <notifications@gramseva.kar.gov.in>'
  },
  GOOGLE_FEEDBACK_FORM_URL: process.env.GOOGLE_FEEDBACK_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLScDemoGramSevaFeedback/viewform?usp=pp_url&entry.1024={ISSUE_ID}',
  UPLOAD_DIR: path.join(__dirname, '../uploads')
};
