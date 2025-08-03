export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 border-b mt-20">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === tab
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
