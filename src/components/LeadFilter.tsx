import React, { useState, useCallback } from 'react';
import { CITY_DATA } from '../data/cities';
import { ZIP_DATA } from '../data/zips';

// ===== TYPES =====
export interface FilterData {
  targetMarket: string[];
  states: string[];
  cities: string[];
  zipCodes: string[];
  ageMin: string;
  ageMax: string;
  gender: string[];
  maritalStatus: string[];
  homeowner: string[];
  children: string[];
  creditRating: string[];
  householdIncome: string[];
  netWorth: string[];
  location_id: string;
  plan_id: string;
  fromDate: string;
  linkedinProfile: boolean;
}

interface LeadFilterProps {
  onSubmit?: (filters: FilterData) => void;
}

// ===== STATIC DATA =====
const STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DC: 'District of Columbia', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const CREDIT_RATINGS = [
  { value: 'A', label: 'A \u2014 750+' },
  { value: 'B', label: 'B \u2014 700-749' },
  { value: 'C', label: 'C \u2014 650-699' },
  { value: 'D', label: 'D \u2014 600-649' },
  { value: 'E', label: 'E \u2014 550-599' },
  { value: 'F', label: 'F \u2014 500-549' },
  { value: 'G', label: 'G \u2014 450-499' },
  { value: 'H', label: 'H \u2014 Below 450' },
  { value: 'U', label: 'U \u2014 Unknown' },
];

const HOUSEHOLD_INCOMES = [
  { value: 'Less than $20,000', label: '<$20K' },
  { value: '$20,000 to $44,999', label: '$20K-$45K' },
  { value: '$45,000 to $59,999', label: '$45K-$60K' },
  { value: '$60,000 to $74,999', label: '$60K-$75K' },
  { value: '$75,000 to $99,999', label: '$75K-$100K' },
  { value: '$100,000 to $149,999', label: '$100K-$150K' },
  { value: '$150,000 to $199,999', label: '$150K-$200K' },
  { value: '$200,000 to $249,999', label: '$200K-$250K' },
  { value: '$250,000+', label: '$250K+' },
];

const NET_WORTHS = [
  { value: '-$20,000 to -$2,500', label: '-$20K to -$2.5K' },
  { value: '-$2,499 to $2,499', label: '-$2.5K to $2.5K' },
  { value: '$2,500 to $24,999', label: '$2.5K-$25K' },
  { value: '$25,000 to $49,999', label: '$25K-$50K' },
  { value: '$50,000 to $74,999', label: '$50K-$75K' },
  { value: '$75,000 to $99,999', label: '$75K-$100K' },
  { value: '$100,000 to $149,999', label: '$100K-$150K' },
  { value: '$150,000 to $249,999', label: '$150K-$250K' },
  { value: '$250,000 to $374,999', label: '$250K-$375K' },
  { value: '$375,000 to $499,999', label: '$375K-$500K' },
  { value: '$500,000 to $749,999', label: '$500K-$750K' },
  { value: '$750,000 to $999,999', label: '$750K-$1M' },
  { value: '$1,000,000+', label: '$1M+' },
];

// ===== SVG ICONS =====
const SearchIcon = () => (
  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className || 'w-5 h-5'} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

// ===== HELPER COMPONENTS =====
interface TagProps {
  label: string;
  onRemove: () => void;
}
const Tag = ({ label, onRemove }: TagProps) => (
  <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 rounded-full px-2.5 py-0.5 text-xs m-0.5">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="bg-transparent border-none text-violet-700 hover:text-violet-900 cursor-pointer text-sm p-0 leading-none"
    >
      &times;
    </button>
  </span>
);

