import AboutWorkExperience from "@/app/_components/_content/AboutWorkExperience";
import AboutEducation from "@/app/_components/_content/AboutEducation";
import AboutSoftware from "@/app/_components/_content/AboutSoftware";
import AboutSkills from "@/app/_components/_content/AboutSkills";
import TextSection from "@/app/_components/_content/TextSection";
import TwoColumnSection from "@/app/_components/_content/TwoColumnSection";
import QuoteSection from "@/app/_components/_content/QuoteSection";
import FaqSection from "@/app/_components/_content/FaqSection";
import ListSection from "@/app/_components/_content/ListSection";
import InsetSection from "@/app/_components/_content/InsetSection";
import ImageSection from "@/app/_components/_content/ImageSection";
import GallerySection from "@/app/_components/_content/GallerySection";
import VideoSection from "@/app/_components/_content/VideoSection";
import ProcessStepSection from "@/app/_components/_content/ProcessStepSection";
import TimelineSection from "@/app/_components/_content/TimelineSection";
import DividerSection from "@/app/_components/_content/DividerSection";
import CalloutSection from "@/app/_components/_content/CalloutSection";
import ButtonRowSection from "@/app/_components/_content/ButtonRowSection";
import RelatedSection from "@/app/_components/_content/RelatedSection";
import IconSection from "@/app/_components/_content/IconSection";
import AvatarSection from "@/app/_components/_content/AvatarSection";

export const sectionComponentMap = {
  workExperienceSection: AboutWorkExperience,
  educationSection: AboutEducation,
  softwareSection: AboutSoftware,
  skillsSection: AboutSkills,
};

export const iconKeyMap = {
  workExperienceSection: "icon",
  educationSection: "logo",
  softwareSection: "icon",
  skillsSection: "icon",
};

export const portfolioSectionComponentMap = {
  textSection: TextSection,
  twoColumnSection: TwoColumnSection,
  quoteSection: QuoteSection,
  faqSection: FaqSection,
  listSection: ListSection,
  insetSection: InsetSection,
  imageSection: ImageSection,
  gallerySection: GallerySection,
  videoSection: VideoSection,
  processStepSection: ProcessStepSection,
  timelineSection: TimelineSection,
  dividerSection: DividerSection,
  calloutSection: CalloutSection,
  buttonRowSection: ButtonRowSection,
  relatedSection: RelatedSection,
  iconSection: IconSection,
  avatarSection: AvatarSection,
}; 