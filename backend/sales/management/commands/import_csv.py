import csv
from django.core.management.base import BaseCommand
from sales.models import Transaction
from dateutil.parser import parse

BATCH_SIZE = 1000

class Command(BaseCommand):
    help = "Import sales CSV file into Transaction table"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Path to the CSV file")

    def handle(self, *args, **options):
        csv_path = options["csv_path"]

        self.stdout.write(self.style.WARNING(f"Importing from: {csv_path}"))

        batch = []
        total = 0

        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:
                obj = Transaction(
                    customer_id=row.get("Customer ID"),
                    customer_name=row.get("Customer Name"),
                    customer_type=row.get("Customer Type"),
                    age=int(row["Age"]) if row.get("Age") else None,
                    gender=row.get("Gender"),
                    phone_number=row.get("Phone Number"),
                    customer_region=row.get("Customer Region"),

                    quantity=int(row["Quantity"]) if row.get("Quantity") else None,
                    price_per_unit=row.get("Price per Unit") or None,
                    discount_percentage=row.get("Discount Percentage") or None,
                    total_amount=row.get("Total Amount") or None,
                    final_amount=row.get("Final Amount") or None,

                    product_id=row.get("Product ID"),
                    product_name=row.get("Product Name"),
                    product_category=row.get("Product Category"),
                    brand=row.get("Brand"),

                    tags=[t.strip() for t in row.get("Tags", "").split(",") if t.strip()],

                    date=parse(row["Date"]) if row.get("Date") else None,
                    payment_method=row.get("Payment Method"),
                    order_status=row.get("Order Status"),
                    delivery_type=row.get("Delivery Type"),

                    store_id=row.get("Store ID"),
                    store_location=row.get("Store Location"),
                    salesperson_id=row.get("Salesperson ID"),
                    employee_name=row.get("Employee Name"),
                )

                batch.append(obj)

                if len(batch) >= BATCH_SIZE:
                    Transaction.objects.bulk_create(batch)
                    total += len(batch)
                    self.stdout.write(f"Inserted {total}")
                    batch = []

            if batch:
                Transaction.objects.bulk_create(batch)
                total += len(batch)

        self.stdout.write(self.style.SUCCESS(f"Import complete. Total rows inserted: {total}"))
