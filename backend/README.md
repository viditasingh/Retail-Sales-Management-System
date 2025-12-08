# Backend - Retail Sales Management System

**Author:** Vidita Singh

---

## 1. Overview

This is the backend API for the Retail Sales Management System built with Django REST Framework. It provides RESTful endpoints for fetching, filtering, searching, and paginating sales transaction data. The API is optimized for handling large datasets with efficient database indexing and cursor-based pagination. It connects to a PostgreSQL database and serves data to the React frontend.

---

## 2. Tech Stack

| Technology            | Version | Purpose                                |
| --------------------- | ------- | -------------------------------------- |
| Python                | 3.10+   | Programming language                   |
| Django                | 5.x     | Web framework                          |
| Django REST Framework | 3.x     | API development                        |
| PostgreSQL            | 14+     | Database with advanced features        |
| pg_trgm               | -       | Trigram extension for fast text search |
| python-dateutil       | -       | Date parsing utilities                 |

---

## 3. Search Implementation Summary

**File:** `sales/services/query_builder.py`

The search functionality uses PostgreSQL's `icontains` for fast, case-insensitive partial matching.

**How it works:**

- User's search query is received via `?q=` parameter
- Phone number prefixes (`+91`, `91`) are automatically stripped for cleaner matching
- Numeric queries (4+ digits) search only the `phone_number` field
- Text queries search both `customer_name` and `phone_number` using OR logic

**Optimization:**

- Trigram GIN indexes on `customer_name` and `phone_number` fields (migration `0003`)
- Uses simple `icontains` instead of heavy `SearchVector` for better performance

```python
# Phone search
qs = qs.filter(phone_number__icontains=cleaned_term)

# Name search
qs = qs.filter(Q(customer_name__icontains=term) | Q(phone_number__icontains=term))
```

---

## 4. Filter Implementation Summary

**File:** `sales/services/query_builder.py`

The API supports multiple filter types with AND logic between different filters.

### Multi-Select Filters

Handled via `get_list_param()` helper that supports both:

- Repeated params: `?region=East&region=West`
- Comma-separated: `?region=East,West`

| Filter         | Parameter        | Query                        |
| -------------- | ---------------- | ---------------------------- |
| Region         | `region`         | `customer_region__in`        |
| Gender         | `gender`         | `gender__in`                 |
| Category       | `category`       | `product_category__in`       |
| Payment Method | `payment_method` | `payment_method__in`         |
| Tags           | `tags`           | `tags__overlap` (ArrayField) |

### Range Filters

| Filter     | Parameters             | Query                    |
| ---------- | ---------------------- | ------------------------ |
| Date Range | `date_from`, `date_to` | `date__gte`, `date__lte` |
| Age Range  | `age_min`, `age_max`   | `age__gte`, `age__lte`   |

**Note:** Age range automatically swaps values if min > max to handle invalid input.

---

## 5. Sorting Implementation Summary

**File:** `sales/services/query_builder.py`

Sorting is controlled via the `?sort=` parameter with predefined options.

| Sort Value            | Order By        | Description  |
| --------------------- | --------------- | ------------ |
| `date_desc` (default) | `-date`         | Newest first |
| `quantity`            | `quantity`      | Low to high  |
| `quantity_desc`       | `-quantity`     | High to low  |
| `customer_name`       | `customer_name` | A to Z       |
| `product_name`        | `product_name`  | A to Z       |

**Tie-breaking:** All sorts include `-id` as secondary ordering to ensure consistent pagination.

```python
sort_map = {
    "date_desc": "-date",
    "quantity": "quantity",
    "quantity_desc": "-quantity",
    "customer_name": "customer_name",
    "product_name": "product_name",
}
qs = qs.order_by(order, "-id")  # Tie-break by id
```

---

## 6. Pagination Implementation Summary

**File:** `sales/pagination.py`

The API uses **cursor-based pagination** instead of offset pagination for better performance on large datasets.

**How it works:**

1. Each page returns 10 records (configurable via `PAGE_SIZE`)
2. Response includes `next` and `previous` cursor URLs
3. Cursor encodes `date` + `id` as base64 JSON
4. Next page query filters: `WHERE (date < cursor_date) OR (date = cursor_date AND id < cursor_id)`

**Why cursor pagination?**

- Consistent results even when data changes
- O(1) performance regardless of page number
- No "skipped rows" problem with offset

**Cursor Format:**

```python
# Encoding
payload = {"d": date_iso, "i": id}
cursor = base64.urlsafe_b64encode(json.dumps(payload))

# Decoding
obj = json.loads(base64.urlsafe_b64decode(cursor))
```

---

## 7. Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 14+ with `pg_trgm` extension
- pip (Python package manager)

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure database
# Update backend/settings.py with your PostgreSQL credentials:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'your_db_name',
#         'USER': 'your_username',
#         'PASSWORD': 'your_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# 6. Enable trigram extension in PostgreSQL
psql -U your_username -d your_db_name -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# 7. Run migrations
python manage.py migrate

# 8. Import CSV data (place truestate_assignment_dataset.csv in project root)
python manage.py import_csv

# 9. Start development server
python manage.py runserver
```

### API Endpoints

| Endpoint                                  | Method | Description                  |
| ----------------------------------------- | ------ | ---------------------------- |
| `http://127.0.0.1:8000/api/transactions/` | GET    | Fetch paginated transactions |
| `http://127.0.0.1:8000/api/stats/`        | GET    | Fetch aggregated statistics  |

### Example API Call

```bash
# Fetch transactions with filters
curl "http://127.0.0.1:8000/api/transactions/?region=East&gender=Male&sort=date_desc"

# Fetch stats
curl "http://127.0.0.1:8000/api/stats/?category=Electronics"
```

---

_Documentation by Vidita Singh | December 2025_
