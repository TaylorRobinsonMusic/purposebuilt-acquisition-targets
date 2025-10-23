export type GroupByOption = 
  | 'none'
  | 'overallScore'
  | 'profitScore'
  | 'businessType'
  | 'state'
  | 'ownershipType'
  | 'revenueRange';

interface GroupingSelectorProps {
  currentGrouping: GroupByOption;
  onGroupingChange: (grouping: GroupByOption) => void;
}

export default function GroupingSelector({ currentGrouping, onGroupingChange }: GroupingSelectorProps) {
  return (
    <select
      value={currentGrouping}
      onChange={(e) => onGroupingChange(e.target.value as GroupByOption)}
      className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="none">No grouping</option>
      <option value="overallScore">Overall Score</option>
      <option value="profitScore">Profit Score</option>
      <option value="businessType">Business Type</option>
      <option value="state">State</option>
      <option value="ownershipType">Ownership Type</option>
      <option value="revenueRange">Revenue Range</option>
    </select>
  );
}

