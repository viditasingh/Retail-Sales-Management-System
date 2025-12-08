from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from sales.services.query_builder import build_transactions_queryset

@api_view(["GET"])
def stats_view(request):
    qs = build_transactions_queryset(request.query_params)

    total_units = qs.aggregate(total_units=Sum("quantity"))["total_units"] or 0
    total_amount = qs.aggregate(total_amount=Sum("final_amount"))["total_amount"] or 0

    total_before_discount = qs.aggregate(sum_before=Sum("total_amount"))["sum_before"] or 0
    total_discount = total_before_discount - total_amount

    return Response({
        "total_units": total_units,
        "total_amount": total_amount,
        "total_discount": total_discount
    })
