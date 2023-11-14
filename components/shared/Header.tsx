"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  showBackArrow?: boolean;
  label: string;
  isBorder?: boolean;
  isSticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showBackArrow,
  label,
  isBorder,
  isSticky,
}) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div
      className={`${isBorder && "border-b-2 border-b-dark-2"} ${
        isSticky && "sticky top-0 z-50"
      } p-3 bg-dark-1 bg-opacity-50 bg-blur-md`}
    >
      <div className="flex flex-row items-center gap-3">
        {showBackArrow && (
          <BiArrowBack
            onClick={handleBack}
            color="white"
            size={20}
            className="cursor-pointer hover:opacity-70 transition"
          />
        )}
        <h1 className="text-white text-xl font-semibold">{label}</h1>
      </div>
    </div>
  );
};

export default Header;
