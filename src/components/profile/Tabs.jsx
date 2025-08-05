export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-1 border-b border-gray-400 mt-30">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 text-sm font-medium  border-b-1 transition ${
            activeTab === tab
              ? " text-black border-b-transparent"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
