import { useState, useEffect } from 'react';
import { Eye, UserCheck, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

interface Student {
  id: number;
  passport_number?: string;
  national_id?: string;
  current_level?: string;
  target_countries?: string;
  intended_major?: string;
  targeted_fields?: string;
  created_at?: string;
  user?: {
    id: number;
    email: string;
    is_active: boolean;
  };
}

const Students = () => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    passport_number: '',
    national_id: '',
    current_level: 'high school',
    target_countries: '',
    intended_major: '',
    targeted_fields: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await CallApi.get(backend_path.GET_STUDENTS);
      console.log('Students API response:', res.data);
      
      const studentsData = res.data?.results || res.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetailsDialog = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      passport_number: student.passport_number || '',
      national_id: student.national_id || '',
      current_level: student.current_level || 'high school',
      target_countries: student.target_countries || '',
      intended_major: student.intended_major || '',
      targeted_fields: student.targeted_fields || ''
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      passport_number: '',
      national_id: '',
      current_level: 'high school',
      target_countries: '',
      intended_major: '',
      targeted_fields: ''
    });
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      await CallApi.post(backend_path.ADD_STUDENT, formData);
      toast.success('Student added successfully');
      setAddOpen(false);
      resetForm();
      fetchStudents();
    } catch {
      toast.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedStudent) return;
    try {
      setLoading(true);
      await CallApi.put(`${backend_path.UPDATE_STUDENT}${selectedStudent.id}/`, formData);
      toast.success('Student updated successfully');
      setEditOpen(false);
      setSelectedStudent(null);
      resetForm();
      fetchStudents();
    } catch {
      toast.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      setLoading(true);
      await CallApi.delete(`${backend_path.DELETE_STUDENT}${studentId}/`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Students</h1>
        <div className="flex items-center gap-4">
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Total Students: {students.length}
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passport_number">Passport Number</Label>
                    <Input
                      id="passport_number"
                      value={formData.passport_number}
                      onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="national_id">National ID</Label>
                    <Input
                      id="national_id"
                      value={formData.national_id}
                      onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_level">Current Level</Label>
                    <Select value={formData.current_level} onValueChange={(value) => setFormData({ ...formData, current_level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target_countries">Target Countries</Label>
                    <Input
                      id="target_countries"
                      value={formData.target_countries}
                      onChange={(e) => setFormData({ ...formData, target_countries: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="intended_major">Intended Major</Label>
                    <Input
                      id="intended_major"
                      value={formData.intended_major}
                      onChange={(e) => setFormData({ ...formData, intended_major: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="targeted_fields">Targeted Fields</Label>
                    <Input
                      id="targeted_fields"
                      value={formData.targeted_fields}
                      onChange={(e) => setFormData({ ...formData, targeted_fields: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAdd} 
                  disabled={loading}
                  className="bg-primarycolor-500 hover:bg-primarycolor-600"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Student Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_passport_number">Passport Number</Label>
                  <Input
                    id="edit_passport_number"
                    value={formData.passport_number}
                    onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_national_id">National ID</Label>
                  <Input
                    id="edit_national_id"
                    value={formData.national_id}
                    onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_current_level">Current Level</Label>
                  <Select value={formData.current_level} onValueChange={(value) => setFormData({ ...formData, current_level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high school">High School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_target_countries">Target Countries</Label>
                  <Input
                    id="edit_target_countries"
                    value={formData.target_countries}
                    onChange={(e) => setFormData({ ...formData, target_countries: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit_intended_major">Intended Major</Label>
                  <Input
                    id="edit_intended_major"
                    value={formData.intended_major}
                    onChange={(e) => setFormData({ ...formData, intended_major: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit_targeted_fields">Targeted Fields</Label>
                  <Input
                    id="edit_targeted_fields"
                    value={formData.targeted_fields}
                    onChange={(e) => setFormData({ ...formData, targeted_fields: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdate} 
                disabled={loading}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Updating...' : 'Update Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Student Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Student Details
              </DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Number</label>
                    <p className="text-sm font-semibold">{selectedStudent.passport_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">National ID</label>
                    <p className="text-sm">{selectedStudent.national_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Level</label>
                    <p className="text-sm">{selectedStudent.current_level || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Target Countries</label>
                    <p className="text-sm">{selectedStudent.target_countries || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Intended Major</label>
                    <p className="text-sm">{selectedStudent.intended_major || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Targeted Fields</label>
                    <p className="text-sm">{selectedStudent.targeted_fields || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-sm">
                      {selectedStudent.created_at 
                        ? new Date(selectedStudent.created_at).toLocaleDateString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Passport</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">National ID</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Level</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Target Countries</TableHead>
              <TableHead className="hidden xl:table-cell text-white font-semibold">Major</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No students found</TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {student.passport_number || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {student.national_id || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">
                    {student.current_level || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-700">
                    {student.target_countries || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-gray-700">
                    {student.intended_major || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsDialog(student)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(student)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(student.id)}
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

export default Students;