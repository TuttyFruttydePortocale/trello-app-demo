import BoardDisplay from "@/components/BoardDisplay";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <main>
     {/* {Header} */}
      <Header />

      {/* {Body} */}
     <BoardDisplay />
    </main>
  );
}
