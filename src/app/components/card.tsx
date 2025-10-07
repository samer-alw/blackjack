interface CardProps {
  number?: string;
  suit?: string;
  show?: boolean;
  hidden?: boolean; // for dealer’s hidden card
}

export default function Card({
  number,
  suit,
  show = true,
  hidden = false,
}: CardProps) {
  return (
    <div
      className={`w-18 h-24 rounded-lg flex flex-col justify-center items-center p-1
        ${hidden ? "bg-gray-400" : "bg-white"}
        ${
          !hidden &&
          (suit === "♥" || suit === "♦" ? "text-red-600" : "text-black")
        }
        transition-all duration-1000 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {!hidden && (
        <>
          <div className="text-2xl font-extrabold">{number}</div>
          <div className="text-3xl font-bold">{suit}</div>
        </>
      )}
    </div>
  );
}
