import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function SearchBar() {
  const [params, setParams] = useSearchParams();

  const initValue = params.get("q") || "";
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    const delay = setTimeout(() => {
      const newParams = new URLSearchParams(params);

      if (value.trim() !== "") newParams.set("q", value.trim());
      else newParams.delete("q");

      newParams.delete("cursor");
      setParams(newParams);
    }, 300);

    return () => clearTimeout(delay);
  }, [value]);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Name, Phone no."
        className="border p-2 rounded w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
