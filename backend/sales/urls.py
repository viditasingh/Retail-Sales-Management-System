from django.urls import path
from sales.views.stats import stats_view
from sales.views.transactions import TransactionListAPIView

urlpatterns = [
    path("transactions/", TransactionListAPIView.as_view(), name="transactions"),
    path("stats/", stats_view, name="stats"),
]
