import { useState, useEffect } from "react";

export function useListings() {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    fetch("/api/listings")
      .then(r => r.json())
      .then(setListings);
  }, []);
  return listings;
}
