import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
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
  institution_name?: string;
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      console.log('Institutions data:', res.data);
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
      const payload = {
        institution: formData.institution.replace(/-/g, ''),
        name: formData.name,
        city: formData.city,
        address: formData.address
      };
      console.log('Updating campus data:', payload);
      await CallApi.put(`${backend_path.UPDATE_CAMPUS}${selectedCampus.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campus updated successfully');
      setEditOpen(false);
      setSelectedCampus(null);
      resetForm();
      fetchCampuses();
    } catch (error: any) {
      console.error('Campus update error:', error.response?.data);
      toast.error('Failed to update campus');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampus = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_CAMPUS}${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campus deleted successfully');
      setDeleteOpen(false);
      setDeleteId(null);
      fetchCampuses();
    } catch (error) {
      toast.error('Failed to delete campus');
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = (campus: Campus) => {
    setSelectedCampus(campus);
    setViewOpen(true);
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

  const getInstitutionName = (campus: Campus) => {
    if (campus.institution_name) return campus.institution_name;
    const institutionId = campus.institution;
    const institution = institutions.find(inst => 
      inst.id === institutionId || 
      inst.id === institutionId?.replace(/-/g, '') ||
      inst.id?.replace(/-/g, '') === institutionId?.replace(/-/g, '')
    );
    console.log('Looking for institution:', institutionId, 'Available institutions:', institutions.map(i => i.id), 'Found:', institution);
    return institution?.official_name || 'Unknown Institution';
  };

  const filteredCampuses = useMemo(() => {
    if (!searchTerm) return campuses;
    return campuses.filter(campus => 
      campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getInstitutionName(campus).toLowerCase().includes(searchTerm.toLowerCase()) ||
      campus.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campus.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campuses, searchTerm, institutions]);

  useEffect(() => {
    fetchCampuses();
    fetchInstitutions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Campuses</h1>
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
                Are you sure you want to delete this campus? This action cannot be undone.
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

        {/* View Campus Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Campus Details
              </DialogTitle>
            </DialogHeader>
            {selectedCampus && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Campus Name</label>
                    <p className="text-sm font-semibold">{selectedCampus.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Institution</label>
                    <p className="text-sm">{getInstitutionName(selectedCampus)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-sm">{selectedCampus.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-sm">{selectedCampus.address}</p>
                  </div>
                </div>
              </div>
            )}
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

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredCampuses.length} of {campuses.length} campuses
        </div>
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
            ) : filteredCampuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? 'No campuses found matching your search.' : 'No campuses found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCampuses.map((campus) => (
                <TableRow key={campus.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{campus.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {getInstitutionName(campus)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{campus.city}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{campus.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openViewDialog(campus)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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