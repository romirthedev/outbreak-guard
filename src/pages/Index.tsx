import { HealthcareMeltdown } from "@/components/HealthcareMeltdown";
import { Vortex } from "../components/homebackground";

const Index = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-transparent">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={0}
            rangeHue={5}
        className="flex items-center flex-col justify-center w-full h-full"
      >
        <HealthcareMeltdown />
      </Vortex>
    </div>
  );
};

export default Index;
