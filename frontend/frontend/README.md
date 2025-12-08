# Frontend - Retail Sales Management System

**Author:** Vidita Singh

---

## 1. Overview

This is the frontend for the Retail Sales Management System built with React and Vite. It provides a modern, responsive UI for viewing and managing sales transactions with advanced filtering, searching, and sorting capabilities. The application uses URL-based state management for shareable/bookmarkable filter configurations and TanStack Query for efficient server state management with automatic caching.

---

## 2. Tech Stack

| Technology     | Version | Purpose                           |
| -------------- | ------- | --------------------------------- |
| React          | 18.x    | UI framework                      |
| Vite           | 5.x     | Build tool & dev server           |
| TanStack Query | 5.x     | Server state management & caching |
| React Router   | 6.x     | Client-side routing & URL state   |
| TailwindCSS    | 4.x     | Utility-first CSS styling         |
| Axios          | 1.x     | HTTP client for API calls         |
| Inter Font     | -       | Modern, clean typography          |

---

## 3. Search Implementation Summary

**File:** `src/components/SearchBar.jsx`

The search bar provides real-time search with debouncing for optimal performance.

**How it works:**

1. User types in the search input
2. 300ms debounce delay prevents excessive API calls
3. Search term is stored in URL params as `?q=`
4. React Query automatically refetches when URL changes
5. Pagination cursor is reset on new search

**Key Features:**

- Debounced input (300ms delay)
- URL-persisted state (shareable links)
- Searches customer name and phone number
- Supports phone numbers with +91 prefix

```jsx
useEffect(() => {
  const delay = setTimeout(() => {
    const newParams = new URLSearchParams(params);
    if (value.trim() !== "") newParams.set("q", value.trim());
    else newParams.delete("q");
    newParams.delete("cursor");
    setParams(newParams);
  }, 300);
  return () => clearTimeout(delay);
}, [value]);
```

---

## 4. Filter Implementation Summary

**Files:** `src/components/FilterBar.jsx`, `src/components/MultiSelectDropdown.jsx`, `src/components/RangeSlider.jsx`, `src/components/DateRangePicker.jsx`

All filters use URL search params for state, making filter configurations shareable and bookmarkable.

### Multi-Select Filters

| Filter         | Component           | URL Param        |
| -------------- | ------------------- | ---------------- |
| Region         | MultiSelectDropdown | `region`         |
| Gender         | MultiSelectDropdown | `gender`         |
| Category       | MultiSelectDropdown | `category`       |
| Payment Method | MultiSelectDropdown | `payment_method` |
| Tags           | MultiSelectDropdown | `tags`           |

**Implementation:**

- Checkbox-based selection in dropdown
- Multiple values appended as repeated params: `?region=East&region=West`
- Displays all selected values comma-separated
- Click-outside-to-close functionality

### Range Filters

| Filter     | Component       | URL Params             |
| ---------- | --------------- | ---------------------- |
| Age Range  | RangeSlider     | `age_min`, `age_max`   |
| Date Range | DateRangePicker | `date_from`, `date_to` |

**RangeSlider Features:**

- Custom dual-thumb slider implementation
- Mouse-based dragging for precise control
- Visual track fill between thumbs
- Range: 18-100 years

### Reset Functionality

- "Reset Filters" button clears all filter params
- Preserves only the base URL

---

## 5. Sorting Implementation Summary

**File:** `src/components/Sorting.jsx`

Custom dropdown component for sorting transactions.

**Available Sort Options:**

| Label               | URL Value       | Description          |
| ------------------- | --------------- | -------------------- |
| Default             | (empty)         | Newest first by date |
| Customer Name (A–Z) | `customer_name` | Alphabetical         |
| Date (Newest First) | `date_desc`     | Most recent          |
| Product Name (A–Z)  | `product_name`  | Alphabetical         |
| Quantity (low-high) | `quantity`      | Ascending            |
| Quantity (high-low) | `quantity_desc` | Descending           |

**Features:**

- Custom styled dropdown matching filter UI
- Dynamic icon per sort type (calendar, A-Z, arrows)
- Checkmark indicator for selected option
- Click-outside-to-close
- Fixed width (260px) for consistent layout

---

## 6. Pagination Implementation Summary

**File:** `src/components/Pagination.jsx`

The frontend implements cursor-based pagination that works with the backend's cursor system.

**How it works:**

1. Backend returns `next` and `previous` URLs with cursor tokens
2. Frontend extracts cursor from URL: `?cursor=eyJkIjoi...`
3. On click, cursor is added to current URL params
4. React Query fetches new page with cursor
5. All filters are preserved during navigation

**Features:**

- Previous/Next navigation buttons
- Disabled state when no more pages
- Visual page indicator dots
- Preserves all active filters

```jsx
const goToPage = (url) => {
  const cursor = new URL(url).searchParams.get("cursor");
  const newParams = new URLSearchParams(params);
  newParams.set("cursor", cursor);
  setParams(newParams);
};
```

**Why Cursor Pagination:**

- Handles real-time data changes gracefully
- No duplicate or skipped records
- Efficient for large datasets

---

## 7. Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://127.0.0.1:8000`

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Default: http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
```

To change the API URL for production, update this file or use environment variables.

### Project Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview production build locally  |
| `npm run lint`    | Run ESLint                        |

---

_Documentation by Vidita Singh | December 2025_
