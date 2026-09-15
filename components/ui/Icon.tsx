type IconName =
  | "home"
  | "calendar"
  | "book"
  | "exercise"
  | "revision"
  | "calculator"
  | "class"
  | "message"
  | "settings"
  | "arrow"
  | "plus"
  | "check"
  | "clock"
  | "fire"
  | "search"
  | "menu"
  | "close";

const icons: Record<IconName, string> = {
  home: "⌂",
  calendar: "◷",
  book: "▤",
  exercise: "✓",
  revision: "↻",
  calculator: "∑",
  class: "◎",
  message: "□",
  settings: "⚙",
  arrow: "→",
  plus: "+",
  check: "✓",
  clock: "◷",
  fire: "🔥",
  search: "⌕",
  menu: "☰",
  close: "×",
};

export default function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.9,
        lineHeight: 1,
      }}
    >
      {icons[name]}
    </span>
  );
}
