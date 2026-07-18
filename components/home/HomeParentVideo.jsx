import ParentPromoVideo from "../parent/ParentPromoVideo";
import { useHomepageCopy } from "../../hooks/useHomepageCopy.js";import { getHomeTextClasses } from "./home-theme";

/**
 * @param {{ isBright: boolean, featured?: boolean }} props
 */
export default function HomeParentVideo({ isBright, featured = false }) {
  const { parentVideo: copy } = useHomepageCopy();
  const cls = getHomeTextClasses(isBright);

  if (featured) {
    return (
      <section
        className={cls.featuredVideoShell}
        data-testid="home-parent-video"
        aria-label={copy.title}
      >
        <ParentPromoVideo
          isBright={isBright}
          title={copy.title}
          description={copy.description}
          featured
          className="py-0"
        />
      </section>
    );
  }

  return (
    <section data-testid="home-parent-video">
      <ParentPromoVideo
        isBright={isBright}
        title={copy.title}
        description={copy.description}
        className="py-2"
      />
    </section>
  );
}

