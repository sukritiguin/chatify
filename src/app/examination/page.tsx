// import TestIntroductionPage from "./components/Introduction";
import TestIntroductionPage from "./components/Introduction";
import SectionIntroductionPage from "./components/SectionIntroduction";

const test = {
  title: "Professional Skills Test",
  description:
    "A test designed to evaluate your professional skills in various domains.",
  duration: 60, // duration in minutes
  instructions:
    "Make sure to allocate enough time to complete the test. Do not refresh the page during the test.",
};

const section = {
  title: "Technical Skills",
  instructions:
    "This section assesses your technical skills. Please answer all questions to the best of your ability.",
  duration: 30, // duration in minutes
  isMandatory: true, // indicates if the section is mandatory
};

const TestPage = () => {
  // return <TestIntroductionPage test={test} />

  return <SectionIntroductionPage section={section} />;
};

export default TestPage;
