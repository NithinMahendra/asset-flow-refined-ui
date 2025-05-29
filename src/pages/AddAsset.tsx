
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '@/components/StepProgress';
import GeneralInfoStep from '@/components/form-steps/GeneralInfoStep';
import AssignmentStep from '@/components/form-steps/AssignmentStep';
import WarrantyStep from '@/components/form-steps/WarrantyStep';
import ImagesStep from '@/components/form-steps/ImagesStep';
import ReviewStep from '@/components/form-steps/ReviewStep';

const AddAsset = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // General Info - using database enum values
    deviceName: '',
    deviceType: 'laptop', // Default to valid enum value
    brand: '',
    model: '',
    serialNumber: '',
    assetTag: '',
    location: '',
    status: 'active', // Default to valid enum value
    
    // Assignment
    assignedTo: '',
    assignmentDate: null,
    department: '',
    
    // Warranty
    purchaseDate: null,
    warrantyExpiry: null,
    vendor: '',
    purchasePrice: '',
    
    // Images
    images: [],
    invoices: []
  });

  const steps = [
    { id: 1, title: 'General Info', description: 'Device details and basic information' },
    { id: 2, title: 'Assignment', description: 'User assignment and location' },
    { id: 3, title: 'Warranty', description: 'Purchase and warranty information' },
    { id: 4, title: 'Images', description: 'Upload device photos and documents' },
    { id: 5, title: 'Review', description: 'Review and confirm details' }
  ];

  const updateFormData = (field: string, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Final form data being submitted:', formData);
    // Here you would submit to your backend
    navigate('/assets');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <AssignmentStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <WarrantyStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ImagesStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/assets')}
            className="mb-4 p-2 sm:p-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Assets</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Add New Asset
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Follow the steps below to register a new device in the system
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <Card className="glass-effect">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                  >
                    <Check className="h-4 w-4" />
                    <span>Create Asset</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddAsset;
