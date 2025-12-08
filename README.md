# Retail Sales Management System

A full-stack web application for viewing, filtering, searching, and analyzing retail sales transaction data.

**Developer:** Vidita Singh
**Email:** viditasingh.sde@gmail.com
**Portfolio:** [viditasingh.me](https://viditasingh.me)

---

## 🔗 Live Demo

> **[Live Link](https://truestate-frontend-dedp.onrender.com)**

---

## 📖 Overview

This project is a Retail Sales Management System that provides a modern, intuitive interface for managing and analyzing sales transactions. The application allows users to:

- **View Transactions** – Browse paginated sales records in a clean, responsive table
- **Search** – Quickly find customers by name or phone number with real-time search
- **Filter** – Apply multiple filters simultaneously (region, gender, category, payment method, tags, age range, date range)
- **Sort** – Order transactions by date, quantity, customer name, or product name
- **Analyze** – View summary statistics including total units sold, total amount, and total discount

The system features a React frontend with a Django REST API backend, connected to a PostgreSQL database optimized for fast queries on large datasets.

---

## 🛠️ Tech Stack

| Layer        | Technologies                                              |
| ------------ | --------------------------------------------------------- |
| **Frontend** | React 18, Vite, TailwindCSS, TanStack Query, React Router |
| **Backend**  | Django 5, Django REST Framework, Python 3.10+             |
| **Database** | PostgreSQL with pg_trgm extension                         |

---

## 📚 Documentation

For detailed technical documentation, please refer to:

- 📐 **[Architecture Documentation](./docs/architecture.md)** – System design, data flow diagrams, folder structure, and module responsibilities
- ⚙️ **[Backend README](./backend/README.md)** – API endpoints, search/filter/sort/pagination implementation, setup instructions
- 🎨 **[Frontend README](./frontend/frontend/README.md)** – Components, state management, UI implementation, setup instructions

---

## 🎓 What I Learned

### 1. Cursor-Based Pagination

This was my first time implementing cursor-based pagination, and it was a great learning experience. Unlike traditional offset pagination (`?page=5`), cursor pagination uses an encoded pointer to the last item fetched.

**Why it's better:**

- **Consistency** – No skipped or duplicate records when data changes between page loads
- **Performance** – O(1) lookup time regardless of page number (offset pagination gets slower on later pages)
- **Real-time friendly** – Works seamlessly with live data updates

**How I implemented it:**

- Encoded the `date` and `id` of the last record into a base64 cursor token
- Used compound filtering: `WHERE (date < cursor_date) OR (date = cursor_date AND id < cursor_id)`
- Added `-id` as a tie-breaker in ordering to ensure deterministic results

### 2. Search Optimization

Initially, I used PostgreSQL's full-text search with `SearchVector`, but it was slow for simple queries. I learned to optimize by:

- **Replacing SearchVector with `icontains`** – Much faster for partial matching on indexed columns
- **Adding trigram indexes** – Installed `pg_trgm` extension and created GIN indexes for fast `LIKE` queries
- **Preprocessing search input** – Stripping phone prefixes (`+91`) before querying
- **Conditional query logic** – Using phone-only search for numeric inputs, combined search for text

This reduced search response time from ~800ms to under 100ms.

---

## 🧗 Challenges Faced

### 1. Multi-Select Filters Not Working

**Problem:** When selecting multiple values in a filter (e.g., Region: East, West), only the last value was being applied.

**Root Cause:** Backend was using `params.get("region")` which returns only the last value, instead of `params.getlist("region")` which returns all values.

**Solution:** Created a `get_list_param()` helper function that handles both repeated params (`?region=East&region=West`) and comma-separated values (`?region=East,West`).

### 2. Dual-Thumb Range Slider

**Problem:** The age range slider's left thumb wasn't draggable – both thumbs would move together.

**Root Cause:** Two overlapping `<input type="range">` elements were interfering with each other's mouse events.

**Solution:** Implemented a custom mouse-based slider that:

- Tracks mouse position on the track element
- Calculates which thumb is closer to the click point
- Updates only that thumb's value during drag

### 3. Search with Phone Prefix

**Problem:** Searching for `+91 9952378294` returned no results even though the phone existed.

**Root Cause:** The database stored phones without the `+91` prefix, but users naturally type with it.

**Solution:** Added preprocessing to strip `+91` and `91` prefixes from search queries before matching.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/viditasingh/Retail-Sales-Management-System.git
cd Retail-Sales-Management-System

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py import_csv
python manage.py runserver

# Frontend setup (new terminal)
cd frontend/frontend
npm install
npm run dev
```

---

## 📸 Screenshots

![dashboard](https://i.ibb.co/h182R4JJ/image.png)

---

## 📄 License

This project was built as an assignment for TruEstate.

---

_Built with ❤️ by Vidita Singh | December 2025_
