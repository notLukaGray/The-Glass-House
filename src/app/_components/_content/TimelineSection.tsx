import React from 'react';

interface TimelineStep {
  _key: string;
  date: { en: string };
  description: { en: string };
}

interface TimelineSectionProps {
  steps: TimelineStep[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ steps }) => {
  return (
    <section className="my-4">
      <h2 className="text-xl font-bold mb-4">Timeline</h2>
      <ul className="space-y-4">
        {steps.map(step => (
          <li key={step._key} className="flex gap-4 items-start">
            <div className="font-semibold">{step.date.en}</div>
            <div>{step.description.en}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TimelineSection; 