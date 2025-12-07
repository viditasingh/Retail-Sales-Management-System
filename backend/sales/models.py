from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Transaction(models.Model):
    # Customer fields
    customer_id = models.CharField(max_length=128, db_index=True)
    customer_name = models.CharField(max_length=255, db_index=True)
    customer_type = models.CharField(max_length=128, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True, db_index=True)
    gender = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    phone_number = models.CharField(max_length=50, db_index=True, null=True, blank=True)
    customer_region = models.CharField(max_length=128, null=True, blank=True, db_index=True)

    # Sales fields
    quantity = models.IntegerField(null=True, blank=True, db_index=True)
    price_per_unit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Product fields
    product_id = models.CharField(max_length=128, null=True, blank=True)
    product_name = models.CharField(max_length=255, null=True, blank=True)
    product_category = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    brand = models.CharField(max_length=128, null=True, blank=True)
    tags = ArrayField(models.CharField(max_length=64), default=list, blank=True)

    # Order details
    date = models.DateTimeField(null=True, blank=True, db_index=True)
    payment_method = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    order_status = models.CharField(max_length=128, null=True, blank=True)
    delivery_type = models.CharField(max_length=128, null=True, blank=True)

    # Store details
    store_id = models.CharField(max_length=128, null=True, blank=True)
    store_location = models.CharField(max_length=255, null=True, blank=True)
    salesperson_id = models.CharField(max_length=128, null=True, blank=True)
    employee_name = models.CharField(max_length=255, null=True, blank=True)

    search_vector = models.TextField(null=True, blank=True, editable=False)

    class Meta:
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['quantity']),
            models.Index(fields=['customer_name']),
        ]
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.customer_name} - {self.date}"
