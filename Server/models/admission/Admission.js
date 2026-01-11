const mongoose = require("mongoose");

/* ================= ADMISSION ================= */
const admissionSchema = new mongoose.Schema(
  {
    studentName: String,
    dob: Date,
    gender: String,
    classApplied: String,

    rollNumber: {
      type: Number,
      default: null, // 🔥 VERY IMPORTANT
    },

    parentName: String,
    phone: String,
    email: String,
    address: String,

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

/* ================= 🔥 PARTIAL UNIQUE INDEX ================= */
admissionSchema.index(
  { classApplied: 1, rollNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      rollNumber: { $ne: null },
    },
  }
);

module.exports = mongoose.model("Admission", admissionSchema);
