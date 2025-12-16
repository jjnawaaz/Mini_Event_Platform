import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dateTime: { type: Date, required: true },
    location: String,
    capacity: { type: Number, required: true },

    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    image: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
