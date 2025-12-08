from django.db import models
from django.db.models import Q
from django.db.models.functions import Concat
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.utils.dateparse import parse_datetime
from dateutil.parser import parse

from sales.models import Transaction


def get_list_param(params, key):
    """Get a list of values from query params, handling both comma-separated and repeated params"""
    # Try getlist first (for repeated params like ?region=East&region=West)
    if hasattr(params, 'getlist'):
        values = params.getlist(key)
        if values:
            # Flatten any comma-separated values within the list
            result = []
            for v in values:
                result.extend([x.strip() for x in v.split(",")])
            return result

    # Fallback to get (for single value or comma-separated)
    value = params.get(key)
    if value:
        return [v.strip() for v in value.split(",")]

    return []


def build_transactions_queryset(params):
    qs = Transaction.objects.all()

    # multiple filters selection

    # payment methods
    payment_methods = get_list_param(params, "payment_method")
    if payment_methods:
        qs = qs.filter(payment_method__in=payment_methods)

    # product category
    categories = get_list_param(params, "category")
    if categories:
        qs = qs.filter(product_category__in=categories)

    # region
    regions = get_list_param(params, "region")
    if regions:
        qs = qs.filter(customer_region__in=regions)

    # gender
    genders = get_list_param(params, "gender")
    if genders:
        qs = qs.filter(gender__in=genders)

    # tags : when any of the tags are matched, the data is shown
    tags = get_list_param(params, "tags")
    if tags:
        qs = qs.filter(tags__overlap=tags)


    # text search
    q = params.get("q")
    if q:
        # Clean up phone number searches - remove +91, spaces, and common prefixes
        search_term = q.strip()
        if search_term.startswith("+91"):
            search_term = search_term[3:].strip()
        elif search_term.startswith("91") and len(search_term) > 10:
            search_term = search_term[2:].strip()
        # Remove any remaining spaces or dashes from phone-like queries
        cleaned_term = search_term.replace(" ", "").replace("-", "")

        # Use simple icontains for phone number searches (much faster)
        if cleaned_term.isdigit() and len(cleaned_term) >= 4:
            qs = qs.filter(phone_number__icontains=cleaned_term)
        else:
            # Use icontains for name search (faster than full-text for simple queries)
            qs = qs.filter(
                Q(customer_name__icontains=search_term) |
                Q(phone_number__icontains=search_term)
            )


    # range filter

    # date range
    date_from = params.get("date_from")
    date_to = params.get("date_to")

    if date_from:
        qs = qs.filter(date__gte=parse(date_from))
    if date_to:
        qs = qs.filter(date__lte=parse(date_to))

    # age range
    age_max = params.get("age_max")
    age_min = params.get("age_min")
    if age_min and age_max and int(age_min) > int(age_max):
        age_min, age_max = age_max, age_min

    if age_max:
        qs = qs.filter(age__lte=int(age_max))
    if age_min:
        qs = qs.filter(age__gte=int(age_min))


    # sorting

    sort = params.get("sort", "date_desc")

    sort_map = {
        "date_desc": "-date",
        "quantity": "quantity",
        "quantity_desc": "-quantity",
        "customer_name": "customer_name",
        "product_name": "product_name",
    }

    order = sort_map.get(sort, "-date")

    # tie break by id
    qs = qs.order_by(order, "-id")
    return qs