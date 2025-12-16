import mongoose from "mongoose";
import Event from "../models/Event.js";

// create event
export const createEvent = async (req, res) => {
  const { title, description, dateTime, location, capacity } = req.body;

  // field checks
  if (!title || !description || !dateTime || !location || !capacity) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, dateTime, location, and capacity are required",
    });
  }

  // check if file is uploaded or not
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Event image is required",
    });
  }

  // check capacity
  if (capacity !== undefined) {
    if (isNaN(capacity) || Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive number",
      });
    }
  }

  const eventDate = new Date(dateTime);
  if (isNaN(eventDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid dateTime format",
    });
  }

  const event = await Event.create({
    title: title.trim(),
    description: description.trim(),
    dateTime: eventDate,
    location: location.trim(),
    capacity: Number(capacity),
    image: req.file.path,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    event,
  });
};

// get events
export const getEvents = async (req, res) => {
  const events = await Event.find()
    .populate("createdBy", "name")
    .populate("attendees", "name");

  return res.status(200).json({
    success: true,
    events,
  });
};

// update event
export const updateEvent = async (req, res) => {
  const { title, description, dateTime, location, capacity } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  if (!event.createdBy.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden invalid user",
    });
  }

  // check what to fields to update
  if (title) event.title = title.trim();
  if (description) event.description = description.trim();
  if (location) event.location = location.trim();

  if (dateTime) {
    const updatedDate = new Date(dateTime);
    if (isNaN(updatedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateTime format",
      });
    }
    event.dateTime = updatedDate;
  }

  // check capacity
  if (capacity !== undefined) {
    if (isNaN(capacity) || Number(capacity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive number",
      });
    }
  }

  // Add extra capacity
  if (capacity) {
    if (isNaN(capacity) || Number(capacity) < event.attendees.length) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be >= current number of attendees",
      });
    }
    event.capacity = Number(capacity);
  }

  // check image update
  if (req.file) {
    event.image = req.file.path;
  }

  await event.save();

  return res.status(200).json({
    success: true,
    event,
  });
};

// delete event
export const deleteEvent = async (req, res) => {
  // find event from params
  const event = await Event.findById(req.params.id);

  // check if event exists or not
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  // check if the event is created by the user sending request
  if (!event.createdBy.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  await event.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Event deleted",
  });
};

// RSVP - Transaction Safe
export const rsvpEvent = async (req, res) => {
  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if the event exists or not
    const event = await Event.findById(req.params.id).session(session);

    // if event is not found
    if (!event) throw new Error("Event not found");

    // if the user is already part of event
    if (event.attendees.some((id) => id.equals(req.user._id)))
      throw new Error("Already RSVP'd");

    // if the event is full
    if (event.attendees.length >= event.capacity)
      throw new Error("Event is full");

    // add new user to event
    event.attendees.push(req.user._id);
    await event.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "RSVP successful",
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// cancel rsvp
export const cancelRsvp = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, {
    // remove the user from event
    $pull: { attendees: req.user._id },
  });

  return res.status(200).json({
    success: true,
    message: "RSVP cancelled",
  });
};
