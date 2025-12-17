import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        console.error("Failed to load dashboard events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const createdEvents = events.filter(
    (event) => event.createdBy?._id === user.id
  );

  const attendingEvents = events.filter((event) =>
    event.attendees.some((att) => att._id === user.id)
  );

  const handleCancel = async (eventId) => {
    await api.delete(`/events/${eventId}/rsvp`);
    refreshEvents();
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${eventId}`);
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  const refreshEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data.events);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-white">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Events I Created</h2>

        {createdEvents.length === 0 ? (
          <p className="text-gray-500">
            You haven&apos;t created any events yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {createdEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Events I’m Attending</h2>

        {attendingEvents.length === 0 ? (
          <p className="text-gray-500">You haven’t RSVP’d to any events.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {attendingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
