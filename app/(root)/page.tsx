import Image from "next/image";
import Header from "@/components/shared/Header";

export default function Home() {
  return (
    <main>
      <Header showBackArrow label="Home" />
      <h1>HomePage</h1>
    </main>
  );
}
