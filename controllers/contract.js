const Contract = require('../models/contract');
const moment = require('moment');

exports.create = async (req, res) => {
  try {
    // console.log(req.body);
    //req.body.slug = slugify(slug);

    const newContract = await Contract.insertMany(req.body);
    //console.log(res);
    res.json(newContract);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const { clientRef, energie } = req.params;
    const contract = await Contract.findOne({ clientRef, energie }).exec();
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    let otherEnergie;
    if (energie === 'Gaz') {
      otherEnergie = 'électricité';
    } else if (energie === 'électricité') {
      otherEnergie = 'Gaz';
    }

    const otherContract = await Contract.findOne({
      clientRef,
      energie: otherEnergie,
    }).exec();
    const otherContractLink = otherContract
      ? `/contract-details/${clientRef}/${otherEnergie}`
      : '';

    res.json({ contract, otherContractLink });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.adminRows = async (req, res) => {
  const { page } = req.body.paginationModel;
  const { sortOptions } = req.body;
  const pageSize = 20;
  console.log(req.body.quickFilter);
  const quickFilterValue = req.body.quickFilter[0];

  try {
    const query = {};
    const projection = {
      contratRef: 1,
      clientRef: 1,
      energie: 1,
      Nom: 1,
      Tél: 1,
      Fournisseur: 1,
      date_de_la_signature: 1,
      StatutQté: '$quality.qualification',
      StatutWc: '$wc.qualification',
      StatutSav: '$sav.qualification',
      Nom_du_partenaire: 1,
      _id: 0,
    };
    if (quickFilterValue) {
      query['$or'] = [
        { clientRef: { $eq: quickFilterValue } },
        { Tél: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ];
    }
    let contracts;

    if (sortOptions && sortOptions.length > 0) {
      contracts = await Contract.find(query, projection)
        .sort(
          sortOptions.map(({ field, sort }) => [field, sort === 'asc' ? 1 : -1])
        )
        .skip(page * pageSize)
        .limit(pageSize);
    } else {
      contracts = await Contract.find(query, projection)
        .skip(page * pageSize)
        .limit(pageSize);
    }

    const totalContracts = await Contract.countDocuments(query);

    res.json({
      data: contracts,
      page: page,
      total: totalContracts,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.qtéRows = async (req, res) => {
  const { page } = req.body.paginationModel;
  const { sortOptions } = req.body;
  const pageSize = 20;
  console.log(req.body.quickFilter);
  const quickFilterValue = req.body.quickFilter[0];

  try {
    const query = {
      $and: [
        { 'quality.qualification': 'aucun(e)' }, // Only show contracts with quality.qualification equal to "aucun(e)"
      ],
    };
    const projection = {
      contratRef: 1,
      clientRef: 1,
      Tél: 1,
      Civility: 1,
      reservedBy: 1,
      Prénom: 1,
      Nom: 1,
      energie: 1,
      Fournisseur: 1,
      date_de_la_signature: 1,
      StatutQté: '$quality.qualification',
      StatutWc: '$wc.qualification',
      StatutSav: '$sav.qualification',
      Nom_du_partenaire: 1,
      _id: 1,
    };

    if (quickFilterValue) {
      query['$or'] = [
        { clientRef: { $eq: quickFilterValue } },
        { Tél: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ];
    }

    let contracts;

    if (sortOptions && sortOptions.length > 0) {
      contracts = await Contract.find(query, projection)
        .sort(
          sortOptions.map(({ field, sort }) => [field, sort === 'asc' ? 1 : -1])
        )
        .skip(page * pageSize)
        .limit(pageSize);
    } else {
      contracts = await Contract.find(query, projection)
        .skip(page * pageSize)
        .limit(pageSize);
    }

    const totalContracts = await Contract.countDocuments(query);

    res.json({
      data: contracts,
      total: totalContracts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.wcRows = async (req, res) => {
  const quickFilterValue = req.body.quickFilter[0];
  console.log(quickFilterValue);

  try {
    let query = Contract.find();

    if (quickFilterValue) {
      query.or([
        { clientRef: { $eq: quickFilterValue } },
        { Tél: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ]);
    } else {
      return res.json([]);
    }

    const projection = {
      contratRef: 1,
      clientRef: 1,
      Tél: 1,
      Civility: 1,
      reservedBy: 1,
      Prénom: 1,
      Nom: 1,
      energie: 1,
      Fournisseur: 1,
      date_de_la_signature: 1,
      StatutQté: '$quality.qualification',
      StatutWc: '$wc.qualification',
      StatutSav: '$sav.qualification',
      Nom_du_partenaire: 1,
      _id: 1,
    };

    const contracts = await Contract.find(query, projection).exec();

    // Close the database connection and return the filtered data in the response
    res.json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

exports.savRows = async (req, res) => {
  const quickFilterValue = req.body.quickFilter[0];
  const { page } = req.body.paginationModel;
  const { sortOptions } = req.body;
  const pageSize = 20;

  try {
    let query = Contract.find();

    if (quickFilterValue) {
      query.or([
        { clientRef: { $eq: quickFilterValue } },
        { Tél: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ]);
    } else {
      query.where('sav.qualification').in([null, 'aucun(e)', 'A relancer']);
      query.or([
        { 'quality.qualification': 'SAV' },
        { 'wc.qualification': 'SAV' },
      ]);
    }
    const projection = {
      contratRef: 1,
      clientRef: 1,
      Tél: 1,
      Civility: 1,
      reservedBy: 1,
      Prénom: 1,
      Nom: 1,
      energie: 1,
      Fournisseur: 1,
      date_de_la_signature: 1,
      StatutQté: '$quality.qualification',
      StatutWc: '$wc.qualification',
      StatutSav: '$sav.qualification',
      Nom_du_partenaire: 1,
      _id: 1,
    };

    const contracts = await Contract.find(query, projection)
      .sort(
        sortOptions.map(({ field, sort }) => [field, sort === 'asc' ? 1 : -1])
      )
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();

    const totalContracts = await Contract.countDocuments(query);

    res.json({
      data: contracts,
      total: totalContracts,
    });
    console.log(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.reservation = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).send({ error: 'Contract not found' });
    }

    if (contract.reservedBy) {
      return res.status(403).send({ error: 'Contract already reserved' });
    }

    contract.reservedBy = req.body.user;

    await contract.save();

    return res.send({ message: 'Contract reserved successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.filters = async (req, res) => {
  const { serverFilters, paginationModel, sortOptions } = req.body;
  const { page, pageSize } = paginationModel;

  try {
    const query = {};

    const projection = {
      contratRef: 1,
      clientRef: 1,
      Tél: 1,
      Civility: 1,
      reservedBy: 1,
      Prénom: 1,
      Nom: 1,
      energie: 1,
      Fournisseur: 1,
      date_de_la_signature: 1,
      StatutQté: '$quality.qualification',
      StatutWc: '$wc.qualification',
      Nom_du_partenaire: 1,
      _id: 1,
    };

    if (serverFilters.partenaire) {
      query.Nom_du_partenaire = serverFilters.partenaire;
    }

    if (serverFilters.qualificationQté) {
      query['quality.qualification'] = serverFilters.qualificationQté;
    }

    if (serverFilters.qualificationWc) {
      query['wc.qualification'] = serverFilters.qualificationWc;
    }

    if (serverFilters.fournisseur) {
      query.Fournisseur = serverFilters.fournisseur;
    }

    if (serverFilters.date && serverFilters.date.length > 0) {
      const { startDate, endDate } = serverFilters.date[0];
      const startOfDay = moment(startDate).startOf('day').toISOString();
      const endOfDay = moment(endDate).endOf('day').toISOString();

      if (endDate) {
        query.date_de_la_signature = {
          $gte: new Date(startOfDay),
          $lte: new Date(endOfDay),
        };
      }
    }

    let contracts = [];
    const totalContracts = await Contract.countDocuments(query);

    if (sortOptions && sortOptions.length > 0) {
      contracts = await Contract.find(query, projection)
        .sort(
          sortOptions.map(({ field, sort }) => [field, sort === 'asc' ? 1 : -1])
        )
        .skip(page * pageSize)
        .limit(pageSize);
    } else {
      contracts = await Contract.find(query, projection)
        .skip(page * pageSize)
        .limit(pageSize);
    }

    res.json({
      data: contracts,
      total: totalContracts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.quickFilter = async (req, res) => {
  const quickFilterValue = req.body.quickFilter[0];
  console.log(quickFilterValue);
  try {
    const query = {
      $or: [
        { clientRef: { $eq: quickFilterValue } },
        { Tél: { $eq: quickFilterValue } },
        { Nom: { $eq: quickFilterValue } },
      ],
    };
    const contracts = await Contract.find(query).exec();

    res.json(contracts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.updateQuality = async (req, res) => {
  try {
    console.log(req.body);
    const { slug, energie } = req.params;

    const clientRef = slug;

    const updatedDocument = await Contract.findOneAndUpdate(
      { clientRef, energie },
      {
        $set: {
          'quality.values': req.body.switchState,
          'quality.qualification': req.body.qualification,
          'quality.comment': req.body.comment,
          'quality.qualifiedBy': req.body.user,
        },
      },
      { new: true }
    ).exec();

    //console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSav = async (req, res) => {
  //console.log('---------> i m the req', req.body);
  const { slug, energie } = req.params;

  const clientRef = slug;

  try {
    console.log(req.body);
    const updatedDocument = await Contract.findOneAndUpdate(
      { clientRef, energie },

      {
        $set: {
          'sav.qualification': req.body.qualification,
          'sav.comment': req.body.comment,
          'sav.qualifiedBy': req.body.user,
        },
      },
      { new: true }
    ).exec();

    //console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateWc = async (req, res) => {
  const { slug, energie } = req.params;

  const clientRef = slug;
  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { clientRef, energie },
      {
        $set: {
          'wc.subQualification': req.body.AnnuleRaison,
          'wc.qualification': req.body.qualification,
          'wc.comment': req.body.comment,
          'wc.qualifiedBy': req.body.user,
        },
      },
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { slug, energie } = req.params;

  const clientRef = slug;
  try {
    const updatedDocument = await Contract.findOneAndUpdate(
      { clientRef, energie },
      req.body,
      { new: true }
    ).exec();

    console.log('---------> i m the update', updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.exportData = async (req, res) => {
  const { filters } = req.body;
  const date = filters.date && filters.date.length > 0 ? filters.date[0] : null;
  console.log(req.body);

  try {
    let query = {};
    if (date && date.endDate !== null) {
      query.date_de_la_signature = {};
      if (date.startDate) {
        query.date_de_la_signature.$gte = moment(date.startDate)
          .startOf('day')
          .toDate();
      }
      if (date.endDate) {
        query.date_de_la_signature.$lte = moment(date.endDate)
          .endOf('day') // use end of endDate instead of end of day
          .toDate();
      }
    }

    if (filters.qualificationQté) {
      query['quality.qualification'] = filters.qualificationQté;
    }

    if (filters.qualificationWc) {
      query['wc.qualification'] = filters.qualificationWc;
    }

    if (filters.partenaire) {
      query.Nom_du_partenaire = filters.partenaire;
    }

    if (filters.fournisseur) {
      query.Fournisseur = filters.fournisseur;
    }

    let contracts;

    if (Object.keys(query).length === 0) {
      contracts = await Contract.find({});
    } else {
      contracts = await Contract.find(query);
      // console.log('querry ------->', query);
    }

    res.json(contracts);
  } catch (err) {
    console.log(err);
  }
};
