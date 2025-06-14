import React from 'react';
import BlockRenderer from './BlockRenderer';

interface FaqItem {
  _key: string;
  question: { en: string };
  answer: any[];
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  return (
    <section className="my-4">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <ul className="space-y-4">
        {faqs.map(faq => (
          <li key={faq._key} className="border-b pb-2">
            <h3 className="font-semibold">{faq.question.en}</h3>
            <BlockRenderer blocks={faq.answer} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FaqSection; 