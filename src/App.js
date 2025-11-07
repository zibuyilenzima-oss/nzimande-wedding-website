import React, { useState, useEffect, useCallback, } from "react";
import "./App.css";

// ===== CONFIG =====
const weddingDate = "25 April 2026";
const weddingTime = "09:00";
const weddingLocation = "6 Rushbrook Rd, Pinetown, KZN";
const mapEmbedURL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3460.7011672090903!2d30.873487575382843!3d-29.84404637502512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ef6ffc8f6a5f44b%3A0xeb55f943b0448aa9!2s6%20Rushbrook%20Rd%2C%20Moseley%20Park%2C%20Pinetown%2C%203610!5e0!3m2!1sen!2sza!4v1762197767652!5m2!1sen!2sza";

const googleSheetEndpoint = "YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL";

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  // === CAROUSEL ===
  const images = [
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // === COUNTDOWN LOGIC (warning-free) ===
const calculateTimeLeft = useCallback(() => {

  // Move the date INSIDE the callback
  const weddingDateTime = new Date("2026-04-25T09:00:00");

  const now = new Date();
  const difference = weddingDateTime - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}, []); // ✅ Empty dependencies (unchanged function)

const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);

  return () => clearInterval(timer);
}, [calculateTimeLeft]);

  // === RSVP ===
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    attending: "",
    guests: 1,
  });

  const [rsvpMessage, setRsvpMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRsvpData({ ...rsvpData, [name]: value });
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(googleSheetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvpData),
      });

      const result = await res.json();

      if (result.status === "success") {
        setRsvpMessage("RSVP received — thank you!");
        setRsvpData({ name: "", email: "", attending: "", guests: 1 });
      } else {
        setRsvpMessage("Something went wrong — please try again.");
      }
    } catch {
      setRsvpMessage("There was an error — please try again.");
    }
  };

  return (
    <div className="App">
      {/* === DROPDOWN NAVIGATION === */}
      <div className="menu-container">
        <button
          className="menu-button"
          onClick={() =>
            setCurrentTab((prev) => (prev === "menu" ? "" : "menu"))
          }
        >
          ☰
        </button>

        {currentTab === "menu" && (
          <div className="dropdown-menu">
            <p onClick={() => setCurrentTab("home")}>Home</p>
            <p onClick={() => setCurrentTab("story")}>Our Story</p>
            <p onClick={() => setCurrentTab("history")}>History</p>
            <p onClick={() => setCurrentTab("location")}>Location & Stay</p>
            <p onClick={() => setCurrentTab("registry")}>Gift Registry</p>
            <p onClick={() => setCurrentTab("rsvp")}>RSVP</p>
          </div>
        )}
      </div>

      {/* === HOME === */}
      {currentTab === "home" && (
        <div className="tab-content">
          <img src="/images/monogram.png" alt="monogram logo" className="home-logo" />

          <h1>Umabo noMbondo</h1>
          <h2 className="sub-heading">kaMlamuli noManchandi</h2>

          <h3 className="wedding-date">
            {weddingDate} | {weddingTime}
          </h3>
          <p className="wedding-location">{weddingLocation}</p>

          {/* === CAROUSEL === */}
          <div className="carousel">
            <button className="carousel-btn left" onClick={prevImage}>‹</button>

            <img
              key={currentImage}
              src={images[currentImage]}
              alt="Couple"
              className="carousel-image fade"
            />

            <button className="carousel-btn right" onClick={nextImage}>›</button>

            <div className="carousel-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentImage ? "active" : ""}`}
                  onClick={() => setCurrentImage(index)}
                ></span>
              ))}
            </div>
          </div>

          {/* === COUNTDOWN === */}
          <div className="countdown">
            <h3>Countdown to the Celebration</h3>
            <div className="count-box">
              <div><span>{timeLeft.days}</span><p>Days</p></div>
              <div><span>{timeLeft.hours}</span><p>Hours</p></div>
              <div><span>{timeLeft.minutes}</span><p>Minutes</p></div>
              <div><span>{timeLeft.seconds}</span><p>Seconds</p></div>
            </div>
          </div>
        </div>
      )}

      {/* === STORY === */}
      {currentTab === "story" && (
        <div className="tab-content">
          <h2>Our Story</h2>
          <p>
            Mlamuli and Manchandi met in 2020 and built a bond rooted in love,
            laughter, and family. Every season since has deepened their
            gratitude for the path that brought them together.
          </p>

          <div className="fun-questions">
            <h2>Fun Questions About the Couple</h2>

            {[
              { q: "Who said 'I love you' first?", a: "Mlamuli beat Manchandi to it by one day!" },
              { q: "Where did they first meet?", a: "At a friend’s birthday — a night neither expected would change their lives." },
              { q: "Who is more likely to be late?", a: "Manchandi swears it’s Mlamuli… but evidence suggests otherwise." },
              { q: "What’s their favorite meal to cook together?", a: "A hearty beef stew and dumplings." },
              { q: "Who made the first move?", a: "Mlamuli. Confidently so." },
              { q: "What song reminds them of each other?", a: "Ndiyahamba by Zahara." },
              { q: "Silliest argument?", a: "Whether pineapple belongs on pizza." },
              { q: "Better dancer?", a: "Depends on who you ask." },
              { q: "First trip together?", a: "A road trip to the Midlands." },
              { q: "What does 'home' mean?", a: "Anywhere they’re together." },
            ].map((item, index) => (
              <div
                key={index}
                className="question-card"
                onClick={(e) => e.currentTarget.classList.toggle("open")}
              >
                <p className="question">{item.q}</p>
                <p className="answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === HISTORY === */}
      {currentTab === "history" && (
        <div className="tab-content">
          <h2>uMabo noMbondo Explained</h2>
          <p>
            Umabo 
and Umbondo mark the heart of a 
marriage. moments when two families 
honour one another through gifts and celebration. They are expressions of belonging and the strength of shared heritage.
< br/> Umbondo is led by the bride’s family as a gesture of gratitude and goodwill. They bring gifts (often blankets, food, and household items) to the groom’s family to express respect and appreciation. It is a heartfelt way of saying, < br/> “We send our daughter with love and open hands.”
< br/> Umabo follows as the groom’s family welcomes the bride into her new home. The day is filled with song, dance, and the giving of gifts that honour her arrival and celebrate the unity of the two families. 
< br/> < br/> Together, these ceremonies remind us that
marriage, in Zulu culture, is not
only about two individuals
but about families joined in
respect, care, and shared heritage.
< br/> It would bring us great joy to have you with us as we honour these customs.
          </p>
        </div>
      )}

      {/* === LOCATION === */}
      {currentTab === "location" && (
        <div className="tab-content">
          <h2>TRAVEL & ACCOM</h2>

          <p>
            As our celebration will be held in the heart of KwaZulu-Natal, we understand that many of you will be travelling from afar. To make the journey easier, we have provided the following travel recommendations:
          </p>

          <h3 className="sub-section">Location</h3>

          <iframe
            title="Wedding Location Map"
            src={mapEmbedURL}
            width="100%"
            height="350"
            style={{ border: 0, marginTop: "20px", borderRadius: "15px" }}
            loading="lazy"
          ></iframe>

       <h3 className="sub-section">Travel</h3>

<p>
  For those flying in, the nearest airport is King Shaka International Airport (DUR).
  Ride-share services such as Uber are readily available, or you may prefer to rent a vehicle.
</p>

<ul>
  <li>
    <a
      href="https://www.avis.co.za/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Avis Car Rental
    </a>
  </li>

  <li>
    <a
      href="https://www.budget.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Budget Car Rental
    </a>
  </li>

  <li>
    <a
      href="https://www.hertz.co.za/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Hertz South Africa
    </a>
  </li>
</ul>


{/* === ACCOMMODATION SECTION === */}
<h3 className="sub-section">Accommodation</h3>

<p>
  For our guests travelling from Gauteng, Limpopo, and beyond, we’ve curated
      a few nearby accommodation options that range from boutique guesthouses to
      seaside hotels. Each of these is within comfortable distance from the
      venue and offers easy access to local restaurants and attractions.
</p>

<ul>
  <li>
    <a
      href="https://booking.com/mywishlist.html?wl=b48eca4eae8d4701878ade6091fbe0ba"
      target="_blank"
      rel="noopener noreferrer"
    >
      Pinetown Accommodation - Booking.com
    </a>
  </li>

  <li>
    <a
      href="https://booking.com/mywishlist.html?wl=e10027988b4c4bd5acb1328d1ccf95ee"
      target="_blank"
      rel="noopener noreferrer"
    >
      Westville Accommodation - Booking.com
    </a>
  </li>

  <li>
    <a
      href="https://booking.com/mywishlist.html?wl=18e4ef72acdc429ca82207b310be11a1"
      target="_blank"
      rel="noopener noreferrer"
    >
      Kloof Accommodation - Booking.com
    </a>
  </li>

  <li>
    <a
      href="https://www.airbnb.com/wishlists/invite/b288af21-cb3f-4449-8fe7-ae944a4a8b65?s=67&unique_share_id=951123e7-731c-4d33-8dc8-e47bce2aa7ba"
      target="_blank"
      rel="noopener noreferrer"
    >
      Pinetown - Airbnb
    </a>
  </li>

  <li>
    <a
      href="https://www.airbnb.com/wishlists/invite/5ec31d8e-7481-423a-8a01-8d47684637e1?s=67&unique_share_id=e27c48dc-5856-407e-99c8-1db61dbe2466"
      target="_blank"
      rel="noopener noreferrer"
    >
      Westville - Airbnb
    </a>
  </li>

   <li>
    <a
      href="https://www.airbnb.com/wishlists/invite/cc06ad0e-3ca5-4728-9134-3f8db68edd5d?s=67&unique_share_id=fdfb939d-9cd8-4056-ab8d-44e216ed9f41"
      target="_blank"
      rel="noopener noreferrer"
    >
      Hillcrest - Airbnb
    </a>
  </li>
</ul>
<p>
  Guests are also welcome to look at accommodation in Umhlanga, Ballito, Durban etc. 
  but are cautioned that these areas are slightly further away from Pinetown.
</p>
        </div>
      )}

      {/* === REGISTRY === */}
      {currentTab === "registry" && (
  <div className="tab-content">
    <h2>Mlamuli & Manchandi – Home Registry</h2>

    <p className="registry-intro">
      In our culture, a new home is shaped by more than the couple who lives in it.
      It is strengthened by the hands, prayers, and generosity of the community
      that surrounds them. Your presence at our celebration is already a blessing.
      If you feel moved to honour our home as we begin this chapter, we have
      curated a small selection of items chosen with intention — pieces that will
      help us build a space filled with warmth, peace, and love.
    </p>

    <button
      className="registry-btn"
      onClick={() => window.open("YOUR_TAKEALOT_LIST_URL_HERE", "_blank", "noopener,noreferrer")}
    >
      View Our Home Registry
    </button>

    <p className="registry-footer">
      Every contribution is received with deep gratitude. 
      May the favour you extend toward our home return to yours in abundance.
    </p>
  </div>
)}


      {/* === RSVP === */}
      {currentTab === "rsvp" && (
        <div className="tab-content">
          <h2>RSVP</h2>

          <form onSubmit={handleRsvpSubmit}>
            <label>
              Full Name <br />
              <input
                type="text"
                name="name"
                value={rsvpData.name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Email <br />
              <input
                type="email"
                name="email"
                value={rsvpData.email}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Attending? <br />
              <select
                name="attending"
                value={rsvpData.attending}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            <label>
              Number of Guests <br />
              <input
                type="number"
                name="guests"
                min="1"
                max="5"
                value={rsvpData.guests}
                onChange={handleInputChange}
              />
            </label>

            <button type="submit">Submit RSVP</button>
          </form>

          {rsvpMessage && <p>{rsvpMessage}</p>}
        </div>
      )}

      <footer className="site-footer">
      <div className="footer-divider"></div>
  <p>M | M</p>
</footer>

    </div>
  );
}

export default App;
