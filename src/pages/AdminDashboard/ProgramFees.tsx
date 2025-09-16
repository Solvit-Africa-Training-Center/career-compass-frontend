import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface ProgramFee {
  id: string;
  program: string;
  tuition_fee: string;
  tuition_amount: string;
  tuition_currency: string;
  application_fee_amount: string;
  deposit_amount: string;
  has_scholarship: boolean;
  scholarship_percent: string;
  is_active: boolean;
}

interface Program {
  id: string;
  name: string;
}

const ProgramFees = () => {
  const [fees, setFees] = useState<ProgramFee[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<ProgramFee | null>(null);
  const [formData, setFormData] = useState({
    program: '',
    tuition_fee: '',
    tuition_amount: '',
    tuition_currency: 'USD',
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
      setFees(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
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
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch programs');
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
        tuition_fee: formData.tuition_fee,
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
    } catch (error: any) {
      console.error('Program fee creation error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
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
        tuition_fee: formData.tuition_fee,
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
    } catch (error: any) {
      console.error('Program fee update error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update program fee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program fee?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_PROGRAM_FEE}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program fee deleted successfully');
      fetchFees();
    } catch (error) {
      toast.error('Failed to delete program fee');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (fee: ProgramFee) => {
    setSelectedFee(fee);
    setFormData({
      program: fee.program,
      tuition_fee: fee.tuition_fee,
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
      tuition_fee: '',
      tuition_amount: '',
      tuition_currency: 'USD',
      application_fee_amount: '',
      deposit_amount: '',
      has_scholarship: false,
      scholarship_percent: '',
      is_active: true
    });
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || programId;
  };

  useEffect(() => {
    fetchFees();
    fetchPrograms();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Fees Management</h1>
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
              <select
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Tuition Amount"
                value={formData.tuition_amount}
                onChange={(e) => setFormData({ ...formData, tuition_amount: e.target.value })}
              />
              <Input
                placeholder="Currency (USD, EUR, etc.)"
                value={formData.tuition_currency}
                onChange={(e) => setFormData({ ...formData, tuition_currency: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Application Fee Amount"
                value={formData.application_fee_amount}
                onChange={(e) => setFormData({ ...formData, application_fee_amount: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Deposit Amount"
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.has_scholarship}
                  onChange={(e) => setFormData({ ...formData, has_scholarship: e.target.checked })}
                  className="rounded"
                />
                <span>Has Scholarship</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddFee} 
                disabled={loading || !formData.program_id}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Fee'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <select
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Tuition Amount"
                value={formData.tuition_amount}
                onChange={(e) => setFormData({ ...formData, tuition_amount: e.target.value })}
              />
              <Input
                placeholder="Currency"
                value={formData.tuition_currency}
                onChange={(e) => setFormData({ ...formData, tuition_currency: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Application Fee Amount"
                value={formData.application_fee_amount}
                onChange={(e) => setFormData({ ...formData, application_fee_amount: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Deposit Amount"
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.has_scholarship}
                  onChange={(e) => setFormData({ ...formData, has_scholarship: e.target.checked })}
                  className="rounded"
                />
                <span>Has Scholarship</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateFee} 
                disabled={loading || !formData.program_id}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            ) : fees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No program fees found</TableCell>
              </TableRow>
            ) : (
              fees.map((fee) => (
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
                      {fee.has_scholarship ? 'Available' : 'None'}
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
    </div>
  );
};

export default ProgramFees;