import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Campus {
  id: string;
  institution: string;
  name: string;
  city: string;
  address: string;
}

interface Institution {
  id: string;
  official_name: string;
}

const Campuses = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    name: '',
    city: '',
    address: ''
  });

  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_CAMPUS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampuses(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Campus endpoint not available. Please contact administrator.');
      } else {
        toast.error('Failed to fetch campuses');
      }
      setCampuses([]);
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
      setInstitutions(res.data || []);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error('Institution endpoint not available. Please contact administrator.');
      } else {
        toast.error('Failed to fetch institutions');
      }
      setInstitutions([]);
    }
  };

  const handleAddCampus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('Sending campus data:', formData);
      await CallApi.post(backend_path.ADD_CAMPUS, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campus added successfully');
      setOpen(false);
      resetForm();
      fetchCampuses();
    } catch (error: any) {
      console.error('Campus creation error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add campus');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampus = async () => {
    if (!selectedCampus) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.put(`${backend_path.UPDATE_CAMPUS}${selectedCampus.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campus updated successfully');
      setEditOpen(false);
      setSelectedCampus(null);
      resetForm();
      fetchCampuses();
    } catch (error) {
      toast.error('Failed to update campus');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampus = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campus?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_CAMPUS}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campus deleted successfully');
      fetchCampuses();
    } catch (error) {
      toast.error('Failed to delete campus');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (campus: Campus) => {
    setSelectedCampus(campus);
    setFormData({
      institution: campus.institution,
      name: campus.name,
      city: campus.city,
      address: campus.address
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      name: '',
      city: '',
      address: ''
    });
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    return institution?.official_name || institutionId;
  };

  useEffect(() => {
    fetchCampuses();
    fetchInstitutions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Campuses Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Campus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Campus</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <select
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
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
                placeholder="Campus Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddCampus} 
                disabled={loading || !formData.institution || !formData.name}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Campus'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Campus Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Campus</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <select
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
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
                placeholder="Campus Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateCampus} 
                disabled={loading || !formData.institution || !formData.name}
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
              <TableHead className="text-white font-semibold">Campus Name</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Institution</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">City</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Address</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : campuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No campuses found</TableCell>
              </TableRow>
            ) : (
              campuses.map((campus) => (
                <TableRow key={campus.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{campus.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {getInstitutionName(campus.institution)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{campus.city}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{campus.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(campus)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCampus(campus.id)}
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

export default Campuses;