interface CbPillProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
const CbPill = ({ label, checked, onChange }: CbPillProps) => (
  <label
    className={`inline-flex items-center gap-1.5 border rounded-md px-2.5 py-1.5 cursor-pointer text-xs transition-all select-none ${
      checked
        ? 'bg-violet-100 border-violet-600 text-violet-700 font-semibold'
        : 'border-gray-300 hover:bg-violet-50'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-violet-600"
    />
    {label}
  </label>
);

interface AccordionBarProps {
  id: string;
  label: string;
  summary: string;
  isOpen: boolean;
  onToggle: () => void;
}
const AccordionBar = ({ label, summary, isOpen, onToggle }: AccordionBarProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 border-b transition-colors ${
        isOpen
          ? 'bg-violet-50 border-violet-200 hover:bg-violet-100'
          : 'bg-green-50 border-green-200 hover:bg-green-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckIcon className={`w-5 h-5 ${isOpen ? 'text-violet-500' : 'text-green-500'}`} />
        <span className={`text-sm font-semibold ${isOpen ? 'text-violet-700' : 'text-green-700'}`}>
          {label}
        </span>
        <span className={`text-xs font-normal ${isOpen ? 'text-violet-600' : 'text-green-600'}`}>
          {isOpen ? 'Editing...' : summary}
        </span>
      </div>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
          isOpen ? 'text-violet-500' : 'text-green-500'
        }`}
      />
    </button>
  );
};

