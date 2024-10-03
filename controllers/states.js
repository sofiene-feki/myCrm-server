// backend/controllers/contractController.js
const Contract = require('../models/contract');

exports.getBarChartData = async (req, res) => {
  try {
    // Get startDate and endDate from query parameters
    const { startDate, endDate } = req.query;

    // Debug: Log the startDate and endDate received from the query
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);

    // Ensure the dates are in the correct format
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Debug: Log the dateFilter object
    console.log('dateFilter:', dateFilter);

    // Perform aggregation with date_de_la_signature filtering
    const data = await Contract.aggregate([
      {
        // Ensure that only contracts within the date range are matched
        $match: {
          date_de_la_signature: dateFilter, // Apply the date filter here
        },
      },
      {
        $group: {
          _id: '$Nom_du_partenaire',
          primeoCount: {
            $sum: {
              $cond: [{ $eq: ['$Fournisseur', 'primeo'] }, 1, 0],
            },
          },
          ohmCount: {
            $sum: {
              $cond: [{ $eq: ['$Fournisseur', 'ohm'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          partenaire: '$_id',
          primeo: '$primeoCount',
          ohm: '$ohmCount',
        },
      },
    ]);

    // Debug: Log the response data
    console.log('Filtered data:', data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// backend/controllers/contractController.js

exports.getPieChartData = async (req, res) => {
  try {
    // Get startDate and endDate from query parameters

    const { startDate, endDate } = req.query;

    // Build date filter for the date_de_la_signature field
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    // Perform aggregation with date_de_la_signature filtering
    const data = await Contract.aggregate([
      {
        // Ensure that only contracts within the date range are matched
        $match: {
          date_de_la_signature: dateFilter, // Apply the date filter here
        },
      },
      {
        $group: {
          _id: '$Fournisseur',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          label: '$_id',
          value: '$count',
          color: {
            $cond: {
              if: { $eq: ['$_id', 'primeo'] },
              then: 'hsl(148, 70%, 50%)',
              else: 'hsl(68, 70%, 50%)',
            },
          },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyChartData = async (req, res) => {
  try {
    // Get startDate and endDate from query parameters
    const { startDate, endDate } = req.query;

    // Build date filter for the date_de_la_signature field
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Perform aggregation with date_de_la_signature filtering
    const data = await Contract.aggregate([
      {
        // Match contracts within the date range using dateFilter
        $match: {
          date_de_la_signature: dateFilter, // Apply the date filter here
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$date_de_la_signature',
              },
            },
            fournisseur: '$Fournisseur',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          primeo: {
            $sum: {
              $cond: [{ $eq: ['$_id.fournisseur', 'primeo'] }, '$count', 0],
            },
          },
          ohm: {
            $sum: {
              $cond: [{ $eq: ['$_id.fournisseur', 'ohm'] }, '$count', 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
      {
        $project: {
          _id: 0,
          date: '$_id', // Return the date as a field
          primeo: 1,
          ohm: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
