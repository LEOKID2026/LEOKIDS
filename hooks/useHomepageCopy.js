import { useMemo } from "react";
import { useT } from "../lib/i18n/I18nProvider.jsx";

const VALUE_CARD_INDEXES = [0, 1, 2];
const CAPABILITY_IDS = [
  "subject-map",
  "skills",
  "spot-difficulty",
  "over-time",
  "parent-report",
  "focused-work",
];
const PARENT_BENEFIT_INDEXES = [0, 1, 2, 3];
const KIDS_BENEFIT_INDEXES = [0, 1, 2, 3];
const HOW_IT_WORKS_STEP_INDEXES = [0, 1, 2, 3];
const TEACHER_BULLET_INDEXES = [0, 1, 2];
const LEARNING_TEXT_PART_INDEXES = [0, 1, 2];
const FLOW_STEP_INDEXES = [0, 1, 2, 3];
const HERO_FLOW_STEP_INDEXES = [0, 1, 2, 3];

/**
 * Resolved homepage marketing copy from interface locale (`ui.public.homepage.*`).
 */
export function useHomepageCopy() {
  const t = useT();

  return useMemo(() => {
    const heroTitleLines = [0, 1, 2].map((i) => t(`ui.public.homepage.hero.titleLine${i}`));

    return {
      brandLine: t("ui.public.homepage.brandLine"),
      hero: {
        badge: t("ui.public.homepage.hero.badge"),
        titleLines: heroTitleLines,
        subtitle: t("ui.public.homepage.hero.subtitle"),
        reinforcement: t("ui.public.homepage.hero.reinforcement"),
        videoTitle: t("ui.public.homepage.hero.videoTitle"),
        videoDescription: t("ui.public.homepage.hero.videoDescription"),
        parentCta: t("ui.public.homepage.hero.parentCta"),
        kidsCta: t("ui.public.homepage.hero.kidsCta"),
        worksheetsCta: t("ui.public.homepage.hero.worksheetsCta"),
        infoLine: t("ui.public.homepage.hero.infoLine"),
        howItWorksTitle: t("ui.public.homepage.hero.howItWorksTitle"),
        heroFlowSteps: HERO_FLOW_STEP_INDEXES.map((i) =>
          t(`ui.public.homepage.hero.flowStep${i}`)
        ),
        parentVideoAria: t("ui.public.homepage.hero.parentVideoAria"),
      },
      valueCards: VALUE_CARD_INDEXES.map((i) => ({
        title: t(`ui.public.homepage.valueCards.${i}.title`),
        text: t(`ui.public.homepage.valueCards.${i}.text`),
      })),
      parentIntro: {
        label: t("ui.public.homepage.parentIntro.label"),
        title: t("ui.public.homepage.parentIntro.title"),
        text: t("ui.public.homepage.parentIntro.text"),
      },
      parentVideo: {
        title: t("ui.public.homepage.parentVideo.title"),
        description: t("ui.public.homepage.parentVideo.description"),
      },
      learningSystem: {
        label: t("ui.public.homepage.learningSystem.label"),
        title: t("ui.public.homepage.learningSystem.title"),
        textParts: LEARNING_TEXT_PART_INDEXES.map((i) =>
          t(`ui.public.homepage.learningSystem.textPart${i}`)
        ),
        dimensionTags: t("ui.public.homepage.learningSystem.dimensionTags"),
        flowSteps: FLOW_STEP_INDEXES.map((i) =>
          t(`ui.public.homepage.learningSystem.flowStep${i}`)
        ),
        capabilities: CAPABILITY_IDS.map((id) => ({
          id,
          title: t(`ui.public.homepage.learningSystem.capabilities.${id}.title`),
          text: t(`ui.public.homepage.learningSystem.capabilities.${id}.text`),
        })),
      },
      parentBenefits: {
        items: PARENT_BENEFIT_INDEXES.map((i) => ({
          title: t(`ui.public.homepage.parentBenefits.items.${i}.title`),
          text: t(`ui.public.homepage.parentBenefits.items.${i}.text`),
        })),
        highlight: t("ui.public.homepage.parentBenefits.highlight"),
        cta: t("ui.public.homepage.parentBenefits.cta"),
      },
      kids: {
        label: t("ui.public.homepage.kids.label"),
        title: t("ui.public.homepage.kids.title"),
        text: t("ui.public.homepage.kids.text"),
        videoTitle: t("ui.public.homepage.kids.videoTitle"),
        videoDescription: t("ui.public.homepage.kids.videoDescription"),
        benefits: KIDS_BENEFIT_INDEXES.map((i) => ({
          title: t(`ui.public.homepage.kids.benefits.${i}.title`),
          text: t(`ui.public.homepage.kids.benefits.${i}.text`),
        })),
        cta: t("ui.public.homepage.kids.cta"),
        kidsVideoAria: t("ui.public.homepage.kids.kidsVideoAria"),
      },
      howItWorks: {
        title: t("ui.public.homepage.howItWorks.title"),
        steps: HOW_IT_WORKS_STEP_INDEXES.map((i) =>
          t(`ui.public.homepage.howItWorks.step${i}`)
        ),
      },
      finalCta: {
        title: t("ui.public.homepage.finalCta.title"),
        text: t("ui.public.homepage.finalCta.text"),
        parentCta: t("ui.public.homepage.finalCta.parentCta"),
        kidsCta: t("ui.public.homepage.finalCta.kidsCta"),
      },
      teachers: {
        label: t("ui.public.homepage.teachers.label"),
        title: t("ui.public.homepage.teachers.title"),
        text: t("ui.public.homepage.teachers.text"),
        bullets: TEACHER_BULLET_INDEXES.map((i) =>
          t(`ui.public.homepage.teachers.bullet${i}`)
        ),
        cta: t("ui.public.homepage.teachers.cta"),
      },
      flowDiagramAria: t("ui.public.homepage.flowDiagramAria"),
      primaryActionsAria: t("ui.public.homepage.primaryActionsAria"),
    };
  }, [t]);
}
