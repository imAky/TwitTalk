import Link from "next/link";
import { PiFeatherLight } from "react-icons/pi";

const Feather = () => {
  return (
    <Link href="/compose/tweet">
      <PiFeatherLight size={48} className="custom-svg-logo rounded-full p-2" />
    </Link>
  );
};

export default Feather;
