# Retail Sales Management System - Architecture Documentation

- **Author:** Vidita Singh
- **Tech Stack:** React.js, Django REST Framework, PostgreSQL
- **Contact me:** viditasingh.sde@gmail.com
- **[Portfolio](https://viditasingh.me)**
---

## Table of Contents

1. [Overview](#overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow](#data-flow)
5. [Folder Structure](#folder-structure)
6. [Module Responsibilities](#module-responsibilities)

---

## Overview

This is a full-stack Retail Sales Management System that allows users to view, filter, search, and analyze sales transaction data. The application features a Django REST API backend connected to a PostgreSQL database, and a React.js frontend built with Vite for fast development and optimal performance.

Key Features:

- View paginated transaction records
- Multi-select filters (region, gender, category, payment method, tags)
- Range filters (age, date)
- Real-time search with optimized queries
- Summary statistics (total units, amount, discount)
- Cursor-based pagination for efficient data loading
- Sorting by various fields

---

## Backend Architecture

The backend is built using **Django REST Framework (DRF)** following a service-oriented architecture pattern.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Django Backend                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Views     │───▶│  Services   │───▶│   Models    │  │
│  │ (API Layer) │    │(Query Logic)│    │ (Database)  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                      │         │
│         ▼                                      ▼         │
│  ┌─────────────┐                      ┌─────────────┐   │
│  │ Serializers │                      │ PostgreSQL  │   │
│  │  (JSON)     │                      │  Database   │   │
│  └─────────────┘                      └─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint             | Method | Description                                         |
| -------------------- | ------ | --------------------------------------------------- |
| `/api/transactions/` | GET    | Fetch paginated transactions with filters           |
| `/api/stats/`        | GET    | Get aggregated statistics (units, amount, discount) |

### Key Components

1. **Views Layer** (`sales/views/`)

   - `transactions.py` - Handles transaction listing with pagination
   - `stats.py` - Computes and returns aggregated statistics

2. **Services Layer** (`sales/services/`)

   - `query_builder.py` - Central query building logic with filter handling

3. **Pagination** (`sales/pagination.py`)

   - Custom cursor-based pagination for efficient large dataset handling
   - Uses base64-encoded cursors with date + id for reliable ordering

4. **Models** (`sales/models.py`)
   - `Transaction` model with indexed fields for query optimization
   - ArrayField for tags (PostgreSQL-specific feature)
   - Database indexes on frequently queried columns

### Database Optimization

- **Indexed Fields:** customer_id, customer_name, date, quantity, gender, phone_number, customer_region, product_category, payment_method, age
- **GIN Indexes:** For array field (tags) overlap queries
- **Trigram Indexes:** For fast `icontains` text search on customer_name and phone_number

---

## Frontend Architecture

The frontend is built using **React.js with Vite** and follows a component-based architecture with custom hooks for data fetching.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │                    Pages                         │    │
│  │              (TransactionsPage)                  │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌──────────────────────┼──────────────────────────┐    │
│  │                 Components                       │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐  │    │
│  │  │ Layout  │ │ Filter  │ │ Trans.  │ │ Stats │  │    │
│  │  │         │ │  Panel  │ │  Table  │ │ Cards │  │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └───────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌──────────────────────┼──────────────────────────┐    │
│  │              Custom Hooks                        │    │
│  │     useTransactions()    useStats()              │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Services (API Layer)                │    │
│  │                   api.js                         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### State Management

- **URL-Based State:** All filter states are stored in URL search params using `useSearchParams` from React Router. This enables:

  - Shareable/bookmarkable URLs
  - Browser back/forward navigation
  - State persistence on refresh

- **Server State:** Managed by TanStack Query (React Query) for:
  - Automatic caching
  - Background refetching
  - Loading/error states

### Key Technologies

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| React 18       | UI Framework                    |
| Vite           | Build tool & dev server         |
| TanStack Query | Server state management         |
| React Router   | Client-side routing & URL state |
| TailwindCSS    | Utility-first styling           |
| Axios          | HTTP client                     |

---

## Data Flow

### Request Flow (Fetching Transactions)

```
┌──────────┐     ┌───────────────┐     ┌─────────────┐     ┌──────────────┐
│  User    │────▶│ URL Params    │────▶│ React Query │────▶│ Axios API    │
│ Actions  │     │ (filters)     │     │ (caching)   │     │ Request      │
└──────────┘     └───────────────┘     └─────────────┘     └──────────────┘
                                                                   │
                                                                   ▼
┌──────────┐     ┌───────────────┐     ┌─────────────┐     ┌──────────────┐
│  UI      │◀────│ Components    │◀────│ React Query │◀────│ Django API   │
│ Renders  │     │ (Table, etc)  │     │ Response    │     │ Response     │
└──────────┘     └───────────────┘     └─────────────┘     └──────────────┘
```

### Detailed Flow

1. **User Interaction:** User selects a filter (e.g., region = "East")
2. **URL Update:** Component updates URL search params via `setParams()`
3. **Query Trigger:** React Query detects URL change and triggers API call
4. **API Request:** Axios sends GET request to `/api/transactions/?region=East`
5. **Backend Processing:**
   - Views receive request
   - Query builder constructs filtered queryset
   - Pagination applied
   - Data serialized to JSON
6. **Response:** JSON response with `results`, `next`, `previous` cursors
7. **Cache Update:** React Query caches response
8. **Re-render:** Components receive new data and update UI

### Filter Processing (Backend)

```
Request Params → get_list_param() → Build Queryset → Apply Filters → Order → Paginate → Serialize → Response
```

Supported filters:

- **Multi-select:** region, gender, category, payment_method, tags
- **Range:** age_min/age_max, date_from/date_to
- **Search:** q (searches customer_name and phone_number)
- **Sort:** sort (date_desc, quantity, customer_name, etc.)

---

## Folder Structure

### Backend (`/backend`)

```
backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── README.md                 # Backend documentation
│
├── backend/                  # Django project settings
│   ├── __init__.py
│   ├── settings.py          # Project configuration
│   ├── urls.py              # Root URL configuration
│   ├── wsgi.py              # WSGI entry point
│   └── asgi.py              # ASGI entry point
│
└── sales/                    # Main Django app
    ├── admin.py             # Django admin configuration
    ├── apps.py              # App configuration
    ├── models.py            # Database models (Transaction)
    ├── serializers.py       # DRF serializers
    ├── pagination.py        # Custom cursor pagination
    ├── urls.py              # App URL routes
    ├── tests.py             # Unit tests
    │
    ├── views/               # API views
    │   ├── __init__.py
    │   ├── transactions.py  # Transaction list endpoint
    │   └── stats.py         # Statistics endpoint
    │
    ├── services/            # Business logic
    │   └── query_builder.py # Query construction & filtering
    │
    ├── management/          # Custom management commands
    │   └── commands/
    │       └── import_csv.py # CSV data import command
    │
    └── migrations/          # Database migrations
        ├── 0001_initial.py
        ├── 0002_add_search_and_gin_indexes.py
        └── 0003_add_trigram_indexes.py
```

### Frontend (`/frontend/frontend`)

```
frontend/frontend/
├── index.html               # HTML entry point
├── package.json             # Node dependencies
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
│
├── public/                  # Static assets
│
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Root component
    ├── App.css              # Global styles
    ├── index.css            # Tailwind imports
    ├── router.jsx           # React Router configuration
    │
    ├── assets/              # Images, icons, etc.
    │
    ├── components/          # Reusable UI components
    │   ├── Layout.jsx           # Page wrapper
    │   ├── SearchBar.jsx        # Search input
    │   ├── FilterBar.jsx        # Filter buttons & reset
    │   ├── FilterPanel.jsx      # Filter dropdown panel
    │   ├── MultiSelectDropdown.jsx  # Multi-select filter
    │   ├── RangeSlider.jsx      # Dual-thumb age slider
    │   ├── DateRangePicker.jsx  # Date range filter
    │   ├── Sorting.jsx          # Sort dropdown
    │   ├── SummaryCards.jsx     # Statistics cards
    │   ├── Transactions.jsx     # Data table
    │   ├── Pagination.jsx       # Page navigation
    │   └── Skeleton.jsx         # Loading placeholders
    │
    ├── hooks/               # Custom React hooks
    │   ├── useTransactions.js   # Fetch transactions
    │   └── useStats.js          # Fetch statistics
    │
    ├── pages/               # Page components
    │   └── TransactionsPage.jsx # Main transactions view
    │
    ├── services/            # API configuration
    │   └── api.js           # Axios instance
    │
    └── utils/               # Helper functions & constants
        └── constants.js     # Filter options, table headers
```

---

## Module Responsibilities

### Backend Modules

| Module               | File                                | Responsibility                                                                                                          |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Models**           | `models.py`                         | Define database schema for Transaction with all customer, product, and order fields                                     |
| **Serializers**      | `serializers.py`                    | Convert Transaction model instances to/from JSON                                                                        |
| **Query Builder**    | `services/query_builder.py`         | Build filtered querysets from request params, handle multi-select filters, search, date ranges, age ranges, and sorting |
| **Transaction View** | `views/transactions.py`             | Handle GET requests for transaction list, apply pagination                                                              |
| **Stats View**       | `views/stats.py`                    | Compute aggregated statistics (sum of quantity, amount, discount)                                                       |
| **Pagination**       | `pagination.py`                     | Custom cursor-based pagination with base64-encoded cursors for efficient navigation                                     |
| **Import Command**   | `management/commands/import_csv.py` | Load CSV data into database                                                                                             |

### Frontend Modules

| Module                  | File                                 | Responsibility                                                          |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| **API Service**         | `services/api.js`                    | Configure Axios instance with base URL                                  |
| **useTransactions**     | `hooks/useTransactions.js`           | Fetch transactions with React Query, auto-refetch on filter change      |
| **useStats**            | `hooks/useStats.js`                  | Fetch summary statistics with React Query                               |
| **TransactionsPage**    | `pages/TransactionsPage.jsx`         | Main page layout, compose all components                                |
| **Layout**              | `components/Layout.jsx`              | Page wrapper with consistent padding and styling                        |
| **SearchBar**           | `components/SearchBar.jsx`           | Text search with debouncing                                             |
| **FilterBar**           | `components/FilterBar.jsx`           | Filter toggle buttons and reset functionality                           |
| **FilterPanel**         | `components/FilterPanel.jsx`         | Dropdown panel containing all filter components                         |
| **MultiSelectDropdown** | `components/MultiSelectDropdown.jsx` | Reusable multi-select checkbox dropdown                                 |
| **RangeSlider**         | `components/RangeSlider.jsx`         | Custom dual-thumb slider for age range                                  |
| **DateRangePicker**     | `components/DateRangePicker.jsx`     | Date input fields for date range filtering                              |
| **Sorting**             | `components/Sorting.jsx`             | Sort dropdown with custom icons per sort type                           |
| **SummaryCards**        | `components/SummaryCards.jsx`        | Display total units, amount, and discount with Indian number formatting |
| **Transactions**        | `components/Transactions.jsx`        | Data table with phone number formatting and copy functionality          |
| **Pagination**          | `components/Pagination.jsx`          | Next/Previous navigation with cursor-based pagination                   |
| **Skeleton**            | `components/Skeleton.jsx`            | Loading state placeholder component                                     |

---

## Performance Optimizations

### Backend

- Database indexes on all filterable columns
- GIN indexes for array (tags) overlap queries
- Trigram indexes for fast `icontains` text search
- Cursor-based pagination (more efficient than offset for large datasets)
- Optimized search using `icontains` instead of full-text SearchVector

### Frontend

- React Query caching reduces redundant API calls
- URL-based state prevents unnecessary re-renders
- Debounced search input
- Lazy loading with pagination
- TailwindCSS for minimal CSS bundle size

---

_Document created by Vidita Singh | viditasingh.sde@gmail.com | [Portfolio](https://viditasingh.me)
