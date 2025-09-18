import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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

interface ProgramFeature {
  id: string;
  program: string;
  features: string;
  is_active: boolean;
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

const ProgramFeatures = () => {
  const [features, setFeatures] = useState<ProgramFeature[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<ProgramFeature | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    program: '',
    features: '',
    is_active: true
  });

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_FEATURE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('Features API response:', res.data);
      setFeatures(res.data || []);
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse?.response?.status === 404) {
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
      setProgramsLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GET_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('Programs API response:', res.data);
      setPrograms(res.data || []);
    } catch {
      toast.error('Failed to fetch programs');
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  };

  const handleAddFeature = async () => {
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.features.trim()) {
      toast.error('Please enter features');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        features: formData.features.trim(),
        is_active: formData.is_active
      };
      // console.log('Sending program feature data:', payload);
      await CallApi.post(backend_path.ADD_FEATURE, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program feature added successfully');
      setOpen(false);
      resetForm();
      fetchFeatures();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program feature creation error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
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
    if (!formData.program) {
      toast.error('Please select a program');
      return;
    }
    if (!formData.features.trim()) {
      toast.error('Please enter features');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const payload = {
        program: formData.program,
        features: formData.features.trim(),
        is_active: formData.is_active
      };
      console.log('Updating program feature data:', payload);
      await CallApi.put(`${backend_path.UPDATE_FEATURE}${selectedFeature.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Program feature updated successfully');
      setEditOpen(false);
      setSelectedFeature(null);
      resetForm();
      fetchFeatures();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      console.error('Program feature update error:', errorResponse.response?.data);
      if (errorResponse?.response?.status === 400) {
        const errorMsg = errorResponse.response?.data?.detail || errorResponse.response?.data?.message || 'Invalid data provided';
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
    } catch {
      toast.error('Failed to delete program feature');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (feature: ProgramFeature) => {
    setSelectedFeature(feature);
    setFormData({
      program: feature.program || '',
      features: feature.features || '',
      is_active: feature.is_active ?? true
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      program: '',
      features: '',
      is_active: true
    });
  };

  const getProgramName = (programId: string | undefined | null) => {
    // Handle null, undefined, or empty programId
    if (!programId) {
      return 'No Program Assigned';
    }
    
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
    
    return program?.name || `Unknown Program (${programId})`;
  };

  // Filter and search functionality
  const filteredFeatures = useMemo(() => {
    if (!searchTerm) return features;
    
    return features.filter(feature => {
      const programName = getProgramName(feature.program).toLowerCase();
      const featuresText = (feature.features || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        programName.includes(searchLower) ||
        featuresText.includes(searchLower)
      );
    });
  }, [features, searchTerm, programs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeatures = filteredFeatures.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Load programs first, then features
    const loadData = async () => {
      await fetchPrograms();
      await fetchFeatures();
    };
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Program Features</h1>
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
                <Label htmlFor="features">Features</Label>
                <Textarea
                  id="features"
                  placeholder="Features (e.g., Online Learning, Industry Partnerships, etc.)"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="h-20 resize-none"
                />
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
                onClick={handleAddFeature} 
                disabled={loading || !formData.program || !formData.features.trim()}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add Feature'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Program Feature Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Program Feature</DialogTitle>
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
                <Label htmlFor="edit_features">Features</Label>
                <Textarea
                  id="edit_features"
                  placeholder="Features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="h-20 resize-none"
                />
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
                onClick={handleUpdateFeature} 
                disabled={loading || !formData.program || !formData.features.trim()}
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
            placeholder="Search program features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredFeatures.length} of {features.length} features
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Program</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Features</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : currentFeatures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchTerm ? 'No program features found matching your search.' : 'No program features found'}
                </TableCell>
              </TableRow>
            ) : (
              currentFeatures.map((feature) => (
                <TableRow key={feature.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{getProgramName(feature.program)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{feature.features || 'No features'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feature.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feature.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
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

export default ProgramFeatures;