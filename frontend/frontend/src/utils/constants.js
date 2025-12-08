export const TABLE_HEADERS = [
  "Transaction ID",
  "Date",
  "Customer ID",
  "Customer Name",
  "Phone Number",
  "Gender",
  "Age",
  "Product Category",
  "Quantity",
  "Total Amount",
  "Customer Region",
  "Product ID",
  "Employee Name",
];

export const SUMMARY_CARDS = [
  { key: "total_units", label: "Total Units Sold" },
  { key: "total_amount", label: "Total Amount" },
  { key: "total_discount", label: "Total Discount" },
];

export const FILTER_OPTIONS = {
  regions: ["East", "West", "North", "South"],
  genders: ["Male", "Female", "Other"],
  categories: ["Clothing", "Electronics", "Beauty"],
  tags: [
    "Sale",
    "Discount",
    "New Arrival",
    "Trending",
    "Popular",
    "Limited Stock",
  ],
  paymentMethods: ["UPI", "Credit Card", "Debit Card", "Cash", "Wallet"],
};

export const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "customer_name", label: "Customer Name (A–Z)" },
  { value: "date_desc", label: "Date (Newest First)" },
  { value: "product_name", label: "Product Name (A–Z)" },
  { value: "quantity", label: "Quantity ↓(low-high)" },
  { value: "quantity_desc", label: "Quantity ↑(high-low)" },
];
