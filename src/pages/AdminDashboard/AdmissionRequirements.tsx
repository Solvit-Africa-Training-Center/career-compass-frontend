import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface AdmissionRequirement {
  id: number;
  min_gpa: string;
  other_requirements: string;
  is_active: boolean;
  program: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  duration: number;
  institution: string;
  institution_id: string;
  is_active: boolean;
  language: string;
}

interface FormData {
  program: string;
  min_gpa: string;
  other_requirements: string;
  is_active: boolean;
}

const AdmissionRequirements = () => {
  const [requirements, setRequirements] = useState<AdmissionRequirement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<AdmissionRequirement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [formData, setFormData] = useState<FormData>({
    program: '',
    min_gpa: '',
    other_requirements: '',
    is_active: true
  });

  // Memoized form update function
  const updateFormData = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // API calls with proper error handling
  const fetchRequirements = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_ADMISSION_REQUIREMENT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Admission Requirements API response:', res.data);
      const data = res.data?.results || res.data || [];
      setRequirements(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      console.error('Error fetching admission requirements:', error);
      if (errorResponse?.response?.status === 404) {
        toast.error('Admission requirements endpoint not available');
      } else {
        toast.error('Failed to fetch admission requirements');
      }
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrograms = useCallback(async () => {
    try {
      setProgramsLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Programs API response:', res.data);
      const data = res.data?.results || res.data || [];
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to fetch programs');
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  // Form handlers
  const resetForm = useCallback(() => {
    setFormData({
      program: '',
      min_gpa: '',
      other_requirements: '',
      is_active: true
    });
  }, []);

  const handleAdd = useCallback(async () => {
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.min_gpa) {
      toast.error('Please enter minimum GPA');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        min_gpa: formData.min_gpa,
        other_requirements: formData.other_requirements,
        is_active: formData.is_active
      };
      console.log('Sending admission requirement data:', payload);
      await CallApi.post(backend_path.ADD_ADMISSION_REQUIREMENT, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admission requirement added successfully');
      setOpen(false);
      resetForm();
      fetchRequirements();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Admission requirement creation error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add admission requirement');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, resetForm, fetchRequirements]);

  const handleUpdate = useCallback(async () => {
    if (!selectedRequirement) return;
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.min_gpa) {
      toast.error('Please enter minimum GPA');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        min_gpa: formData.min_gpa,
        other_requirements: formData.other_requirements,
        is_active: formData.is_active
      };
      console.log('Updating admission requirement data:', payload);
      console.log('Selected requirement:', selectedRequirement);
      await CallApi.put(`${backend_path.UPDATE_ADMISSION_REQUIREMENT}${selectedRequirement.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admission requirement updated successfully');
      setEditOpen(false);
      setSelectedRequirement(null);
      resetForm();
      fetchRequirements();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Admission requirement update error:', errorResponse.response?.data);
      console.error('Full error:', error);
      if (errorResponse?.response?.status === 400) {
        const errorData = errorResponse.response?.data;
        const errorMsg = errorData?.detail || errorData?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update admission requirement');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedRequirement, formData, resetForm, fetchRequirements]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this admission requirement?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_ADMISSION_REQUIREMENT}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admission requirement deleted successfully');
      fetchRequirements();
    } catch (error) {
      console.error('Error deleting admission requirement:', error);
      toast.error('Failed to delete admission requirement');
    } finally {
      setLoading(false);
    }
  }, [fetchRequirements]);

  const openEditDialog = useCallback((requirement: AdmissionRequirement) => {
    setSelectedRequirement(requirement);
    setFormData({
      program: requirement.program,
      min_gpa: requirement.min_gpa,
      other_requirements: requirement.other_requirements,
      is_active: requirement.is_active
    });
    setEditOpen(true);
  }, []);

  // Utility functions - Enhanced to handle different UUID formats
  const getProgramName = useCallback((programId: string | undefined | null) => {
    if (!programId) return 'No Program Assigned';
    if (!programs.length) return `Loading... (${programId})`;
    
    // Try exact match first
    let program = programs.find(p => p.id === programId);
    
    // If not found, try to find by converting UUID formats
    if (!program) {
      // Try to find by converting UUID with hyphens to format without hyphens
      const idWithoutHyphens = programId.replace(/-/g, '');
      program = programs.find(p => p.id === idWithoutHyphens);
    }
    
    // If still not found, try the reverse (without hyphens to with hyphens)
    if (!program) {
      // Convert format without hyphens to UUID with hyphens
      const idWithHyphens = programId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      program = programs.find(p => p.id === idWithHyphens);
    }
    
    return program?.name || `Unknown Program (${programId})`;
  }, [programs]);

  // Search and pagination
  const filteredRequirements = useMemo(() => {
    if (!searchTerm) return requirements;
    
    return requirements.filter(requirement => {
      const programName = getProgramName(requirement.program).toLowerCase();
      const minGpa = requirement.min_gpa.toLowerCase();
      const otherRequirements = requirement.other_requirements.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        programName.includes(searchLower) ||
        minGpa.includes(searchLower) ||
        otherRequirements.includes(searchLower)
      );
    });
  }, [requirements, searchTerm, getProgramName]);

  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequirements = filteredRequirements.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchPrograms();
      await fetchRequirements();
    };
    loadData();
  }, [fetchPrograms, fetchRequirements]);

  // Memoized form component
  const RequirementForm = useMemo(() => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="program">Program</Label>
        <Select value={formData.program} onValueChange={(value) => updateFormData('program', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {programsLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">Loading programs...</div>
            ) : (
              programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="min_gpa">Minimum GPA</Label>
        <Input
          id="min_gpa"
          type="number"
          step="0.01"
          placeholder="e.g., 3.00"
          value={formData.min_gpa}
          onChange={(e) => updateFormData('min_gpa', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="other_requirements">Other Requirements</Label>
        <Input
          id="other_requirements"
          placeholder="e.g., SAT score, letters of recommendation, etc."
          value={formData.other_requirements}
          onChange={(e) => updateFormData('other_requirements', e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => updateFormData('is_active', e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="is_active">Is Active</Label>
      </div>
    </div>
  ), [formData, programs, programsLoading, updateFormData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Admission Requirements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Admission Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Admission Requirement</DialogTitle>
            </DialogHeader>
            {RequirementForm}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAdd} 
                disabled={loading || !formData.program || !formData.min_gpa}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Requirement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search admission requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredRequirements.length} of {requirements.length} requirements
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Program</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Min GPA</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Other Requirements</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : currentRequirements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? 'No admission requirements found matching your search.' : 'No admission requirements found'}
                </TableCell>
              </TableRow>
            ) : (
              currentRequirements.map((requirement) => (
                <TableRow key={requirement.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="max-w-xs truncate">
                      {getProgramName(requirement.program)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {requirement.min_gpa || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">
                    {requirement.other_requirements || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      requirement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {requirement.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(requirement)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(requirement.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admission Requirement</DialogTitle>
          </DialogHeader>
          {RequirementForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdate} 
              disabled={loading || !formData.program || !formData.min_gpa}
              className="bg-primarycolor-500 hover:bg-primarycolor-600"
            >
              {loading ? 'Updating...' : 'Update Requirement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdmissionRequirements;