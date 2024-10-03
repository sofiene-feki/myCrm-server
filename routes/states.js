// backend/routes/contractRoutes.jsconst express = require('express');
const express = require('express');
const router = express.Router();

const {
  getBarChartData,
  getPieChartData,
  getDailyChartData,
} = require('../controllers/states');

router.get('/contracts/bar-chart-data', getBarChartData);
router.get('/contracts/pie-chart-data', getPieChartData);
router.get('/contracts/line-chart-data', getDailyChartData);

module.exports = router;
