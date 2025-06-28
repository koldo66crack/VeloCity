import { useNavigate } from "react-router-dom";
import { useSmartNavigation } from "../../utils/navigationUtils";
import CustomButton from "../CustomButton";

export default function GuidePlatforms() {
  const navigate = useNavigate();
  const { navigateToHome } = useSmartNavigation();

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#34495e] mb-2 uppercase">Platforms: How To Search?</h2>
      <p className="text-black text-lg mb-2">
        There are 350+ platforms for NYC rentals. VeloCity brings them all together in one place—each listing scored for you!
      </p>
      <CustomButton
        onClick={() => navigateToHome(navigate)}
        size="small"
        className="mt-2"
        style={{ borderRadius: 0 }}
      >
        See All Listings
      </CustomButton>
    </section>
  );
}
