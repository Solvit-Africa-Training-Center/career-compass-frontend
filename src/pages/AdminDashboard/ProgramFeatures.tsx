import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface ProgramFeature {
  id: string;
  program_id: string;
  features: string;
}

interface Program {
  id: string;
  name: string;
}

const ProgramFeatures = () => {
  const [features, setFeatures] = useState<ProgramFeature[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<ProgramFeature | null>(null);
  const [formData, setFormData] = useState({
    program_id: '',
    features: ''
  });

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_FEATURE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeatures(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Program features endpoint not available.');
      } else {
        toast.error('Failed to fetch program features');
      }
      setFeatures([]);
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

  const handleAddFeature = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.post(backend_path.ADD_FEATURE, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program feature added successfully');
      setOpen(false);
      resetForm();
      fetchFeatures();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add program feature');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeature = async () => {
    if (!selectedFeature) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.put(`${backend_path.UPDATE_FEATURE}${selectedFeature.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program feature updated successfully');
      setEditOpen(false);
      setSelectedFeature(null);
      resetForm();
      fetchFeatures();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update program feature');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program feature?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_FEATURE}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program feature deleted successfully');
      fetchFeatures();
    } catch (error) {
      toast.error('Failed to delete program feature');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (feature: ProgramFeature) => {
    setSelectedFeature(feature);
    setFormData({
      program_id: feature.program_id,
      features: feature.features
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program_id: '',
      features: ''
    });
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || programId;
  };

  useEffect(() => {
    fetchFeatures();
    fetchPrograms();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Features Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Program Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Program Feature</DialogTitle>
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
              <textarea
                placeholder="Features (e.g., Online Learning, Industry Partnerships, etc.)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddFeature} 
                disabled={loading || !formData.program_id || !formData.features}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Feature'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program Feature</DialogTitle>
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
              <textarea
                placeholder="Features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateFeature} 
                disabled={loading || !formData.program_id || !formData.features}
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
              <TableHead className="hidden sm:table-cell text-white font-semibold">Features</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : features.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">No program features found</TableCell>
              </TableRow>
            ) : (
              features.map((feature) => (
                <TableRow key={feature.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{getProgramName(feature.program_id)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{feature.features}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(feature)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFeature(feature.id)}
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

export default ProgramFeatures;