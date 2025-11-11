import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  searchTerm: string;
  openEditDialog: (user: any, buttonRef?: HTMLButtonElement) => void;
  handleDeleteUser: (userId: string) => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700 border-red-200";
    case "MANAGEMENT":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "MERCHANDISER":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "CAD":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "SAMPLE_FABRIC":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "SAMPLE_ROOM":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function UserTable({
  users,
  isLoading,
  searchTerm,
  openEditDialog,
  handleDeleteUser,
  pagination,
  onPageChange,
}: UserTableProps) {
  return (
    <Card className="bg-gradient-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-accent" />
          <span>Users ({users?.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="min-w-full text-center flex items-center justify-center">
            Loading users...
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => (
              <TableRow key={user?.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-medium capitalize">
                        {user?.userName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="text-sm text-muted-foreground">
                    {user?.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getRoleBadgeColor(user?.role)}
                  >
                    {user?.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user?.phoneNumber}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => openEditDialog(user, e.currentTarget)}
                    >
                      <Edit className="h-4 w-4 text-green-500" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will
                            permanently delete the user account and remove all
                            associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user?.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && users?.length === 0 && (
          <div>
            No users found
            {searchTerm ? ` for "${searchTerm}"` : ""}.
          </div>
        )}
        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                onPageChange && onPageChange(pagination.currentPage - 1)
              }
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                onPageChange && onPageChange(pagination.currentPage + 1)
              }
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
