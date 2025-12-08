from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0002_add_search_and_gin_indexes'),
    ]

    operations = [
        # GIN trigram index on customer_name for fast icontains
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS sales_transaction_customer_name_trgm_idx
            ON sales_transaction
            USING GIN (customer_name gin_trgm_ops);
            """,
            reverse_sql="DROP INDEX IF EXISTS sales_transaction_customer_name_trgm_idx;"
        ),

        # GIN trigram index on phone_number for fast icontains
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS sales_transaction_phone_number_trgm_idx
            ON sales_transaction
            USING GIN (phone_number gin_trgm_ops);
            """,
            reverse_sql="DROP INDEX IF EXISTS sales_transaction_phone_number_trgm_idx;"
        ),
    ]
