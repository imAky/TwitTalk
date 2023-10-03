import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/twitterv1.svg"
        alt="logo"
        width={40}
        height={40}
        className="custom-svg-logo"
      />
    </Link>
  );
};

export default Logo;
