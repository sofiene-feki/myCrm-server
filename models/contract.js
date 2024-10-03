const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const contractSchema = mongoose.Schema(
  {
    contratRef: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    slug: {
      slug: { type: String, slug: ['clientRef', 'energie'], separator: '/' },
    },
    clientRef: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    Civility: {
      type: String,
      trim: true,
      maxlenght: 8,
      text: true,
    },
    Prénom: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },

    Nom: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    Tél: {
      type: String,
      index: true,
    },
    Email: {
      type: String,
      trim: true,
      maxlenght: 32,
      text: true,
    },
    Adresse: {
      type: String,
      maxlenght: 100,
    },
    Code_postal: {
      type: Number,
    },
    Commune: {
      type: String,
      maxlenght: 50,
      text: true,
    },
    energie: {
      type: String,
    },
    Point_de_livraison: {
      type: String,
    },
    Puissance: {
      type: String,
    },
    Offre: {
      type: String,
    },
    Statut: {
      type: String,
    },
    Nom_du_partenaire: {
      type: String,
    },
    date_de_début: {
      type: Date,
    },
    date_de_la_signature: {
      type: Date,
    },

    Mensualité: {
      type: String,
    },

    Fournisseur: {
      type: String,
    },

    Type_de_contrat: {
      type: String,
    },
    Mode_facturation: {
      type: String,
    },
    Option_tarifaire: {
      type: String,
    },
    Date_naissance: {
      type: Date,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    reservedAt: {
      type: Date,
      default: null,
    },
    quality: {
      values: {
        Appel_enregistré: {
          type: Boolean,
          default: false,
        },
        _14j_de_rétractation: {
          type: Boolean,
          default: false,
        },
        Autorisation_accès_GRD: {
          type: Boolean,
          default: false,
        },
        Inscription_Bloctel: {
          type: Boolean,
          default: false,
        },
        Valider_les_coordonnées_du_client: {
          type: Boolean,
          default: false,
        },
        Expliquer_que_nous_sommes_KOMPAR: {
          type: Boolean,
          default: false,
        },
        Explication_changement_de_fournisseur: {
          type: Boolean,
          default: false,
        },
        Discours_frauduleux_mensenger: {
          type: Boolean,
          default: false,
        },
        MES_non_conforme: {
          type: Boolean,
          default: false,
        },
        non_conformité_signature_recap: {
          type: Boolean,
          default: false,
        },
        Validation_à_la_place_du_prospect: {
          type: Boolean,
          default: false,
        },
        Comportement_général: {
          type: Boolean,
          default: false,
        },
        Mineur_trop_âgée_non_lucide: {
          type: Boolean,
          default: false,
        },
        IBAN_invalide: {
          type: Boolean,
          default: false,
        },
      },
      qualification: {
        type: String,
        enum: [
          'conforme',
          'non-conforme',
          'sav',
          'annulation',
          'aucun(e)',
          "pas d'enregistrement",
        ],
        default: 'aucun(e)',
      },
      comment: { type: String, default: '' },
      qualifiedBy: { type: String, default: '' },
    },
    sav: {
      qualification: {
        type: String,
        enum: ['validé', 'A_relancer', 'annulation', 'aucun(e)'],
        default: 'aucun(e)',
      },
      comment: { type: String, default: '' },
      qualifiedBy: { type: String, default: '' },
    },

    wc: {
      qualification: {
        type: String,
        enum: [
          'Validé',
          'Répondeur',
          'Appel raccrocher',
          'A suivre',
          'Refus de répondre',
          'Rappel',
          'Fiche blanche',
          'Stop télémarketing',
          'SAV',
          'Faux numéro',
          'Client toujours injoignable suite à un rappel planifié',
          'annulation',
          'aucun(e)',
        ],
        default: 'aucun(e)',
      },
      subQualification: {
        type: String,
      },
      comment: { type: String, default: '' },
      qualifiedBy: { type: String, default: '' },
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model('Contract', contractSchema);
