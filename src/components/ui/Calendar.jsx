import React, { useEffect, useMemo, useRef, useState } from "react";

/** Utils */
const isoToDate = (iso) => (iso ? new Date(`${iso}T00:00:00`) : undefined);
const dateToISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const fmt = (iso) => (iso ? isoToDate(iso).toLocaleDateString("en-GB") : "");

function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}
const getMondayIndex = (jsDay) => (jsDay + 6) % 7;

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = getMondayIndex(first.getDay());
  const cells = [];
  for (let i = startPad; i > 0; i--) cells.push(new Date(year, month, 1 - i));
  for (let d = 1; d <= last.getDate(); d++)
    cells.push(new Date(year, month, d));
  while (cells.length < 42) {
    const prev = cells[cells.length - 1];
    cells.push(
      new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)
    );
  }
  return cells;
}

export default function Calendar({
  label,
  valueISO,
  minISO,
  disabledISO = [],
  onChange,
  placeholder = "dd/mm/yyyy",
  size = "sm",
}) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selected = isoToDate(valueISO);
  const minDate = isoToDate(minISO);
  const disabledSet = useMemo(() => new Set(disabledISO), [disabledISO]);

  const initialMonth = selected || minDate || new Date();
  const [view, setView] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  useEffect(() => {
    function onDocClick(e) {
      if (!btnRef.current) return;
      const panel = document.getElementById("sdp-panel");
      if (
        open &&
        !btnRef.current.contains(e.target) &&
        panel &&
        !panel.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (selected)
      setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [valueISO]);

  const cells = buildMonthGrid(view.getFullYear(), view.getMonth());
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const todayISO = dateToISO(new Date());

  const sz =
    size === "sm"
      ? { day: "h-7 text-xs", week: "text-[10px]", head: "text-sm", pad: "p-1" }
      : {
          day: "h-8 text-sm",
          week: "text-[11px]",
          head: "text-base",
          pad: "p-2",
        };

  const triggerWidth =
    btnRef.current?.offsetWidth || (size === "sm" ? 320 : 360);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isDisabled = (d) => {
    const iso = dateToISO(d);
    if (disabledSet.has(iso)) return "booked";
    if (minDate && d < minDate) return "past";
    return false;
  };

  const pick = (d) => {
    if (isDisabled(d)) return;
    onChange?.(dateToISO(d));
    setOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm text-gray-500 mb-1">{label}</label>
      )}

      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-gray-300 text-gray-700 rounded px-2 py-2 text-sm text-left focus:outline-none focus:ring focus:ring-green-500"
      >
        {fmt(valueISO) || <span className="text-gray-400">{placeholder}</span>}
      </button>

      {open && (
        <div
          id="sdp-panel"
          className={`absolute z-30 mt-2 bg-white border rounded-md shadow-lg ${sz.pad}`}
          style={{ width: triggerWidth }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-1 pb-2 ${sz.head} font-medium`}
          >
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => setView(addMonths(view, -1))}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div>
              {view.toLocaleString("en-GB", { month: "long", year: "numeric" })}
            </div>
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => setView(addMonths(view, +1))}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* Week header */}
          <div
            className={`grid grid-cols-7 gap-1 px-1 ${sz.week} text-gray-500`}
          >
            {weekDays.map((w) => (
              <div key={w} className="text-center py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 p-1">
            {cells.map((d, i) => {
              const iso = dateToISO(d);
              const outside = d.getMonth() !== view.getMonth();
              const disabledKind = isDisabled(d);
              const selectedDay = selected && isSameDay(d, selected);
              const isToday = iso === todayISO;

              let cls = `${sz.day} rounded flex items-center justify-center select-none transition`;
              if (outside) cls += " text-gray-300";
              else cls += " text-gray-800";
              if (!disabledKind && !selectedDay) cls += " hover:bg-gray-100";
              if (selectedDay)
                cls +=
                  " bg-[color:var(--color-accent)] text-[color:var(--color-neutral)]";
              if (disabledKind) {
                cls += " cursor-not-allowed text-gray-400 bg-gray-50";
                if (disabledKind === "booked")
                  cls += " border border-dashed border-gray-300";
              }
              if (isToday && !selectedDay && !disabledKind)
                cls +=
                  " ring-2 ring-[color:var(--color-primary)] ring-offset-0";

              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => pick(d)}
                  disabled={Boolean(disabledKind)}
                  title={
                    disabledKind === "booked"
                      ? "Unavailable"
                      : disabledKind === "past"
                      ? "Past date"
                      : undefined
                  }
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between px-2 pt-1 pb-2 text-xs">
            <button
              type="button"
              className="text-gray-500 hover:underline"
              onClick={() => {
                onChange?.("");
                setOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="text-gray-700 hover:underline"
              onClick={() => {
                const t = new Date();
                if (!isDisabled(t)) onChange?.(dateToISO(t));
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
