import { useState, useEffect, useMemo } from 'react';
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

interface ProgramFee {
  id: number;
  tuition_fee: number;
  tuition_amount: string;
  tuition_currency: string;
  application_fee_amount: string;
  deposit_amount: string;
  has_scholarship: boolean;
  scholarship_percent: string;
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

const ProgramFees = () => {
  const [fees, setFees] = useState<ProgramFee[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFee, setSelectedFee] = useState<ProgramFee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    program: '',
    tuition_amount: '',
    tuition_currency: 'RWF',
    application_fee_amount: '',
    deposit_amount: '',
    has_scholarship: false,
    scholarship_percent: '',
    is_active: true
  });

  const fetchFees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM_FEE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fees API response:', res.data);
      setFees(res.data || []);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse?.response?.status === 404) {
        toast.error('Program fees endpoint not available.');
      } else {
        toast.error('Failed to fetch program fees');
      }
      setFees([]);
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

  const handleAddFee = async () => {
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        tuition_amount: formData.tuition_amount,
        tuition_currency: formData.tuition_currency,
        application_fee_amount: formData.application_fee_amount,
        deposit_amount: formData.deposit_amount,
        has_scholarship: formData.has_scholarship,
        scholarship_percent: formData.scholarship_percent,
        is_active: formData.is_active
      };
      console.log('Sending program fee data:', payload);
      await CallApi.post(backend_path.ADD_PROGRAM_FEE, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program fee added successfully');
      setOpen(false);
      resetForm();
      fetchFees();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program fee creation error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add program fee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!selectedFee) return;
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        tuition_amount: formData.tuition_amount,
        tuition_currency: formData.tuition_currency,
        application_fee_amount: formData.application_fee_amount,
        deposit_amount: formData.deposit_amount,
        has_scholarship: formData.has_scholarship,
        scholarship_percent: formData.scholarship_percent,
        is_active: formData.is_active
      };
      console.log('Updating program fee data:', payload);
      await CallApi.put(`${backend_path.UPDATE_PROGRAM_FEE}${selectedFee.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program fee updated successfully');
      setEditOpen(false);
      setSelectedFee(null);
      resetForm();
      fetchFees();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program fee update error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update program fee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = (id: number) => {
    setDeleteId(id.toString());
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_PROGRAM_FEE}${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program fee deleted successfully');
      setDeleteOpen(false);
      setDeleteId(null);
      fetchFees();
    } catch {
      toast.error('Failed to delete program fee');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (fee: ProgramFee) => {
    setSelectedFee(fee);
    setFormData({
      program: fee.program,
      tuition_amount: fee.tuition_amount,
      tuition_currency: fee.tuition_currency,
      application_fee_amount: fee.application_fee_amount,
      deposit_amount: fee.deposit_amount,
      has_scholarship: fee.has_scholarship,
      scholarship_percent: fee.scholarship_percent,
      is_active: fee.is_active
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program: '',
      tuition_amount: '',
      tuition_currency: 'RWF',
      application_fee_amount: '',
      deposit_amount: '',
      has_scholarship: false,
      scholarship_percent: '',
      is_active: true
    });
  };

  const getProgramName = (programId: string) => {
    if (!programs.length) {
      return `Loading... (${programId})`;
    }
    
    // Try to find program by both id formats (with and without hyphens)
    let program = programs.find(p => p.id === programId);
    
    // If not found, try to find by converting the ID format
    if (!program) {
      // Convert UUID with hyphens to format without hyphens
      const idWithoutHyphens = programId.replace(/-/g, '');
      program = programs.find(p => p.id === idWithoutHyphens);
    }
    
    // If still not found, try the reverse (without hyphens to with hyphens)
    if (!program) {
      // Convert format without hyphens to UUID with hyphens
      const idWithHyphens = programId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      program = programs.find(p => p.id === idWithHyphens);
    }
    
    console.log('Looking for program ID:', programId);
    console.log('Available programs:', programs);
    console.log('Found program:', program);
    
    return program?.name || `Unknown Program (${programId})`;
  };

  // Filter and search functionality
  const filteredFees = useMemo(() => {
    if (!searchTerm) return fees;
    
    return fees.filter(fee => {
      const programName = getProgramName(fee.program).toLowerCase();
      const tuitionAmount = fee.tuition_amount.toLowerCase();
      const currency = fee.tuition_currency.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        programName.includes(searchLower) ||
        tuitionAmount.includes(searchLower) ||
        currency.includes(searchLower) ||
        fee.application_fee_amount.includes(searchLower) ||
        fee.deposit_amount.includes(searchLower) ||
        fee.scholarship_percent.includes(searchLower)
      );
    });
  }, [fees, searchTerm, programs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFees = filteredFees.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Load programs first, then fees
    const loadData = async () => {
      await fetchPrograms();
      await fetchFees();
    };
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Fees</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Program Fee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Program Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="program">Program</Label>
                <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
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
                <Label htmlFor="tuition_amount">Tuition Amount</Label>
                <Input
                  id="tuition_amount"
                  type="number"
                  placeholder="Tuition Amount"
                  value={formData.tuition_amount}
                  onChange={(e) => setFormData({ ...formData, tuition_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tuition_currency">Currency</Label>
                <Select value={formData.tuition_currency} onValueChange={(value) => setFormData({ ...formData, tuition_currency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RWF">RWF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="application_fee_amount">Application Fee Amount</Label>
                <Input
                  id="application_fee_amount"
                  type="number"
                  placeholder="Application Fee Amount"
                  value={formData.application_fee_amount}
                  onChange={(e) => setFormData({ ...formData, application_fee_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deposit_amount">Deposit Amount</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  placeholder="Deposit Amount"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="scholarship_percent">Scholarship Percentage</Label>
                <Input
                  id="scholarship_percent"
                  type="number"
                  placeholder="Scholarship Percentage"
                  value={formData.scholarship_percent}
                  onChange={(e) => setFormData({ ...formData, scholarship_percent: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="has_scholarship"
                  checked={formData.has_scholarship}
                  onChange={(e) => setFormData({ ...formData, has_scholarship: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="has_scholarship">Has Scholarship</Label>
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
                onClick={handleAddFee} 
                disabled={loading || !formData.program}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Fee'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete this program fee? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={performDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Program Fee Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_program">Program</Label>
                <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
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
                <Label htmlFor="edit_tuition_amount">Tuition Amount</Label>
                <Input
                  id="edit_tuition_amount"
                  type="number"
                  placeholder="Tuition Amount"
                  value={formData.tuition_amount}
                  onChange={(e) => setFormData({ ...formData, tuition_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_tuition_currency">Currency</Label>
                <Select value={formData.tuition_currency} onValueChange={(value) => setFormData({ ...formData, tuition_currency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RWF">RWF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_application_fee_amount">Application Fee Amount</Label>
                <Input
                  id="edit_application_fee_amount"
                  type="number"
                  placeholder="Application Fee Amount"
                  value={formData.application_fee_amount}
                  onChange={(e) => setFormData({ ...formData, application_fee_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_deposit_amount">Deposit Amount</Label>
                <Input
                  id="edit_deposit_amount"
                  type="number"
                  placeholder="Deposit Amount"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_scholarship_percent">Scholarship Percentage</Label>
                <Input
                  id="edit_scholarship_percent"
                  type="number"
                  placeholder="Scholarship Percentage"
                  value={formData.scholarship_percent}
                  onChange={(e) => setFormData({ ...formData, scholarship_percent: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_has_scholarship"
                  checked={formData.has_scholarship}
                  onChange={(e) => setFormData({ ...formData, has_scholarship: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit_has_scholarship">Has Scholarship</Label>
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
                onClick={handleUpdateFee} 
                disabled={loading || !formData.program}
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
            placeholder="Search program fees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredFees.length} of {fees.length} fees
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Program</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Tuition</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">App Fee</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Deposit</TableHead>
              <TableHead className="hidden xl:table-cell text-white font-semibold">Scholarship</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : currentFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? 'No program fees found matching your search.' : 'No program fees found'}
                </TableCell>
              </TableRow>
            ) : (
              currentFees.map((fee) => (
                <TableRow key={fee.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{getProgramName(fee.program)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {fee.tuition_amount} {fee.tuition_currency}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{fee.application_fee_amount}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{fee.deposit_amount}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      fee.has_scholarship ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {fee.has_scholarship ? `${fee.scholarship_percent}%` : 'None'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(fee)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFee(fee.id)}
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

export default ProgramFees;