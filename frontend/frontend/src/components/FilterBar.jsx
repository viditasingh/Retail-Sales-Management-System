import { useSearchParams } from "react-router";
import { FILTER_OPTIONS } from "../utils/constants";
import MultiSelectDropdown from "./MultiSelectDropdown";
import RangeSlider from "./RangeSlider";
import DateRangePicker from "./DateRangePicker";

export default function FilterBar() {
  const [params, setParams] = useSearchParams();

  // Update multi-select filters
  const updateMultiSelect = (key, values) => {
    const newParams = new URLSearchParams(params);
    newParams.delete(key);
    values.forEach((v) => newParams.append(key, v));
    newParams.delete("cursor");
    setParams(newParams);
  };

  // Update single value filters
  const updateSingleValue = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete("cursor");
    setParams(newParams);
  };

  const hasActiveFilters = () => {
    return (
      params.getAll("region").length > 0 ||
      params.getAll("gender").length > 0 ||
      params.getAll("category").length > 0 ||
      params.getAll("tags").length > 0 ||
      params.getAll("payment_method").length > 0 ||
      params.get("age_min") ||
      params.get("age_max") ||
      params.get("date_from") ||
      params.get("date_to")
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Reset Button */}
      <button
        onClick={() => {
          const newParams = new URLSearchParams();
          if (params.get("q")) newParams.set("q", params.get("q"));
          if (params.get("sort")) newParams.set("sort", params.get("sort"));
          setParams(newParams);
        }}
        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm group"
        title="Reset Filters"
      >
        <svg
          className="w-4 h-4 text-gray-500 group-hover:text-gray-700 group-hover:rotate-180 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Customer Region - Multi-select */}
      <MultiSelectDropdown
        label="Customer Region"
        options={FILTER_OPTIONS.regions}
        selectedValues={params.getAll("region")}
        onChange={updateMultiSelect}
        paramKey="region"
      />

      {/* Gender - Multi-select */}
      <MultiSelectDropdown
        label="Gender"
        options={FILTER_OPTIONS.genders}
        selectedValues={params.getAll("gender")}
        onChange={updateMultiSelect}
        paramKey="gender"
      />

      {/* Age Range - Slider */}
      <RangeSlider
        label="Age Range"
        minValue={params.get("age_min")}
        maxValue={params.get("age_max")}
        min={18}
        max={80}
        onChange={updateSingleValue}
        minParamKey="age_min"
        maxParamKey="age_max"
      />

      {/* Product Category - Multi-select */}
      <MultiSelectDropdown
        label="Product Category"
        options={FILTER_OPTIONS.categories}
        selectedValues={params.getAll("category")}
        onChange={updateMultiSelect}
        paramKey="category"
      />

      {/* Tags - Multi-select */}
      <MultiSelectDropdown
        label="Tags"
        options={FILTER_OPTIONS.tags}
        selectedValues={params.getAll("tags")}
        onChange={updateMultiSelect}
        paramKey="tags"
      />

      {/* Payment Method - Multi-select */}
      <MultiSelectDropdown
        label="Payment Method"
        options={FILTER_OPTIONS.paymentMethods}
        selectedValues={params.getAll("payment_method")}
        onChange={updateMultiSelect}
        paramKey="payment_method"
      />

      {/* Date Range */}
      <DateRangePicker
        label="Date"
        startDate={params.get("date_from")}
        endDate={params.get("date_to")}
        onChange={updateSingleValue}
        startParamKey="date_from"
        endParamKey="date_to"
      />
    </div>
  );
}
