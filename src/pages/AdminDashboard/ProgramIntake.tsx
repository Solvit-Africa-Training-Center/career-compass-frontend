import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
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

interface ProgramIntake {
  id: string;
  program_id: string;
  start_month: string;
  application_deadline: string;
  seats: number;
  is_open: boolean;
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

const ProgramIntake = () => {
  const [intakes, setIntakes] = useState<ProgramIntake[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<ProgramIntake | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    program_id: '',
    start_month: '',
    application_deadline: '',
    seats: '',
    is_open: true,
    is_active: true
  });

  const fetchIntakes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM_INTAKE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Intakes API response:', res.data);
      setIntakes(res.data || []);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse?.response?.status === 404) {
        toast.error('Program intakes endpoint not available.');
      } else {
        toast.error('Failed to fetch program intakes');
      }
      setIntakes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Programs API response:', res.data);
      setPrograms(res.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to fetch programs');
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  };

  const handleAddIntake = async () => {
    if (!formData.program_id) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.start_month) {
      toast.error('Please enter start month');
      return;
    }
    if (!formData.application_deadline) {
      toast.error('Please enter application deadline');
      return;
    }
    if (!formData.seats || parseInt(formData.seats) <= 0) {
      toast.error('Please enter valid number of seats');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program_id: formData.program_id,
        start_month: formData.start_month,
        application_deadline: formData.application_deadline,
        seats: parseInt(formData.seats),
        is_open: formData.is_open,
        is_active: formData.is_active
      };
      console.log('Sending program intake data:', payload);
      await CallApi.post(backend_path.ADD_PROGRAM_INTAKE, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program intake added successfully');
      setOpen(false);
      resetForm();
      fetchIntakes();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program intake creation error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add program intake');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIntake = async () => {
    if (!selectedIntake) {
      return;
    }
    if (!formData.program_id) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.start_month) {
      toast.error('Please enter start month');
      return;
    }
    if (!formData.application_deadline) {
      toast.error('Please enter application deadline');
      return;
    }
    if (!formData.seats || parseInt(formData.seats) <= 0) {
      toast.error('Please enter valid number of seats');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program_id: formData.program_id,
        program: formData.program_id,
        start_month: formData.start_month,
        application_deadline: formData.application_deadline,
        seats: parseInt(formData.seats),
        is_open: formData.is_open,
        is_active: formData.is_active
      };
      console.log('Updating program intake data:', payload);
      await CallApi.put(`${backend_path.UPDATE_PROGRAM_INTAKE}${selectedIntake.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program intake updated successfully');
      setEditOpen(false);
      setSelectedIntake(null);
      resetForm();
      fetchIntakes();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program intake update error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update program intake');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIntake = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program intake?')) {
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_PROGRAM_INTAKE}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program intake deleted successfully');
      fetchIntakes();
    } catch (error) {
      console.error('Error deleting intake:', error);
      toast.error('Failed to delete program intake');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsDialog = (intake: ProgramIntake) => {
    setSelectedIntake(intake);
    setDetailsOpen(true);
  };

  const openEditDialog = (intake: ProgramIntake) => {
    setSelectedIntake(intake);
    setFormData({
      program_id: intake.program || '',
      start_month: intake.start_month || '',
      application_deadline: intake.application_deadline || '',
      seats: intake.seats.toString() || '',
      is_open: intake.is_open ?? true,
      is_active: intake.is_active ?? true
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program_id: '',
      start_month: '',
      application_deadline: '',
      seats: '',
      is_open: true,
      is_active: true
    });
  };

  const getProgramName = (programId: string | undefined | null) => {
    if (!programId || !programs.length) {
      return 'No Program Assigned';
    }
    
    const program = programs.find(p => p.id === programId || p.id === programId.replace(/-/g, ''));
    return program?.name || `Unknown Program (${programId})`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Filter and search functionality
  const filteredIntakes = useMemo(() => {
    if (!searchTerm) {
      return intakes;
    }
    
    return intakes.filter(intake => {
      const programName = getProgramName(intake.program).toLowerCase();
      const startMonth = intake.start_month.toLowerCase();
      const deadline = formatDate(intake.application_deadline).toLowerCase();
      const seats = intake.seats.toString();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        programName.includes(searchLower) ||
        startMonth.includes(searchLower) ||
        deadline.includes(searchLower) ||
        seats.includes(searchLower)
      );
    });
  }, [intakes, searchTerm, programs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredIntakes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIntakes = filteredIntakes.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Load programs first, then intakes
    const loadData = async () => {
      await fetchPrograms();
      await fetchIntakes();
    };
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Intakes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Program Intake
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Program Intake</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="program_id">Program</Label>
                <Select value={formData.program_id} onValueChange={(value) => setFormData({ ...formData, program_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
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
                <Label htmlFor="start_month">Start Month</Label>
                <Input
                  id="start_month"
                  type="date"
                  value={formData.start_month}
                  onChange={(e) => setFormData({ ...formData, start_month: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="seats">Number of Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  placeholder="Number of seats available"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_open"
                  checked={formData.is_open}
                  onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_open">Is Open for Applications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active">Is Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddIntake} 
                disabled={loading || !formData.program_id || !formData.start_month || !formData.application_deadline || !formData.seats}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Intake'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Program Intake Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Program Intake Details
              </DialogTitle>
            </DialogHeader>
            {selectedIntake && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Program</label>
                    <p className="text-sm font-semibold">{getProgramName(selectedIntake.program)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Month</label>
                    <p className="text-sm">{selectedIntake.start_month}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application Deadline</label>
                    <p className="text-sm">{formatDate(selectedIntake.application_deadline)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Seats</label>
                    <p className="text-sm">{selectedIntake.seats.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs w-fit ${
                        selectedIntake.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedIntake.is_open ? 'Open' : 'Closed'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs w-fit ${
                        selectedIntake.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedIntake.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Program Intake Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program Intake</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_program_id">Program</Label>
                <Select value={formData.program_id} onValueChange={(value) => setFormData({ ...formData, program_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
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
                <Label htmlFor="edit_start_month">Start Month</Label>
                <Input
                  id="edit_start_month"
                  type="date"
                  value={formData.start_month}
                  onChange={(e) => setFormData({ ...formData, start_month: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_application_deadline">Application Deadline</Label>
                <Input
                  id="edit_application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_seats">Number of Seats</Label>
                <Input
                  id="edit_seats"
                  type="number"
                  min="1"
                  placeholder="Number of seats"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_open"
                  checked={formData.is_open}
                  onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit_is_open">Is Open for Applications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit_is_active">Is Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateIntake} 
                disabled={loading || !formData.program_id || !formData.start_month || !formData.application_deadline || !formData.seats}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Updating...' : 'Update'}
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
            placeholder="Search program intakes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredIntakes.length} of {intakes.length} intakes
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Program</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Start Month</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Deadline</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Seats</TableHead>
              <TableHead className="hidden xl:table-cell text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : currentIntakes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? 'No program intakes found matching your search.' : 'No program intakes found'}
                </TableCell>
              </TableRow>
            ) : (
              currentIntakes.map((intake) => (
                <TableRow key={intake.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{getProgramName(intake.program)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{intake.start_month}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{formatDate(intake.application_deadline)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{intake.seats.toLocaleString()}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        intake.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {intake.is_open ? 'Open' : 'Closed'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        intake.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {intake.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsDialog(intake)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(intake)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteIntake(intake.id)}
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
    </div>
  );
};

export default ProgramIntake;