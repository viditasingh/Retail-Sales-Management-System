from django.db import models
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.utils.dateparse import parse_datetime
from dateutil.parser import parse

from sales.models import Transaction


def build_transactions_queryset(params):
    qs = Transaction.objects.all()

    # multiple filters selection

    # payment methods
    payment_method = params.get("payment_method")
    if payment_method:
        qs = qs.filter(payment_method__in=[p.strip() for p in payment_method.split(",")])

    # product category
    category = params.get("category")
    if category:
        qs = qs.filter(product_category__in=[c.strip() for c in category.split(",")])

    # region
    region = params.get("region")
    if region:
        qs = qs.filter(customer_region__in=[r.strip() for r in region.split(",")])

    # gender
    gender = params.get("gender")
    if gender:
        qs = qs.filter(gender__in=[g.strip() for g in gender.split(",")])

    # tags : when any of the tags are matched, the data is shown
    tags = params.get("tags")
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        qs = qs.filter(tags__overlap=tag_list)


    # text search
    q = params.get("q")
    if q:
        vector = (
            SearchVector("customer_name", weight="A") +
            SearchVector("phone_number", weight="B")
        )

        query = SearchQuery(q, search_type="plain")

        qs = qs.annotate(rank=SearchRank(vector, query)).filter(rank__gte=0.1).order_by("-rank", "-date", "-id")


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

    if age_max:
        qs = qs.filter(age__lte=int(age_max))
    if age_min:
        qs = qs.filter(age__gte=int(age_min))


    # sorting

    sort = params.get("sort", "date_desc")

    sort_map = {
        "date_desc": "-date",
        "quantity": "quantity",
        "customer_name": "customer_name",
    }

    order = sort_map.get(sort, "-date")

    # tie break by id
    qs = qs.order_by(order, "-id")
    return qs