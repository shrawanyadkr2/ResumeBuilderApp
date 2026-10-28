import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import StepperProgress from '../../components/StepperProgress';
import BottomNavButtons from '../../components/BottomNavButtons';
import { useResume } from '../../context/ResumeContext';

import Step1PersonalInfo from './Step1PersonalInfo';
import Step2Summary from './Step2Summary';
import Step3Experience from './Step3Experience';
import Step4Education from './Step4Education';
import Step5Skills from './Step5Skills';
import Step6Projects from './Step6Projects';
import Step7Templates from './Step7Templates';

const STEP_TITLES = [
  'Personal Info',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Projects',
  'Design & Style',
];

export const ResumeBuilderFlow = ({ onExitToDashboard, onGoToPreview, onGoToExport }) => {
  const { colors } = useTheme();
  const { activeStep, setActiveStep, isSaving, saveCurrentResume } = useResume();

  const handleNext = async () => {
    saveCurrentResume();

    if (activeStep < 7) {
      setActiveStep(activeStep + 1);
    } else {
      if (onGoToExport) onGoToExport();
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      if (onExitToDashboard) onExitToDashboard();
    }
  };

  const renderStepComponent = () => {
    switch (activeStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2Summary />;
      case 3:
        return <Step3Experience />;
      case 4:
        return <Step4Education />;
      case 5:
        return <Step5Skills />;
      case 6:
        return <Step6Projects />;
      case 7:
        return <Step7Templates />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Header with step tracking & Live Preview button */}
        <Header
          title={STEP_TITLES[activeStep - 1] || 'Resume Genie'}
          stepNumber={activeStep}
          totalSteps={7}
          onBack={handleBack}
          onPreview={onGoToPreview}
          showPreview={true}
        />

        {/* Stepper Progress Bar (1/7 to 7/7) */}
        <StepperProgress currentStep={activeStep} totalSteps={7} />

        {/* Active Step Content */}
        <View style={[styles.stepContent, { backgroundColor: colors.background }]}>
          {renderStepComponent()}
        </View>

        {/* Bottom Navigation Buttons */}
        <BottomNavButtons
          onBack={handleBack}
          onNext={handleNext}
          backTitle={activeStep === 1 ? 'Dashboard' : 'Back'}
          nextTitle="Next Step"
          isLastStep={activeStep === 7}
          loading={isSaving}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  stepContent: {
    flex: 1,
  },
});

export default ResumeBuilderFlow;
