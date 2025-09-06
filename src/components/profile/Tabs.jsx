/**
 * Tabs component.
 *
 * - Renders a tabbed interface with a list of tabs.
 * - Highlights the active tab and calls a callback function when a tab is clicked.
 *
 * @param {object} props - Component props.
 * @param {string[]} props.tabs - An array of tab labels.
 * @param {string} props.activeTab - The currently active tab.
 * @param {function} props.setActiveTab - Callback function to set the active tab.
 * @returns {JSX.Element} The rendered tabs component.
 */

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div
      role="tablist"
      className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 border-b border-[color:var(--color-background-gray)] mt-4 pb-2"
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
                        py-1 sm:py-2 px-0 sm:px-4 text-lg sm:text-base transition
                        ${idx === 0 ? "sm:pl-0" : ""}
                        ${
                          isActive
                            ? "text-[color:var(--color-primary)]"
                            : "text-gray-400 hover:text-[color:var(--color-primary)]"
                        }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
