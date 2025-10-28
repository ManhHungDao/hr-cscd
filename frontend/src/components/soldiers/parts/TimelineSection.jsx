import SectionCard from "@/components/common/SectionCard.jsx";
import TimelineList from "./TimelineList.jsx";

export default function TimelineSection({ title, items, fields }) {
  return (
    <SectionCard title={title}>
      <TimelineList items={items || []} fields={fields} />
    </SectionCard>
  );
}
