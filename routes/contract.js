const express = require('express');

const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/auth');

const {
  create, read, adminRows,filters, qtéRows, reservation, quickFilter, updateQuality, updateSav, updateWc, savRows, wcRows, exportData, update,

} = require('../controllers/contract');

router.post('/contract', authCheck, adminCheck, create);
router.post('/admin-contracts', adminRows);
router.post('/qty-contracts', qtéRows);
router.post('/sav-contracts', savRows);
router.post('/wc-contracts', wcRows);
router.get('/contract/:clientRef/:energie', read);

router.post('/Filters', filters);
router.post('/quickFilters', quickFilter);
router.post('/:id/reserve', reservation);

router.post('/contracts/export', exportData);


router.put('/contract/update/quality/:slug/:energie', updateQuality);
 router.put('/contract/update/sav/:slug/:energie',  updateSav);
router.put('/contract/update/wc/:slug/:energie',  updateWc);
router.put("/contract/update/:slug/:energie",  update);







module.exports = router;
