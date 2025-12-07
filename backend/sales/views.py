from rest_framework.views import APIView
from rest_framework.response import Response

from sales.services.query_builder import build_transactions_queryset
from sales.pagination import CustomCursorPagination
from sales.serializers import TransactionSerializer


class TransactionListAPIView(APIView):

    def get(self, request):
        qs = build_transactions_queryset(request.query_params)

        paginator = CustomCursorPagination()
        page = paginator.paginate_queryset(qs, request)

        serializer = TransactionSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)
