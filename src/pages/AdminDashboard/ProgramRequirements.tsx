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

interface ProgramRequirement {
  id: number;
  program: number;
  minimum_gpa: string;
  required_documents: string;
  language_requirements: string;
}

interface Program {
  id: number;
  name: string;
}

interface FormData {
  program: string;
  minimum_gpa: string;
  required_documents: string;
  language_requirements: string;
}

const ProgramRequirements = () => {
  const [requirements, setRequirements] = useState<ProgramRequirement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ProgramRequirement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [formData, setFormData] = useState<FormData>({
    program: '',
    minimum_gpa: '',
    required_documents: '',
    language_requirements: ''
  });

  // Memoized form update function
  const updateFormData = useCallback((field: keyof FormData, value: string) => {
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
      const data = res.data?.results || res.data || [];
      setRequirements(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      console.error('Error fetching requirements:', error);
      if (errorResponse?.response?.status === 404) {
        toast.error('Requirements endpoint not available');
      } else {
        toast.error('Failed to fetch requirements');
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
      minimum_gpa: '',
      required_documents: '',
      language_requirements: ''
    });
  }, []);

  const handleAdd = useCallback(async () => {
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.minimum_gpa) {
      toast.error('Please enter minimum GPA');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: parseInt(formData.program),
        minimum_gpa: formData.minimum_gpa,
        required_documents: formData.required_documents,
        language_requirements: formData.language_requirements
      };
      console.log('Sending requirement data:', payload);
      await CallApi.post(backend_path.ADD_ADMISSION_REQUIREMENT, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Requirement added successfully');
      setOpen(false);
      resetForm();
      fetchRequirements();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Requirement creation error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add requirement');
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
    if (!formData.minimum_gpa) {
      toast.error('Please enter minimum GPA');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: parseInt(formData.program),
        minimum_gpa: formData.minimum_gpa,
        required_documents: formData.required_documents,
        language_requirements: formData.language_requirements
      };
      console.log('Updating requirement data:', payload);
      await CallApi.put(`${backend_path.UPDATE_ADMISSION_REQUIREMENT}${selectedRequirement.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Requirement updated successfully');
      setEditOpen(false);
      setSelectedRequirement(null);
      resetForm();
      fetchRequirements();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Requirement update error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update requirement');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedRequirement, formData, resetForm, fetchRequirements]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_ADMISSION_REQUIREMENT}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Requirement deleted successfully');
      fetchRequirements();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error('Failed to delete requirement');
    } finally {
      setLoading(false);
    }
  }, [fetchRequirements]);

  const openEditDialog = useCallback((requirement: ProgramRequirement) => {
    setSelectedRequirement(requirement);
    setFormData({
      program: requirement.program.toString(),
      minimum_gpa: requirement.minimum_gpa,
      required_documents: requirement.required_documents,
      language_requirements: requirement.language_requirements
    });
    setEditOpen(true);
  }, []);

  // Utility functions
  const getProgramName = useCallback((programId: number) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || `Program ${programId}`;
  }, [programs]);

  // Search and pagination
  const filteredRequirements = useMemo(() => {
    if (!searchTerm) return requirements;
    
    return requirements.filter(requirement => {
      const programName = getProgramName(requirement.program).toLowerCase();
      const minGpa = requirement.minimum_gpa.toLowerCase();
      const documents = requirement.required_documents.toLowerCase();
      const language = requirement.language_requirements.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        programName.includes(searchLower) ||
        minGpa.includes(searchLower) ||
        documents.includes(searchLower) ||
        language.includes(searchLower)
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
                <SelectItem key={program.id} value={program.id.toString()}>
                  {program.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="minimum_gpa">Minimum GPA</Label>
        <Input
          id="minimum_gpa"
          type="number"
          step="0.1"
          placeholder="e.g., 3.0"
          value={formData.minimum_gpa}
          onChange={(e) => updateFormData('minimum_gpa', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="required_documents">Required Documents</Label>
        <Input
          id="required_documents"
          placeholder="e.g., Transcript, Diploma, etc."
          value={formData.required_documents}
          onChange={(e) => updateFormData('required_documents', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="language_requirements">Language Requirements</Label>
        <Input
          id="language_requirements"
          placeholder="e.g., TOEFL 80+, IELTS 6.5+"
          value={formData.language_requirements}
          onChange={(e) => updateFormData('language_requirements', e.target.value)}
        />
      </div>
    </div>
  ), [formData, programs, programsLoading, updateFormData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Requirements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Program Requirement</DialogTitle>
            </DialogHeader>
            {RequirementForm}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAdd} 
                disabled={loading || !formData.program || !formData.minimum_gpa}
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
            placeholder="Search requirements..."
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
              <TableHead className="hidden md:table-cell text-white font-semibold">Documents</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Language</TableHead>
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
                  {searchTerm ? 'No requirements found matching your search.' : 'No requirements found'}
                </TableCell>
              </TableRow>
            ) : (
              currentRequirements.map((requirement) => (
                <TableRow key={requirement.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {getProgramName(requirement.program)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {requirement.minimum_gpa || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">
                    {requirement.required_documents || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">
                    {requirement.language_requirements || 'N/A'}
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
            <DialogTitle>Edit Program Requirement</DialogTitle>
          </DialogHeader>
          {RequirementForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdate} 
              disabled={loading || !formData.program || !formData.minimum_gpa}
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

export default ProgramRequirements;