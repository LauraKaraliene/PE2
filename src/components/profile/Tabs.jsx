export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-300 mt-30 ">
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition
              ${idx === 0 ? "pl-0" : ""} 
              ${
                isActive
                  ? "border-transparent text-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