// ===== MAIN COMPONENT =====
const LeadFilter: React.FC<LeadFilterProps> = ({ onSubmit }) => {
  // Step 1
  const [targetMarket, setTargetMarket] = useState('');

  // Step 2 - Geography
  const [geoOpen, setGeoOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedZips, setSelectedZips] = useState<string[]>([]);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [zipSearch, setZipSearch] = useState('');

  // Step 3 - Demographics
  const [demoOpen, setDemoOpen] = useState(false);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [gender, setGender] = useState<string[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<string[]>([]);
  const [homeowner, setHomeowner] = useState<string[]>([]);
  const [children, setChildren] = useState<string[]>([]);

  // Step 4 - Financials
  const [finOpen, setFinOpen] = useState(false);
  const [creditRating, setCreditRating] = useState<string[]>([]);
  const [householdIncome, setHouseholdIncome] = useState<string[]>([]);
  const [netWorth, setNetWorth] = useState<string[]>([]);

  // Step 5 - Date + LinkedIn + Terms
  const [dateSlider, setDateSlider] = useState(10);
  const [linkedinCheck, setLinkedinCheck] = useState(false);
  const [termsCheck, setTermsCheck] = useState(false);

  // UI state
  const [showVideo, setShowVideo] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<string | null>(null);

  // ===== COMPUTED STATES =====
  const fromDate = (() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - dateSlider);
    return from.toISOString().split('T')[0];
  })();

  const canSubmit = !!targetMarket && linkedinCheck && termsCheck;

  const citiesUnlocked = selectedStates.length === 1;
  const zipsUnlocked = selectedCities.length > 0;

  // ===== GEO SUMMARIES =====
  const geoSummary = (() => {
    const s = selectedStates.length;
    const c = selectedCities.length;
    const z = selectedZips.length;
    if (s === 0) return 'Nationwide';
    let txt = `${s} state${s > 1 ? 's' : ''}`;
    if (c > 0) txt += `, ${c} cit${c > 1 ? 'ies' : 'y'}`;
    if (z > 0) txt += `, ${z} ZIP${z > 1 ? 's' : ''}`;
    return txt;
  })();

  const demoSummary = (() => {
    const picks: string[] = [];
    if (ageMin || ageMax) picks.push(`Age ${ageMin || '18'}-${ageMax || '100'}`);
    if (gender.length) picks.push('Gender');
    if (maritalStatus.length) picks.push('Married');
    if (homeowner.length) picks.push('Homeowner');
    if (children.length) picks.push('Children');
    return picks.length ? picks.join(', ') : 'Any / No Preference';
  })();

  const finSummary = (() => {
    const picks: string[] = [];
    if (creditRating.length) picks.push('Credit');
    if (householdIncome.length) picks.push('Income');
    if (netWorth.length) picks.push('Net Worth');
    return picks.length ? picks.join(', ') + ' filtered' : 'Any / No Preference';
  })();

  // ===== STEP PROGRESS =====
  const stepsDone = [
    !!targetMarket,
    !geoOpen,
    !demoOpen,
    !finOpen,
    linkedinCheck && termsCheck,
    !!targetMarket && linkedinCheck && termsCheck,
  ];

  const stepEditing = [false, geoOpen, demoOpen, finOpen, false, false];

  // ===== STATE LOGIC =====
  const filteredStates = Object.entries(STATES)
    .filter(([abbr, name]) => {
      if (selectedStates.includes(abbr)) return false;
      const q = stateSearch.toLowerCase();
      return !q || name.toLowerCase().includes(q) || abbr.toLowerCase().includes(q);
    })
    .sort((a, b) => a[1].localeCompare(b[1]));

  const addState = useCallback((abbr: string) => {
    if (selectedStates.includes(abbr)) return;
    if ((selectedCities.length > 0 || selectedZips.length > 0) && selectedStates.length >= 1) {
      alert('Only 1 state allowed when cities or ZIP codes are selected. Clear cities/zips first.');
      return;
    }
    setSelectedStates(prev => [...prev, abbr]);
    setStateSearch('');
  }, [selectedStates, selectedCities, selectedZips]);

  const removeState = useCallback((abbr: string) => {
    setSelectedStates(prev => prev.filter(s => s !== abbr));
    setSelectedCities([]);
    setSelectedZips([]);
  }, []);

  // ===== CITY LOGIC =====
  const filteredCities = (() => {
    if (!citiesUnlocked) return [];
    const stateAbbr = selectedStates[0];
    const cities = CITY_DATA[stateAbbr] || [];
    const q = citySearch.toLowerCase();
    return cities.filter(city => !selectedCities.includes(city) && (!q || city.toLowerCase().includes(q)));
  })();

  const addCity = useCallback((city: string) => {
    if (selectedCities.includes(city)) return;
    setSelectedCities(prev => [...prev, city]);
    setCitySearch('');
  }, [selectedCities]);

  const removeCity = useCallback((city: string) => {
    setSelectedCities(prev => prev.filter(c => c !== city));
    if (selectedStates.length === 1) {
      const stateAbbr = selectedStates[0];
      const stateZips = ZIP_DATA[stateAbbr] || {};
      const cityZips = stateZips[city] || [];
      setSelectedZips(prev => prev.filter(z => !cityZips.includes(z)));
    }
  }, [selectedStates]);

  // ===== ZIP LOGIC =====
  const filteredZips = (() => {
    if (!zipsUnlocked || selectedStates.length === 0) return [];
    const stateAbbr = selectedStates[0];
    const stateZips = ZIP_DATA[stateAbbr] || {};
    const q = zipSearch.toLowerCase();
    const allZips = new Set<string>();
    selectedCities.forEach(city => {
      const zips = stateZips[city] || [];
      zips.forEach(z => { if (!z.includes('.')) allZips.add(z); });
    });
    return Array.from(allZips)
      .filter(zip => !selectedZips.includes(zip) && (!q || zip.includes(q)))
      .sort();
  })();

  const addZip = useCallback((zip: string) => {
    if (selectedZips.includes(zip)) return;
    setSelectedZips(prev => [...prev, zip]);
    setZipSearch('');
  }, [selectedZips]);

  const removeZip = useCallback((zip: string) => {
    setSelectedZips(prev => prev.filter(z => z !== zip));
  }, []);

  // ===== CHECKBOX TOGGLE HELPERS =====
  const toggleCheckbox = (value: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  // ===== TERMS =====
  const acceptTerms = () => {
    setShowTermsModal(false);
    setTermsCheck(true);
  };

  // ===== CLEAR / RESET =====
  const clearForm = () => {
    setTargetMarket('');
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedZips([]);
    setStateSearch('');
    setCitySearch('');
    setZipSearch('');
    setAgeMin('');
    setAgeMax('');
    setGender([]);
    setMaritalStatus([]);
    setHomeowner([]);
    setChildren([]);
    setCreditRating([]);
    setHouseholdIncome([]);
    setNetWorth([]);
    setDateSlider(10);
    setLinkedinCheck(false);
    setTermsCheck(false);
    setSubmittedPayload(null);
    setGeoOpen(false);
    setDemoOpen(false);
    setFinOpen(false);
  };

  // ===== SUBMIT =====
  const handleSubmit = () => {
    const payload: FilterData = {
      targetMarket: [targetMarket],
      states: selectedStates.slice(),
      cities: selectedCities.slice(),
      zipCodes: selectedZips.slice(),
      ageMin,
      ageMax,
      gender: [...gender],
      maritalStatus: [...maritalStatus],
      homeowner: [...homeowner],
      children: [...children],
      creditRating: [...creditRating],
      householdIncome: [...householdIncome],
      netWorth: [...netWorth],
      location_id: '',
      plan_id: '',
      fromDate,
      linkedinProfile: linkedinCheck,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    setSubmittedPayload(jsonStr);
    console.log('API Payload:', jsonStr);
    if (onSubmit) onSubmit(payload);
  };

  const copyPayload = () => {
    if (!submittedPayload) return;
    navigator.clipboard.writeText(submittedPayload).catch(() => {});
  };

  // ===== STEP PROGRESS BAR =====
  const stepLabels = ['Market', 'Geography', 'Demographic', 'Financial', 'Agree', 'Submit'];
  const checkSvgInline = (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const stepDotClass = (i: number) => {
    if (stepsDone[i]) return 'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-green-500 text-white';
    if (stepEditing[i]) return 'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-violet-600 text-white';
    return 'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-200 text-gray-500';
  };

  const connectorClass = (i: number) => {
    if (stepsDone[i]) return 'h-0.5 flex-1 bg-green-400 mx-1';
    if (stepEditing[i]) return 'h-0.5 flex-1 bg-violet-300 mx-1';
    return 'h-0.5 flex-1 bg-gray-200 mx-1';
  };

  // ===== CITY HINT TEXT =====
  const cityHintText = (() => {
    if (selectedStates.length === 0) return 'Select exactly 1 state to filter by city';
    if (selectedStates.length > 1) return 'Multiple states selected -- city/zip filtering requires 1 state';
    return `Blank = all cities in ${STATES[selectedStates[0]]}`;
  })();

  const zipHintText = selectedCities.length > 0
    ? 'Blank = all ZIPs in selected cities'
    : 'Select at least 1 city to filter by ZIP';

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-[720px] relative" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* ===== HEADER ===== */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-1">Intent-Based Prospects</p>
            <h2 className="text-lg font-bold text-gray-900">Set Filters &mdash; See the Results &mdash; Download into CRM</h2>
            <button
              type="button"
              onClick={() => setShowVideo(v => !v)}
              className="text-violet-600 text-xs font-medium hover:text-violet-800 flex items-center gap-1 mt-1"
            >
              <PlayIcon />
              Need help? Watch a 2-min walkthrough
            </button>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            onClick={clearForm}
          >
            &times;
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-3 mb-1 flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={stepDotClass(i)}>
                  {stepsDone[i] ? checkSvgInline : i + 1}
                </div>
                <span className="text-[9px] mt-0.5 text-gray-500">{label}</span>
              </div>
              {i < 5 && <div className={connectorClass(i)} />}
            </React.Fragment>
          ))}
        </div>

        {/* Video embed */}
        {showVideo && (
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src=""
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                style={{ background: '#f3f4f6' }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm pointer-events-none">
                Embed Loom/YouTube here
              </div>
            </div>
          </div>
        )}
      </div>

      <form className="p-6 space-y-5" onSubmit={e => e.preventDefault()}>

        {/* ===== STEP 1: Target Market + Country ===== */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">
              Target Market <span className="text-red-400">*</span>
            </label>
            <select
              value={targetMarket}
              onChange={e => setTargetMarket(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Select Target Market</option>
              <optgroup label="Insurance">
                <option>Life Insurance</option>
                <option>Life Insurance - Final Expense</option>
                <option>Life Insurance - IUL</option>
                <option>Life Insurance - Mortgage Protection</option>
                <option>Health Insurance</option>
                <option>Insurance - Auto</option>
                <option>Insurance - Property &amp; Casualty</option>
                <option>Insurance CRM Seekers</option>
                <option>Medicare T65</option>
                <option>Annuities</option>
              </optgroup>
              <optgroup label="Real Estate &amp; Home">
                <option>Real Estate - Buying Home</option>
                <option>Real Estate - Selling Home</option>
                <option>Home Remodeling</option>
                <option>Bathroom Remodel</option>
                <option>Home Security</option>
                <option>Solar</option>
                <option>Roofing</option>
                <option>Loans - Home</option>
              </optgroup>
              <optgroup label="Home Services">
                <option>HVAC Services</option>
                <option>Plumbing Services</option>
                <option>Electrical</option>
                <option>Pest Control</option>
                <option>Cleaning Services</option>
                <option>Landscaping &amp; Lawn Care</option>
                <option>Turf Installation - Clients</option>
                <option>Painting Services</option>
              </optgroup>
              <optgroup label="Automotive">
                <option>Auto - Luxury</option>
                <option>Auto - Electric &amp; Hybrids</option>
                <option>Auto - Trucks</option>
                <option>Auto - Minivans</option>
                <option>Auto - Parts &amp; Repair Services</option>
              </optgroup>
              <optgroup label="Financial &amp; Legal">
                <option>Loans - Business</option>
                <option>Loans - Personal</option>
                <option>Legal - Personal Injury</option>
                <option>Legal - Family</option>
              </optgroup>
              <optgroup label="Lifestyle">
                <option>Gym Memberships</option>
                <option>Beauty Services - Massage &amp; Body Therapies</option>
                <option>Beauty Services - Medi-Spa &amp; Advanced Skincare</option>
                <option>Singles</option>
                <option>Oils and Minerals</option>
              </optgroup>
              <optgroup label="Other">
                <option>Recruiting - Remote Job Seekers</option>
                <option>GHL Agencies</option>
                <option>Relocation Services</option>
                <option>Restaurants</option>
                <option>South &amp; Central America Vacation Seekers</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Country</label>
            <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600 text-sm cursor-default">
              United States
            </div>
          </div>
        </div>

        {/* ===== STEP 2: Geography ===== */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <AccordionBar
            id="geo"
            label="Geography"
            summary={geoSummary}
            isOpen={geoOpen}
            onToggle={() => setGeoOpen(o => !o)}
          />
          {geoOpen && (
            <div className="p-4 space-y-4">
              {/* State */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  State(s) <span className="text-[10px] text-gray-400 font-normal">Blank = all</span>
                </label>
                <div className="flex flex-wrap min-h-[4px] mb-1">
                  {selectedStates.map(abbr => (
                    <Tag key={abbr} label={abbr} onRemove={() => removeState(abbr)} />
                  ))}
                </div>
                <div className="relative">
                  <SearchIcon />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={e => setStateSearch(e.target.value)}
                    placeholder="Search states..."
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-gray-700 text-[13px] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="max-h-[150px] overflow-y-auto border border-gray-200 rounded-md mt-1">
                  {filteredStates.length === 0 ? (
                    <div className="px-2.5 py-1.5 text-[13px] text-gray-400 cursor-not-allowed">No states found</div>
                  ) : (
                    filteredStates.map(([abbr, name]) => (
                      <div
                        key={abbr}
                        onClick={() => addState(abbr)}
                        className="px-2.5 py-1.5 text-[13px] text-gray-700 cursor-pointer hover:bg-violet-50 hover:text-violet-700"
                      >
                        {name} ({abbr})
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* City */}
              <div className={`transition-opacity ${citiesUnlocked ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  City(s) <span className="text-[10px] text-gray-400 font-normal">Blank = all cities in state</span>
                </label>
                <div className="flex flex-wrap min-h-[4px] mb-1">
                  {selectedCities.map(city => (
                    <Tag key={city} label={city} onRemove={() => removeCity(city)} />
                  ))}
                </div>
                <div className="relative">
                  <SearchIcon />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    placeholder="Search cities..."
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-gray-700 text-[13px] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="max-h-[150px] overflow-y-auto border border-gray-200 rounded-md mt-1">
                  {!citiesUnlocked ? (
                    <div className="px-2.5 py-1.5 text-[13px] text-gray-400 cursor-not-allowed">Select exactly 1 state</div>
                  ) : filteredCities.length === 0 ? (
                    <div className="px-2.5 py-1.5 text-[13px] text-gray-400 cursor-not-allowed">No cities found</div>
                  ) : (
                    filteredCities.map(city => (
                      <div
                        key={city}
                        onClick={() => addCity(city)}
                        className="px-2.5 py-1.5 text-[13px] text-gray-700 cursor-pointer hover:bg-violet-50 hover:text-violet-700"
                      >
                        {city}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{cityHintText}</p>
              </div>

              {/* ZIP */}
              <div className={`transition-opacity ${zipsUnlocked ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  ZIP Code(s) <span className="text-[10px] text-gray-400 font-normal">Blank = all</span>
                </label>
                <div className="flex flex-wrap min-h-[4px] mb-1">
                  {selectedZips.map(zip => (
                    <Tag key={zip} label={zip} onRemove={() => removeZip(zip)} />
                  ))}
                </div>
                <div className="relative">
                  <SearchIcon />
                  <input
                    type="text"
                    value={zipSearch}
                    onChange={e => setZipSearch(e.target.value)}
                    placeholder="Search ZIP codes..."
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-gray-700 text-[13px] outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="max-h-[150px] overflow-y-auto border border-gray-200 rounded-md mt-1">
                  {!zipsUnlocked ? (
                    <div className="px-2.5 py-1.5 text-[13px] text-gray-400 cursor-not-allowed">Select at least 1 city</div>
                  ) : filteredZips.length === 0 ? (
                    <div className="px-2.5 py-1.5 text-[13px] text-gray-400 cursor-not-allowed">No ZIP codes found</div>
                  ) : (
                    filteredZips.map(zip => (
                      <div
                        key={zip}
                        onClick={() => addZip(zip)}
                        className="px-2.5 py-1.5 text-[13px] text-gray-700 cursor-pointer hover:bg-violet-50 hover:text-violet-700"
                      >
                        {zip}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{zipHintText}</p>
              </div>
            </div>
          )}
        </div>

        {/* ===== STEP 3: Demographics ===== */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <AccordionBar
            id="demo"
            label="Demographics"
            summary={demoSummary}
            isOpen={demoOpen}
            onToggle={() => setDemoOpen(o => !o)}
          />
          {demoOpen && (
            <div className="p-4 space-y-4">
              {/* Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">Age Min</label>
                  <input
                    type="number"
                    value={ageMin}
                    onChange={e => setAgeMin(e.target.value)}
                    placeholder="18"
                    min={18}
                    max={100}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">Age Max</label>
                  <input
                    type="number"
                    value={ageMax}
                    onChange={e => setAgeMax(e.target.value)}
                    placeholder="100"
                    min={18}
                    max={100}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Gender / Married / Homeowner / Children */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Gender <span className="text-[10px] text-gray-400 font-normal">blank=any</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    <CbPill label="Male" checked={gender.includes('M')} onChange={() => toggleCheckbox('M', gender, setGender)} />
                    <CbPill label="Female" checked={gender.includes('F')} onChange={() => toggleCheckbox('F', gender, setGender)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Married <span className="text-[10px] text-gray-400 font-normal">blank=any</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    <CbPill label="Yes" checked={maritalStatus.includes('Y')} onChange={() => toggleCheckbox('Y', maritalStatus, setMaritalStatus)} />
                    <CbPill label="No" checked={maritalStatus.includes('N')} onChange={() => toggleCheckbox('N', maritalStatus, setMaritalStatus)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Homeowner <span className="text-[10px] text-gray-400 font-normal">blank=any</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    <CbPill label="Yes" checked={homeowner.includes('Y')} onChange={() => toggleCheckbox('Y', homeowner, setHomeowner)} />
                    <CbPill label="No" checked={homeowner.includes('N')} onChange={() => toggleCheckbox('N', homeowner, setHomeowner)} />
                    <CbPill label="Probable" checked={homeowner.includes('P')} onChange={() => toggleCheckbox('P', homeowner, setHomeowner)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Children <span className="text-[10px] text-gray-400 font-normal">blank=any</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    <CbPill label="Yes" checked={children.includes('Y')} onChange={() => toggleCheckbox('Y', children, setChildren)} />
                    <CbPill label="No" checked={children.includes('N')} onChange={() => toggleCheckbox('N', children, setChildren)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== STEP 4: Financials ===== */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <AccordionBar
            id="fin"
            label="Financials"
            summary={finSummary}
            isOpen={finOpen}
            onToggle={() => setFinOpen(o => !o)}
          />
          {finOpen && (
            <div className="p-4 space-y-4">
              {/* Credit Rating */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Credit Rating <span className="text-xs text-gray-400 font-normal">click to add, blank = any</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CREDIT_RATINGS.map(({ value, label }) => (
                    <CbPill
                      key={value}
                      label={label}
                      checked={creditRating.includes(value)}
                      onChange={() => toggleCheckbox(value, creditRating, setCreditRating)}
                    />
                  ))}
                </div>
              </div>

              {/* Household Income */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Household Income <span className="text-xs text-gray-400 font-normal">click to add, blank = any</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {HOUSEHOLD_INCOMES.map(({ value, label }) => (
                    <CbPill
                      key={value}
                      label={label}
                      checked={householdIncome.includes(value)}
                      onChange={() => toggleCheckbox(value, householdIncome, setHouseholdIncome)}
                    />
                  ))}
                </div>
              </div>

              {/* Net Worth */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Net Worth <span className="text-xs text-gray-400 font-normal">click to add, blank = any</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NET_WORTHS.map(({ value, label }) => (
                    <CbPill
                      key={value}
                      label={label}
                      checked={netWorth.includes(value)}
                      onChange={() => toggleCheckbox(value, netWorth, setNetWorth)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== STEP 5: Date + LinkedIn + Terms ===== */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                How far back?{' '}
                <span className="text-violet-600 font-semibold">
                  {dateSlider === 1 ? 'Last 1 day' : `Last ${dateSlider} days`}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={dateSlider}
                step={1}
                onChange={e => setDateSlider(Number(e.target.value))}
                className="w-full accent-violet-600 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5 px-0.5">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
              </div>
            </div>
            <div>
              <label
                className="flex items-start gap-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-md p-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={linkedinCheck}
                  onChange={e => setLinkedinCheck(e.target.checked)}
                  className="accent-violet-600 w-4 h-4 mt-0.5"
                />
                <span>
                  <strong>LinkedIn Profile Links available!</strong>
                  <br />
                  <span className="text-xs text-blue-600">Check to confirm responsible use of LinkedIn data</span>
                </span>
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 bg-gray-50 rounded-md p-3 border border-gray-200">
            <input
              type="checkbox"
              id="termsCheck"
              checked={termsCheck}
              onChange={e => setTermsCheck(e.target.checked)}
              className="accent-violet-600 w-4 h-4 mt-0.5"
            />
            <label htmlFor="termsCheck" className="text-sm text-gray-700">
              I have read and agree to these{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-violet-600 underline hover:text-violet-800 font-medium"
              >
                Terms of Use, Disclaimer &amp; Indemnification
              </button>
              .
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={clearForm}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
            >
              Reset
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="bg-violet-600 text-white px-8 py-2 rounded-md hover:bg-violet-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* ===== JSON PAYLOAD DISPLAY ===== */}
      {submittedPayload && (
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[13px] font-semibold text-gray-700">JSON Payload</label>
            <button
              type="button"
              onClick={copyPayload}
              className="text-xs text-violet-600 hover:text-violet-800 font-medium"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
            {submittedPayload}
          </pre>
          <p className="text-[11px] text-gray-400 mt-2">
            POST to: https://datadriverapi.fixmyonline.com/api/v1/bigdata/get-big-data
          </p>
        </div>
      )}

      {/* ===== TERMS MODAL ===== */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-[580px] w-full p-8 relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Terms of Use, Disclaimer, &amp; Indemnification</h3>
            <p className="text-sm text-gray-700 mb-3">
              By checking this box, I acknowledge and agree to the following legally binding terms as a condition of purchasing, accessing, or using this data product:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5 mb-5">
              <li>I understand and agree that I am solely and fully responsible for how I use any data purchased from this platform, including but not limited to email addresses, phone numbers, or demographic information.</li>
              <li>I agree to comply with all applicable federal, state, and local laws, including but not limited to the Telephone Consumer Protection Act (TCPA), Do Not Call (DNC) regulations, CAN-SPAM, and other consumer protection and privacy laws.</li>
              <li>I will not use this data in any unlawful, unethical, or non-compliant manner, including contacting individuals on any national or state DNC list without proper consent or failing to follow opt-out and consent requirements.</li>
              <li>I acknowledge that this data is provided for legitimate business and marketing purposes only and agree not to use it for fraud, harassment, or any illegal activity.</li>
              <li>I agree to indemnify, defend, and hold harmless the platform, its owners, operators, employees, and affiliates from and against any and all claims, damages, losses, liabilities, and expenses (including legal fees) arising from my use or misuse of the data.</li>
              <li>I understand that no data will be accessible or delivered unless I agree to these terms, and that my purchase is contingent upon this agreement.</li>
            </ul>
            <button
              type="button"
              onClick={acceptTerms}
              className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800 text-sm font-medium"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFilter;
