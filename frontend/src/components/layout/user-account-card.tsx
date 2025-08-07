"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { usersApi } from "@/lib/users"
import { User as UserType} from "@/types/types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface UserAccountCardProps {
  user: UserType | null 
}

export function UserAccountCard({ user }: UserAccountCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [roleToConfirm, setRoleToConfirm] = useState<"viewer" | "admin" | "organiser" | null>(null)
  const [reason, setReason] = useState("")

  const queryClient = useQueryClient()

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: "viewer" | "admin" | "organiser" }) =>
      usersApi.updateUserRole(userId, newRole),
    onMutate: () => {
      setIsUpdating(true)
    },
    onSuccess: (_updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success(`${_updatedUser.name}'s role has been updated to ${_updatedUser.role}.`)
    },
    onError: () => {
      toast.error("Failed to update user role. Please try again.")
    },
    onSettled: () => {
      setIsUpdating(false)
      setShowConfirmDialog(false)
      setRoleToConfirm(null)
      setReason("")
    },
  })

  const handleRoleChange = (newRole: "viewer" | "admin" | "organiser") => {
    if (!user || newRole === user.role) return
    setRoleToConfirm(newRole)
    setShowConfirmDialog(true)
  }

  const confirmRoleUpdate = () => {
    if (user && roleToConfirm) {
      updateRoleMutation.mutate({ userId: user.id, newRole: roleToConfirm })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "organiser":
      case "admin":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "organiser":
        return "text-blue-600"
      case "admin":
        return "text-green-600"
      case "viewer":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  if (!user) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-lg text-gray-500">No user data</h3>
            <p className="text-sm text-gray-400">This is a placeholder for missing user info.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            {/* User Info */}
            <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{user.name}</h3>
              <Badge variant={getRoleBadgeVariant(user.role)} className={getRoleColor(user.role)}>
                {user.role}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>
          {/* Role Selector */}
          <div className="ml-4">
            <Select value={user.role} onValueChange={handleRoleChange} disabled={isUpdating}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="organiser">Organiser</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change for {user.name}</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's role to{" "}
              <span className="font-semibold text-foreground">{roleToConfirm}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for change (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., User requested access, new team member"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={confirmRoleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
