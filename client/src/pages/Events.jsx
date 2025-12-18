import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRsvp = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/rsvp`);
      refreshEvents();
    } catch {
      alert("Try booking again");
    }
  };

  const handleCancelRsvp = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}/rsvp`);
      refreshEvents();
    } catch {
      alert("Cancel failed");
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch {
      alert("Delete failed");
    }
  };

  const refreshEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data.events);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 ">
      <h1 className="text-3xl font-bold mb-6 text-white">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-white">No events found</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRsvp={handleRsvp}
              onCancel={handleCancelRsvp}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
