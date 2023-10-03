function BlackTriangle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3 text-black transform rotate-210 absolute left-4 bottom-[-12px]" // Example Tailwind CSS classes for width, height, and color
      viewBox="0 0 24 24"
      fill="#000000"
      stroke="#861c1c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 L2 22 L22 22 Z" />
    </svg>
  );
}

export default BlackTriangle;
