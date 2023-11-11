require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행중입니다.`);
});

const OCTOPRINT_API_URL = 'http://localhost:5000/';
const OCTOPRINT_API_KEY = process.env.OCTOPRINT_API_KEY; // 환경 변수 사용

// OctoPrint 프린터 상태 가져오기
app.get('/api/printer-status', async (req, res) => {
    try {
      console.log('Fetching printer status from OctoPrint...');
      const response = await axios.get(`${OCTOPRINT_API_URL}/printer`, {
        headers: { 'X-Api-Key': OCTOPRINT_API_KEY }
      });
      console.log('Printer status received:', response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching printer status:', error);
      res.status(500).send('Error fetching printer status');
    }
  });
  
  // OctoPrint 프린터 온도 가져오기
  app.get('/api/printer-temperature', async (req, res) => {
    try {
      console.log('Fetching printer temperature from OctoPrint...');
      const toolResponse = await axios.get(`${OCTOPRINT_API_URL}/printer/tool`, {
        headers: { 'X-Api-Key': OCTOPRINT_API_KEY }
      });
      const bedResponse = await axios.get(`${OCTOPRINT_API_URL}/printer/bed`, {
        headers: { 'X-Api-Key': OCTOPRINT_API_KEY }
      });
      console.log('Printer temperature received:', {
        toolTemperature: toolResponse.data.tool0.actual,
        bedTemperature: bedResponse.data.bed.actual
      });
      res.json({
        toolTemperature: toolResponse.data.tool0.actual,
        bedTemperature: bedResponse.data.bed.actual
      });
    } catch (error) {
      console.error('Error fetching printer temperature:', error);
      res.status(500).send('Error fetching printer temperature');
    }
  });
  