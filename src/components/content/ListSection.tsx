import React from "react";

interface ListSectionProps {
  title: { en: string };
  items: string[];
}

const ListSection: React.FC<ListSectionProps> = ({ title, items }) => {
  return (
    <section className="my-4">
      <h2 className="text-xl font-bold mb-4">{title.en}</h2>
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default ListSection;
