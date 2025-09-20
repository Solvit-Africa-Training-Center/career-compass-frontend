import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Institution {
  id: string;
  official_name: string;
  aka: string;
  type: string;
  country: string;
  website: string;
  is_verified: boolean;
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState({
    official_name: '',
    aka: '',
    type: '',
    country: '',
    website: '',
    is_verified: false
  });

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('Sending institution data:', formData);
      await CallApi.post(backend_path.ADD_INSTITUTION, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Institution added successfully');
      setOpen(false);
      resetForm();
      fetchInstitutions();
    } catch (error: any) {
      console.error('Institution creation error:', error.response?.data);
      if (error?.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to add institution');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstitution = async () => {
    if (!selectedInstitution) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.put(`${backend_path.UPDATE_INSTITUTION}${selectedInstitution.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Institution updated successfully');
      setEditOpen(false);
      setSelectedInstitution(null);
      resetForm();
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to update institution');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    if (!confirm('Are you sure you want to delete this institution?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_INSTITUTION}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Institution deleted successfully');
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to delete institution');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (institution: Institution) => {
    setSelectedInstitution(institution);
    setFormData({
      official_name: institution.official_name,
      aka: institution.aka,
      type: institution.type,
      country: institution.country,
      website: institution.website,
      is_verified: institution.is_verified
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      official_name: '',
      aka: '',
      type: '',
      country: '',
      website: '',
      is_verified: false
    });
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Institutions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Institution</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Official Name"
                value={formData.official_name}
                onChange={(e) => setFormData({ ...formData, official_name: e.target.value })}
              />
              <Input
                placeholder="Also Known As (AKA)"
                value={formData.aka}
                onChange={(e) => setFormData({ ...formData, aka: e.target.value })}
              />
              <Input
                placeholder="Type (University, College, etc.)"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <Input
                placeholder="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="rounded"
                />
                <span>Verified Institution</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddInstitution} 
                disabled={loading || !formData.official_name}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Institution'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Institution Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Institution</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Official Name"
                value={formData.official_name}
                onChange={(e) => setFormData({ ...formData, official_name: e.target.value })}
              />
              <Input
                placeholder="Also Known As (AKA)"
                value={formData.aka}
                onChange={(e) => setFormData({ ...formData, aka: e.target.value })}
              />
              <Input
                placeholder="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <Input
                placeholder="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="rounded"
                />
                <span>Verified Institution</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateInstitution} 
                disabled={loading || !formData.official_name}
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
              <TableHead className="text-white font-semibold">Official Name</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">AKA</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Type</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Country</TableHead>
              <TableHead className="hidden xl:table-cell text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : institutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No institutions found</TableCell>
              </TableRow>
            ) : (
              institutions.map((institution) => (
                <TableRow key={institution.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{institution.official_name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{institution.aka || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{institution.type}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">{institution.country}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      institution.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {institution.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(institution)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteInstitution(institution.id)}
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

export default Institutions;