import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_verified: boolean;
  roles: { id: number; name: string; code: string }[];
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [editData, setEditData] = useState({ email: '' });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.GETUSERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await CallApi.get(backend_path.ROLE_LIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(res.data);
    } catch (error) {
      toast.error('Failed to fetch roles');
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.post(backend_path.REGISTER, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User added successfully');
      setOpen(false);
      setFormData({ email: '', password: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.put(`${backend_path.UPDATE_USER}${selectedUser.id}/`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated successfully');
      setEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteId(userId);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.delete(`${backend_path.DELETE_USER}${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      setDeleteOpen(false);
      setDeleteId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await CallApi.post(backend_path.ASSIGN_ROLE, {
        user_id: selectedUser.id,
        role_ids: selectedRoles
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Roles assigned successfully');
      setRoleOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to assign roles');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditData({ email: user.email });
    setEditOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map(r => r.id));
    setRoleOpen(true);
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primarycolor-500">Users</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-600 text-white">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddUser} 
                disabled={loading || !formData.email || !formData.password}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Adding...' : 'Add User'}
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
                Are you sure you want to delete this user? This action cannot be undone.
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

        {/* Edit User Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={editData.email}
                onChange={(e) => setEditData({ email: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateUser} 
                disabled={loading || !editData.email}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Roles Dialog */}
        <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Roles</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role.id]);
                      } else {
                        setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{role.name}</span>
                </label>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAssignRoles} 
                disabled={loading}
                className="bg-primarycolor-500 hover:bg-primarycolor-600"
              >
                {loading ? 'Assigning...' : 'Assign Roles'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primarycolor-500 hover:bg-primarycolor-500">
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="hidden sm:table-cell text-white font-semibold">Roles</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-white font-semibold">Verified</TableHead>
              <TableHead className="hidden xl:table-cell text-white font-semibold">Created</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">
                    {user.roles?.map(role => role.name).join(', ') || 'No roles'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-gray-700">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(user)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRoleDialog(user)}
                        className="h-8 w-8 p-0"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
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

export default Users;
