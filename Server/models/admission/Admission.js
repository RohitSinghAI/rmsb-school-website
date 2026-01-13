const mongoose = require("mongoose");

/* ================= DOCUMENT VERSION ================= */
const documentVersionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

/* ================= DOCUMENT MAIN ================= */
const singleDocumentSchema = new mongoose.Schema({
  current: {
    type: documentVersionSchema,
    default: null,
  },
  history: {
    type: [documentVersionSchema],
    default: [],
  },
});

/* ================= ADMISSION ================= */
const admissionSchema = new mongoose.Schema(
  {
    /* ========== STUDENT INFO ========== */
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    /* ========== CLASS ========== */
    classApplied: {
      type: String,
      enum: ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8"],
      required: true,
    },

    /* ========== PROMOTION INFO ========== */
    previousClass: {
      type: String,
      enum: ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8"],
      default: null,
    },

    promotedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      default: null,
    },

    isPromoted: {
      type: Boolean,
      default: false,
    },

    /* ========== CLASS-WISE ROLL NUMBER ========== */
    rollNumber: {
      type: Number,
      default: null,
    },

    /* ========== STUDENT IMAGE ========== */
    studentImage: {
      current: {
        type: documentVersionSchema,
        default: null,
      },
      history: {
        type: [documentVersionSchema],
        default: [],
      },
    },

    /* ========== PARENT INFO ========== */
    parentName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    /* ========== ADDRESS ========== */
    address: {
      type: String,
      required: true,
    },

    /* ========== DOCUMENTS ========== */
    documents: {
      birthCertificate: {
        type: singleDocumentSchema,
        default: () => ({}),
      },
      reportCard: {
        type: singleDocumentSchema,
        default: () => ({}),
      },
      transferCertificate: {
        type: singleDocumentSchema,
        default: () => ({}),
      },
    },

    /* ========== VISIT ========== */
    visitDate: Date,
    visitTime: String,

    /* ========== STATUS ========== */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

/* ================= ROLL NUMBER LOGIC ================= */
admissionSchema.pre("save", async function (next) {
  try {
    // ❌ pending / rejected → rollNumber null
    if (this.status !== "approved") {
      this.rollNumber = null;
      return next();
    }

    // ✅ already generated → skip
    if (this.rollNumber) return next();

    const year = new Date().getFullYear();
    const base = year * 100;

    const students = await mongoose.models.Admission.find({
      classApplied: this.classApplied,
      status: "approved",
      rollNumber: { $ne: null },
    }).select("rollNumber");

    const used = students
      .map((s) => s.rollNumber - base)
      .sort((a, b) => a - b);

    let seq = 1;
    for (const n of used) {
      if (n === seq) seq++;
      else break;
    }

    this.rollNumber = base + seq;
    next();
  } catch (err) {
    next(err);
  }
});

/* ================= UNIQUE INDEX (🔥 MOST IMPORTANT) ================= */
admissionSchema.index(
  { classApplied: 1, rollNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      rollNumber: { $ne: null },
    },
  }
);


const Admission = mongoose.model("Admission", admissionSchema);
module.exports = Admission;
