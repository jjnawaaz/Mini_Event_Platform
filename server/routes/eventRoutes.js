import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, upload.single("image"), createEvent);
router.put("/:id", protect, upload.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/rsvp", protect, rsvpEvent);
router.delete("/:id/rsvp", protect, cancelRsvp);

export default router;
