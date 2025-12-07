import base64
import json
from urllib.parse import urlencode

from rest_framework.pagination import BasePagination
from rest_framework.response import Response
from django.db import models
from dateutil.parser import parse


PAGE_SIZE = 10


def encode_cursor(date_iso, id):
    payload = {"d": date_iso, "i": id}
    b = json.dumps(payload).encode()
    return base64.urlsafe_b64encode(b).decode()


def decode_cursor(cursor):
    try:
        b = base64.urlsafe_b64decode(cursor.encode())
        obj = json.loads(b.decode())
        return obj.get("d"), obj.get("i")
    except Exception:
        return None, None


class CustomCursorPagination(BasePagination):
    page_size = PAGE_SIZE

    def paginate_queryset(self, queryset, request, view=None):
        self.request = request
        cursor = request.query_params.get("cursor")

        if cursor:
            date_iso, last_id = decode_cursor(cursor)
            if date_iso:
                last_date = parse(date_iso)

                queryset = queryset.filter(
                    models.Q(date__lt=last_date)
                    | (models.Q(date=last_date) & models.Q(id__lt=last_id))
                )

        self.queryset = queryset

        self.page = list(queryset[: self.page_size])

        return self.page

    def get_paginated_response(self, data):
        if not data:
            return Response({
                "results": [],
                "next": None,
                "previous": None,
            })

        first = data[0]
        first_date = first["date"] if isinstance(first["date"], str) else first["date"].isoformat()
        prev_cursor = encode_cursor(first_date, first["id"])

        last = data[-1]
        last_date = last["date"] if isinstance(last["date"], str) else last["date"].isoformat()
        next_cursor = encode_cursor(last_date, last["id"])

        base_params = self.request.query_params.copy()

        base_params["cursor"] = prev_cursor
        prev_url = f"{self.request.path}?{urlencode(base_params)}"

        base_params["cursor"] = next_cursor
        next_url = f"{self.request.path}?{urlencode(base_params)}"

        return Response({
            "results": data,
            "next": next_url,
            "previous": prev_url,
        })
