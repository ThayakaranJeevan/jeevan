import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Armchair,
  CalendarDays,
  Check,
  Clock3,
  Film,
  MapPin,
  Minus,
  Plus,
  Ticket,
} from "lucide-react";
import "./styles.css";
import neonOrbit from "./assets/neon-orbit.png";
import midnightReel from "./assets/midnight-reel.png";

const movies = [
  {
    id: "neon-orbit",
    title: "Neon Orbit",
    genre: "Sci-Fi Adventure",
    duration: "2h 08m",
    rating: "PG-13",
    price: 12,
    poster: neonOrbit,
    accent: "#19cbd3",
    description:
      "A daring pilot races through a glowing orbital city to stop a blackout that could trap millions above Earth.",
    showtimes: ["10:30 AM", "1:45 PM", "5:30 PM", "8:45 PM"],
  },
  {
    id: "midnight-reel",
    title: "Midnight Reel",
    genre: "Mystery Drama",
    duration: "1h 54m",
    rating: "PG",
    price: 10,
    poster: midnightReel,
    accent: "#d4a13b",
    description:
      "A forgotten film reel pulls a small-town projectionist into a warm, rainy-night mystery.",
    showtimes: ["11:15 AM", "2:30 PM", "6:15 PM", "9:20 PM"],
  },
];

const initialSeats = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];
const reservedSeats = new Set(["A3", "B2", "C4"]);

function App() {
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);

  const openBooking = (movie) => {
    setSelectedMovie(movie);
    setPage("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      {page === "home" ? (
        <HomePage onBook={openBooking} />
      ) : (
        <BookingPage movie={selectedMovie} onBack={() => setPage("home")} />
      )}
    </main>
  );
}

function HomePage({ onBook }) {
  return (
    <section className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Film size={20} />
          </span>
          <span>CineSeat</span>
        </div>
        <span className="location">
          <MapPin size={16} />
          Colombo City Cinema
        </span>
      </header>

      <section className="home-intro">
        <p>Now showing</p>
        <h1>Book your next cinema night in a few clicks.</h1>
      </section>

      <section className="movie-grid" aria-label="Movies">
        {movies.map((movie) => (
          <article className="movie-card" key={movie.id}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <div className="movie-content">
              <div>
                <span className="pill">{movie.rating}</span>
                <h2>{movie.title}</h2>
                <p>{movie.description}</p>
              </div>

              <div className="movie-meta">
                <span>
                  <Clock3 size={16} />
                  {movie.duration}
                </span>
                <span>{movie.genre}</span>
              </div>

              <button className="primary-button" onClick={() => onBook(movie)}>
                <Ticket size={18} />
                Book tickets
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

function BookingPage({ movie, onBack }) {
  const [showtime, setShowtime] = useState(movie.showtimes[0]);
  const [tickets, setTickets] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState(["A1", "A2"]);

  const total = useMemo(() => tickets * movie.price, [tickets, movie.price]);

  const changeTickets = (amount) => {
    const next = Math.min(6, Math.max(1, tickets + amount));
    setTickets(next);
    setSelectedSeats((current) => current.slice(0, next));
  };

  const toggleSeat = (seat) => {
    if (reservedSeats.has(seat)) return;

    setSelectedSeats((current) => {
      if (current.includes(seat)) {
        return current.filter((item) => item !== seat);
      }

      if (current.length >= tickets) {
        return current;
      }

      return [...current, seat];
    });
  };

  return (
    <section className="page-shell">
      <header className="topbar">
        <button className="ghost-button" onClick={onBack}>
          Back to movies
        </button>
        <div className="brand compact">
          <Film size={18} />
          <span>CineSeat</span>
        </div>
      </header>

      <section className="booking-layout">
        <aside className="booking-poster">
          <img src={movie.poster} alt={`${movie.title} poster`} />
        </aside>

        <section className="booking-panel">
          <span className="pill">{movie.genre}</span>
          <h1>{movie.title}</h1>
          <p className="movie-description">{movie.description}</p>

          <div className="booking-section">
            <h2>
              <CalendarDays size={18} />
              Showtime
            </h2>
            <div className="showtime-list">
              {movie.showtimes.map((time) => (
                <button
                  className={time === showtime ? "time-button active" : "time-button"}
                  key={time}
                  onClick={() => setShowtime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="booking-section split">
            <h2>
              <Ticket size={18} />
              Tickets
            </h2>
            <div className="counter">
              <button onClick={() => changeTickets(-1)} aria-label="Decrease tickets">
                <Minus size={16} />
              </button>
              <strong>{tickets}</strong>
              <button onClick={() => changeTickets(1)} aria-label="Increase tickets">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="booking-section">
            <h2>
              <Armchair size={18} />
              Seats
            </h2>
            <div className="screen">Screen</div>
            <div className="seat-grid">
              {initialSeats.map((seat) => {
                const isReserved = reservedSeats.has(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    className={`seat ${isReserved ? "reserved" : ""} ${isSelected ? "selected" : ""}`}
                    disabled={isReserved}
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    aria-label={`${seat} ${isReserved ? "reserved" : isSelected ? "selected" : "available"}`}
                  >
                    {isSelected ? <Check size={15} /> : seat}
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="summary">
            <div>
              <span>{showtime}</span>
              <strong>{selectedSeats.length ? selectedSeats.join(", ") : "Choose seats"}</strong>
            </div>
            <div className="total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>
            <button className="primary-button" disabled={selectedSeats.length !== tickets}>
              Confirm booking
            </button>
          </footer>
        </section>
      </section>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
