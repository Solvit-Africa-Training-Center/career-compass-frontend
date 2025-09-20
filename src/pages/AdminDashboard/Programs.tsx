import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Program {
  id: string;
  institution: string;
  name: string;
  description: string;
  duration: string;
  language: string;
}

interface Institution {
  id: string;
  official_name: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    institution_id: '',
    name: '',
    description: '',
    duration: '',
    language: '',
    is_active: true
  });

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Program endpoint not available. Please contact administrator.');
      } else {
        toast.error('Failed to fetch programs');
      }
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_INSTITUTION, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstitutions(res.data);
    } catch (error) {
      toast.error('Failed to fetch institutions');
    }
  };

  const handleAddProgram = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        institution_id: formData.institution_id,
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration) || 0,
        language: formData.language,
        is_active: formData.is_active,
        institution: formData.institution_id
      };
      console.log('Sending program data:', payload);
      await CallApi.post(backend_path.ADD_PROGRAM, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program added successfully');
      setOpen(false);
      resetForm();
      fetchPrograms();
    } catch (error: any) {
      console.error('Program creation error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add program');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        institution_id: formData.institution_id,
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration) || 0,
        language: formData.language,
        is_active: formData.is_active,
        institution: formData.institution_id
      };
      console.log('Updating program data:', payload);
      await CallApi.put(`${backend_path.UPDATE_PROGRAM}${selectedProgram.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program updated successfully');
      setEditOpen(false);
      setSelectedProgram(null);
      resetForm();
      fetchPrograms();
    } catch (error: any) {
      console.error('Program update error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to update program');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_PROGRAM}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program deleted successfully');
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to delete program');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      institution_id: program.institution,
      name: program.name,
      description: program.description,
      duration: program.duration,
      language: program.language,
      is_active: true
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      institution_id: '',
      name: '',
      description: '',
      duration: '',
      language: '',
      is_active: true
    });
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    return institution?.official_name || institutionId;
  };

  useEffect(() => {
    fetchPrograms();
    fetchInstitutions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Programs</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <select
                value={formData.institution_id}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                className="w-full p-2 border rounded-md"
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
              <Input
                type="number"
                placeholder="Duration (in months)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <Input
                placeholder="Language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span>Active Program</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddProgram} 
                disabled={loading || !formData.institution_id || !formData.name}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Program'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Program Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <select
                value={formData.institution_id}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                className="w-full p-2 border rounded-md"
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md h-20 resize-none"
              />
              <Input
                type="number"
                placeholder="Duration (in months)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <Input
                placeholder="Language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span>Active Program</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateProgram} 
                disabled={loading || !formData.institution_id || !formData.name}
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
              <TableHead className="text-white font-semibold">Program Name</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Institution</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Duration</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Language</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No programs found</TableCell>
              </TableRow>
            ) : (
              programs.map((program) => (
                <TableRow key={program.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{program.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {getInstitutionName(program.institution_id || program.institution)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{program.duration}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{program.language}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(program)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProgram(program.id)}
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

export default Programs;