import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/card';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Institution {
  id: string;
  official_name: string;
}

interface ProgramWizardProps {
  institutions: Institution[];
  onComplete: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, name: 'Program Information', description: 'Basic program details' },
  { id: 2, name: 'Program Fees', description: 'Fee structure' },
  { id: 3, name: 'Program Features', description: 'Key features' },
  { id: 4, name: 'Program Intakes', description: 'Intake periods' },
  { id: 5, name: 'Admission Requirements', description: 'Entry requirements' }
];

const ProgramWizard = ({ institutions, onComplete, onCancel }: ProgramWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [programId, setProgramId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Step 1: Program Information
  const [programData, setProgramData] = useState({
    institution_id: '',
    name: '',
    description: '',
    duration: '',
    language: '',
    is_active: true
  });

  // Step 2: Program Fees (single entry per program)
  const [feeData, setFeeData] = useState({ 
    tuition_amount: '', 
    tuition_currency: 'RWF', 
    application_fee_amount: '', 
    deposit_amount: '', 
    has_scholarship: false, 
    scholarship_percent: '', 
    is_active: true 
  });

  // Step 3: Program Features (single entry per program)
  const [featureData, setFeatureData] = useState({ 
    features: '', 
    is_active: true 
  });

  // Step 4: Program Intakes (multiple allowed)
  const [intakes, setIntakes] = useState([
    { 
      start_month: '', 
      application_deadline: '', 
      seats: '', 
      is_open: true, 
      is_active: true 
    }
  ]);

  // Step 5: Admission Requirements (single entry per program)
  const [admissionData, setAdmissionData] = useState({ 
    min_gpa: '', 
    other_requirements: '', 
    is_active: true 
  });

  const saveStep = async (stepNumber: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      switch (stepNumber) {
        case 1:
          const programPayload = {
            institution_id: programData.institution_id,
            name: programData.name,
            description: programData.description,
            duration: parseInt(programData.duration) || 0,
            language: programData.language,
            is_active: programData.is_active,
            institution: programData.institution_id
          };
          const programRes = await CallApi.post(backend_path.ADD_PROGRAM, programPayload, { headers });
          console.log('Program created:', programRes.data);
          setProgramId(programRes.data.id);
          toast.success('Program information saved');
          break;

        case 2:
          if (feeData.tuition_amount) {
            await CallApi.post(backend_path.ADD_PROGRAM_FEE, {
              program: programId,
              tuition_amount: feeData.tuition_amount,
              tuition_currency: feeData.tuition_currency,
              application_fee_amount: feeData.application_fee_amount,
              deposit_amount: feeData.deposit_amount,
              has_scholarship: feeData.has_scholarship,
              scholarship_percent: feeData.scholarship_percent,
              is_active: feeData.is_active
            }, { headers });
          }
          toast.success('Program fees saved');
          break;

        case 3:
          if (featureData.features.trim()) {
            await CallApi.post(backend_path.ADD_FEATURE, {
              program: programId,
              features: featureData.features.trim(),
              is_active: featureData.is_active
            }, { headers });
          }
          toast.success('Program features saved');
          break;

        case 4:
          const validIntakes = intakes.filter(i => i.start_month && i.application_deadline && i.seats);
          console.log('Valid intakes to save:', validIntakes.length);
          
          for (const intake of validIntakes) {
            const intakePayload = {
              program: programId,
              program_id: programId,
              start_month: intake.start_month,
              application_deadline: intake.application_deadline,
              seats: parseInt(intake.seats),
              is_open: intake.is_open,
              is_active: intake.is_active
            };
            console.log('Saving intake payload:', intakePayload);
            
            try {
              const response = await CallApi.post(backend_path.ADD_PROGRAM_INTAKE, intakePayload, { headers });
              console.log('Intake saved successfully:', response.data);
            } catch (intakeError) {
              console.error('Failed to save intake:', intakeError);
              throw intakeError;
            }
          }
          
          if (validIntakes.length > 0) {
            toast.success(`${validIntakes.length} program intake(s) saved`);
          } else {
            toast.info('No valid intakes to save');
          }
          break;

        case 5:
          if (admissionData.min_gpa || admissionData.other_requirements) {
            const admissionPayload = {
              program: programId,
              min_gpa: admissionData.min_gpa || '0.00',
              other_requirements: admissionData.other_requirements || '',
              is_active: admissionData.is_active
            };
            console.log('Saving admission payload:', admissionPayload);
            
            try {
              const response = await CallApi.post(backend_path.ADD_ADMISSION_REQUIREMENT, admissionPayload, { headers });
              console.log('Admission saved successfully:', response.data);
              toast.success('Admission requirements saved');
            } catch (admissionError) {
              console.error('Failed to save admission:', admissionError);
              throw admissionError;
            }
          } else {
            toast.info('No admission requirements to save');
          }
          break;
      }
    } catch (error: any) {
      console.error(`Error saving step ${stepNumber}:`, error);
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
        const errorMsg = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
        toast.error(`Failed to save step ${stepNumber}: ${errorMsg}`);
      } else {
        toast.error(`Failed to save step ${stepNumber}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      await saveStep(currentStep);
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      // Error already handled in saveStep
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addItem = (type: 'intake') => {
    if (type === 'intake') {
      setIntakes([...intakes, { 
        start_month: '', 
        application_deadline: '', 
        seats: '', 
        is_open: true, 
        is_active: true 
      }]);
    }
  };

  const removeItem = (type: 'intake', index: number) => {
    if (type === 'intake') {
      setIntakes(intakes.filter((_, i) => i !== index));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <select
              value={programData.institution_id}
              onChange={(e) => setProgramData({ ...programData, institution_id: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Institution</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.official_name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Program Name"
              value={programData.name}
              onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={programData.description}
              onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
              className="w-full p-2 border rounded-md h-20 resize-none"
            />
            <Input
              type="number"
              placeholder="Duration (in months)"
              value={programData.duration}
              onChange={(e) => setProgramData({ ...programData, duration: e.target.value })}
            />
            <Input
              placeholder="Language"
              value={programData.language}
              onChange={(e) => setProgramData({ ...programData, language: e.target.value })}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium">Program Fee Structure</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Tuition Amount</label>
                  <Input
                    type="number"
                    placeholder="Tuition Amount"
                    value={feeData.tuition_amount}
                    onChange={(e) => setFeeData({ ...feeData, tuition_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={feeData.tuition_currency}
                    onChange={(e) => setFeeData({ ...feeData, tuition_currency: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="RWF">RWF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Application Fee Amount</label>
                  <Input
                    type="number"
                    placeholder="Application Fee Amount"
                    value={feeData.application_fee_amount}
                    onChange={(e) => setFeeData({ ...feeData, application_fee_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deposit Amount</label>
                  <Input
                    type="number"
                    placeholder="Deposit Amount"
                    value={feeData.deposit_amount}
                    onChange={(e) => setFeeData({ ...feeData, deposit_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Scholarship Percentage</label>
                  <Input
                    type="number"
                    placeholder="Scholarship Percentage"
                    value={feeData.scholarship_percent}
                    onChange={(e) => setFeeData({ ...feeData, scholarship_percent: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feeData.has_scholarship}
                    onChange={(e) => setFeeData({ ...feeData, has_scholarship: e.target.checked })}
                  />
                  Has Scholarship
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feeData.is_active}
                    onChange={(e) => setFeeData({ ...feeData, is_active: e.target.checked })}
                  />
                  Is Active
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium">Program Features</h4>
              <div>
                <label className="text-sm font-medium">Features</label>
                <textarea
                  placeholder="Features (e.g., Online Learning, Industry Partnerships, etc.)"
                  value={featureData.features}
                  onChange={(e) => setFeatureData({ ...featureData, features: e.target.value })}
                  className="w-full p-2 border rounded-md h-20 resize-none"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featureData.is_active}
                  onChange={(e) => setFeatureData({ ...featureData, is_active: e.target.checked })}
                />
                Is Active
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {intakes.map((intake, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Intake #{index + 1}</h4>
                  {intakes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeItem('intake', index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Start Month</label>
                    <Input
                      type="date"
                      value={intake.start_month}
                      onChange={(e) => {
                        const newIntakes = [...intakes];
                        newIntakes[index].start_month = e.target.value;
                        setIntakes(newIntakes);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Application Deadline</label>
                    <Input
                      type="date"
                      value={intake.application_deadline}
                      onChange={(e) => {
                        const newIntakes = [...intakes];
                        newIntakes[index].application_deadline = e.target.value;
                        setIntakes(newIntakes);
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Number of Seats</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Number of seats available"
                      value={intake.seats}
                      onChange={(e) => {
                        const newIntakes = [...intakes];
                        newIntakes[index].seats = e.target.value;
                        setIntakes(newIntakes);
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={intake.is_open}
                      onChange={(e) => {
                        const newIntakes = [...intakes];
                        newIntakes[index].is_open = e.target.checked;
                        setIntakes(newIntakes);
                      }}
                    />
                    Is Open for Applications
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={intake.is_active}
                      onChange={(e) => {
                        const newIntakes = [...intakes];
                        newIntakes[index].is_active = e.target.checked;
                        setIntakes(newIntakes);
                      }}
                    />
                    Is Active
                  </label>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem('intake')}>
              Add Intake
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium">Admission Requirements</h4>
              <div>
                <label className="text-sm font-medium">Minimum GPA</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 3.00"
                  value={admissionData.min_gpa}
                  onChange={(e) => setAdmissionData({ ...admissionData, min_gpa: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Other Requirements</label>
                <Input
                  placeholder="e.g., SAT score, letters of recommendation, etc."
                  value={admissionData.other_requirements}
                  onChange={(e) => setAdmissionData({ ...admissionData, other_requirements: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={admissionData.is_active}
                  onChange={(e) => setAdmissionData({ ...admissionData, is_active: e.target.checked })}
                />
                Is Active
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.id < currentStep ? 'bg-green-500 border-green-500 text-white' :
                step.id === currentStep ? 'bg-primarycolor-500 border-primarycolor-500 text-white' :
                'border-gray-300 text-gray-300'
              }`}>
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{steps[currentStep - 1].name}</h2>
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleNext}
            disabled={loading}
            className="bg-primarycolor-500 hover:bg-primarycolor-600"
          >
            {loading ? 'Saving...' : currentStep === 5 ? 'Complete' : 'Next'}
            {currentStep < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramWizard;