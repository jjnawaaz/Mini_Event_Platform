import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MapPin } from "lucide-react";
const ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

export default function EventCard({ event, onRsvp, onCancel, onDelete }) {
  const { user } = useAuth();

  const isOwner = user && event.createdBy?._id === user.id;
  const isAttending =
    user && event.attendees.some((att) => att._id === user.id);

  const availableSeats = event.capacity - event.attendees.length;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
      {/* Event Image */}
      <img
        src={`${ASSETS_URL}/${event.image}`}
        alt={event.title}
        className="h-48 w-full object-cover text-white"
      />

      {/* Content */}
      <div className="p-4 text-white">
        <h2 className="text-xl font-semibold tracking-wide">{event.title}</h2>

        <p className="text-sm text-gray-300 mt-1">
          {new Date(event.dateTime).toLocaleString()}
        </p>

        <p className="mt-2 text-gray-200 line-clamp-3">{event.description}</p>

        <div className="mt-2 text-sm text-gray-300 flex items-center gap-x-1">
          <MapPin size={16} /> {event.location}
        </div>

        <p
          className={`mt-2 font-medium ${
            availableSeats === 0 ? "text-red-400" : "text-emerald-400"
          }`}
        >
          Seats left: {availableSeats}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {user && !isOwner && (
            <>
              {isAttending ? (
                <button
                  onClick={() => onCancel(event._id)}
                  className="bg-yellow-500/90 hover:bg-yellow-500 text-black px-3 py-1 rounded transition"
                >
                  Cancel RSVP
                </button>
              ) : (
                <button
                  disabled={availableSeats === 0}
                  onClick={() => onRsvp(event._id)}
                  className="bg-emerald-500/90 hover:bg-emerald-500 text-black px-3 py-1 rounded disabled:opacity-50 transition"
                >
                  RSVP
                </button>
              )}
            </>
          )}

          {isOwner && (
            <>
              <Link
                to={`/edit/${event._id}`}
                className="bg-indigo-500/90 hover:bg-indigo-500 text-white px-3 py-1 rounded transition"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(event._id)}
                className="bg-red-500/90 hover:bg-red-500 text-white px-3 py-1 rounded transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
