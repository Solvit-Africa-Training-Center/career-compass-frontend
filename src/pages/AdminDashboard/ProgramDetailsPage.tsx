import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  language: string;
  institution: string;
}

interface ProgramFee {
  id: string;
  program: string;
  tuition_amount: string;
  tuition_currency: string;
  application_fee_amount: string;
  deposit_amount: string;
  has_scholarship: boolean;
  scholarship_percent: string;
  is_active: boolean;
}

interface ProgramFeature {
  id: string;
  program: string;
  features: string;
  is_active: boolean;
}

interface ProgramIntake {
  id: string;
  program_id: string;
  start_month: string;
  application_deadline: string;
  seats: number;
  is_open: boolean;
  is_active: boolean;
}

interface AdmissionRequirement {
  id: string;
  program: string;
  min_gpa: string;
  other_requirements: string;
  is_active: boolean;
}

const ProgramDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [fees, setFees] = useState<ProgramFee[]>([]);
  const [features, setFeatures] = useState<ProgramFeature[]>([]);
  const [intakes, setIntakes] = useState<ProgramIntake[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgramDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch program details
      const programRes = await CallApi.get(`${backend_path.GET_PROGRAM}${id}/`, { headers });
      setProgram(programRes.data);

      // Fetch all data and filter by program ID
      const [feesRes, featuresRes, intakesRes, admissionsRes] = await Promise.all([
        CallApi.get(backend_path.GET_PROGRAM_FEE, { headers }).catch(() => ({ data: [] })),
        CallApi.get(backend_path.GET_FEATURE, { headers }).catch(() => ({ data: [] })),
        CallApi.get(backend_path.GET_PROGRAM_INTAKE, { headers }).catch(() => ({ data: [] })),
        CallApi.get(backend_path.GET_ADMISSION_REQUIREMENT, { headers }).catch(() => ({ data: [] }))
      ]);

      // Normalize UUID for comparison (remove hyphens)
      const normalizedId = id.replace(/-/g, '');
      
      // Filter data by program ID (normalize UUIDs for comparison)
      const filteredFees = (feesRes.data || []).filter((fee: any) => 
        fee.program.replace(/-/g, '') === normalizedId
      );
      const filteredFeatures = (featuresRes.data || []).filter((feature: any) => 
        feature.program.replace(/-/g, '') === normalizedId
      );
      const filteredIntakes = (intakesRes.data || []).filter((intake: any) => 
        intake.program_id.replace(/-/g, '') === normalizedId
      );
      const filteredAdmissions = (admissionsRes.data || []).filter((admission: any) => 
        admission.program.replace(/-/g, '') === normalizedId
      );

      console.log('Filtering for program ID:', id);
      console.log('Filtered results:', {
        fees: filteredFees,
        features: filteredFeatures,
        intakes: filteredIntakes,
        admissions: filteredAdmissions
      });

      setFees(filteredFees);
      setFeatures(filteredFeatures);
      setIntakes(filteredIntakes);
      setAdmissions(filteredAdmissions);


    } catch (error) {
      console.error('Error fetching program details:', error);
      toast.error('Failed to fetch program details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading program details...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Program not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/programs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </Button>
        <h1 className="text-2xl font-bold text-primarycolor-500">{program.name}</h1>
      </div>

      {/* Program Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Program Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{program.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Duration</label>
            <p className="text-gray-900">{program.duration} months</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Language</label>
            <p className="text-gray-900">{program.language}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-gray-900">{program.description}</p>
          </div>
        </div>
      </Card>

      {/* Program Fees */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Program Fees</h2>
        {fees.length > 0 ? (
          <div className="space-y-3">
            {fees.map((fee) => (
              <div key={fee.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tuition</label>
                    <p className="text-gray-900">{fee.tuition_amount} {fee.tuition_currency}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application Fee</label>
                    <p className="text-gray-900">{fee.application_fee_amount || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Deposit</label>
                    <p className="text-gray-900">{fee.deposit_amount || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scholarship</label>
                    <p className="text-gray-900">{fee.has_scholarship ? `${fee.scholarship_percent}%` : 'None'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No fees configured</p>
        )}
      </Card>

      {/* Program Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Program Features</h2>
        {features.length > 0 ? (
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{feature.features}</p>
                <Badge variant={feature.is_active ? "default" : "secondary"} className="mt-2">
                  {feature.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No features configured</p>
        )}
      </Card>

      {/* Program Intakes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Program Intakes</h2>
        {intakes.length > 0 ? (
          <div className="space-y-3">
            {intakes.map((intake) => (
              <div key={intake.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Month</label>
                    <p className="text-gray-900">{intake.start_month ? new Date(intake.start_month).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application Deadline</label>
                    <p className="text-gray-900">{intake.application_deadline ? new Date(intake.application_deadline).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Seats Available</label>
                    <p className="text-gray-900">{intake.seats}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex gap-2">
                      <Badge variant={intake.is_open ? "default" : "secondary"}>
                        {intake.is_open ? "Open" : "Closed"}
                      </Badge>
                      <Badge variant={intake.is_active ? "default" : "secondary"}>
                        {intake.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No intakes configured</p>
        )}
      </Card>

      {/* Admission Requirements */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Admission Requirements</h2>
        {admissions.length > 0 ? (
          <div className="space-y-3">
            {admissions.map((admission) => (
              <div key={admission.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Minimum GPA</label>
                    <p className="text-gray-900">{admission.min_gpa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge variant={admission.is_active ? "default" : "secondary"}>
                      {admission.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Other Requirements</label>
                    <p className="text-gray-900">{admission.other_requirements || 'None specified'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No admission requirements configured</p>
        )}
      </Card>
    </div>
  );
};

export default ProgramDetailsPage;