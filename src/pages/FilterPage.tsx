import LeadFilter from '../components/LeadFilter';
import type { FilterData } from '../components/LeadFilter';

const FilterPage = () => {
  const handleSubmit = (filters: FilterData) => {
    console.log('Filter submitted:', filters);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-start justify-center p-6">
      <LeadFilter onSubmit={handleSubmit} />
    </div>
  );
};

export default FilterPage;
