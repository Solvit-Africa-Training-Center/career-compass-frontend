import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface AdmissionRequirement {
  id: string;
  program_id: string;
  min_gpa: number;
  other_requirements: string;
}

interface Program {
  id: string;
  name: string;
}

const AdmissionRequirements = () => {
  const [requirements, setRequirements] = useState<AdmissionRequirement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<AdmissionRequirement | null>(null);
  const [formData, setFormData] = useState({
    program_id: '',
    min_gpa: '',
    other_requirements: ''
  });

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_ADMISSION_REQUIREMENT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequirements(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Admission requirements endpoint not available.');
      } else {
        toast.error('Failed to fetch admission requirements');
      }
      setRequirements([]);
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

  const handleAddRequirement = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        ...formData,
        min_gpa: parseFloat(formData.min_gpa) || 0
      };
      await CallApi.post(backend_path.ADD_ADMISSION_REQUIREMENT, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admission requirement added successfully');
      setOpen(false);
      resetForm();
      fetchRequirements();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add admission requirement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequirement = async () => {
    if (!selectedRequirement) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        ...formData,
        min_gpa: parseFloat(formData.min_gpa) || 0
      };
      await CallApi.put(`${backend_path.UPDATE_ADMISSION_REQUIREMENT}${selectedRequirement.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admission requirement updated successfully');
      setEditOpen(false);
      setSelectedRequirement(null);
      resetForm();
      fetchRequirements();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update admission requirement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequirement = async (id: string) => {
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
      toast.error('Failed to delete admission requirement');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (requirement: AdmissionRequirement) => {
    setSelectedRequirement(requirement);
    setFormData({
      program_id: requirement.program_id,
      min_gpa: requirement.min_gpa.toString(),
      other_requirements: requirement.other_requirements
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program_id: '',
      min_gpa: '',
      other_requirements: ''
    });
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || programId;
  };

  useEffect(() => {
    fetchRequirements();
    fetchPrograms();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Admission Requirements Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Admission Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Admission Requirement</DialogTitle>
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
                step="0.1"
                placeholder="Minimum GPA (e.g., 3.0)"
                value={formData.min_gpa}
                onChange={(e) => setFormData({ ...formData, min_gpa: e.target.value })}
              />
              <textarea
                placeholder="Other Requirements (e.g., SAT score, letters of recommendation, etc.)"
                value={formData.other_requirements}
                onChange={(e) => setFormData({ ...formData, other_requirements: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddRequirement} 
                disabled={loading || !formData.program_id}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Requirement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Admission Requirement</DialogTitle>
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
                step="0.1"
                placeholder="Minimum GPA"
                value={formData.min_gpa}
                onChange={(e) => setFormData({ ...formData, min_gpa: e.target.value })}
              />
              <textarea
                placeholder="Other Requirements"
                value={formData.other_requirements}
                onChange={(e) => setFormData({ ...formData, other_requirements: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateRequirement} 
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
              <TableHead className="hidden sm:table-cell text-white font-semibold">Min GPA</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Other Requirements</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : requirements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">No admission requirements found</TableCell>
              </TableRow>
            ) : (
              requirements.map((requirement) => (
                <TableRow key={requirement.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{getProgramName(requirement.program_id)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{requirement.min_gpa}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{requirement.other_requirements}</TableCell>
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
                        onClick={() => handleDeleteRequirement(requirement.id)}
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

export default AdmissionRequirements;