import RentalTermFlipCard from "./RentalTermFlipCard";

const TERMS = [
  {
    term: "Broker",
    definition: "A licensed real estate agent who connects renters with landlords. Often charges a fee (can be 1-2 months’ rent!).",
  },
  {
    term: "Broker Fee",
    definition: "The amount you pay to the broker for helping you find an apartment. Sometimes can be avoided with 'no-fee' listings.",
  },
  {
    term: "Guarantor",
    definition: "A person or company that promises to pay your rent if you can’t. Needed if you don’t meet the landlord’s income requirements.",
  },
  {
    term: "Tour",
    definition: "An in-person or video visit to an apartment before you sign anything. Never rent sight unseen!",
  },
  {
    term: "Rental Insurance",
    definition: "Protects your stuff against fire, theft, or damage. Usually required by landlords, and often cheap ($10–$20/month).",
  },
  {
    term: "No-Fee Apartment",
    definition: "An apartment where the landlord pays the broker, so you don’t have to. Always search for these first if you’re on a budget.",
  },
  {
    term: "Application Fee",
    definition: "A non-refundable fee you pay when applying for an apartment, often used to run a background check.",
  },
  {
    term: "Sublet",
    definition: "Renting from another renter (not the landlord), usually short-term. Always get written approval!",
  },
  // Add as many as you want!
];

export default function SeniorBlogList() {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {TERMS.map(({ term, definition }) => (
        <RentalTermFlipCard key={term} term={term} definition={definition} />
      ))}
    </div>
  );
}
