export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div
      role="tablist"
      className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 border-b border-gray-300 mt-4 pb-2"
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab)}
            className={`w-full sm:w-auto text-left sm:text-start
                        py-1 sm:py-2 px-0 sm:px-4 text-sm font-medium border-b-2 transition
                        ${idx === 0 ? "sm:pl-0" : ""}
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
