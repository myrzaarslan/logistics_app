"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, User, Mail, Shield } from "lucide-react"
import type { UserRole } from "@/types/user"
import { useToast } from "@/hooks/use-toast"

interface UserManagementProps {
  currentUser: UserRole
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<UserRole[]>([
    {
      id: "1",
      name: "Иван Петров",
      role: "chief_logistician",
      email: "chief@logistics.com",
    },
    {
      id: "2",
      name: "Мария Сидорова",
      role: "logistician",
      email: "maria@logistics.com",
    },
    {
      id: "3",
      name: "Алексей Козлов",
      role: "logistician",
      email: "alex@logistics.com",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "logistician" as const,
    password: "",
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      })
      return
    }

    const user: UserRole = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "logistician", password: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "Успешно",
      description: "Пользователь создан успешно",
    })
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast({
        title: "Ошибка",
        description: "Нельзя удалить собственный аккаунт",
        variant: "destructive",
      })
      return
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId))
    toast({
      title: "Успешно",
      description: "Пользователь удален",
    })
  }

  const getRoleBadge = (role: UserRole["role"]) => {
    return role === "chief_logistician" ? (
      <Badge className="bg-purple-100 text-purple-800">
        <Shield className="h-3 w-3 mr-1" />
        Главный логист
      </Badge>
    ) : (
      <Badge variant="secondary">
        <User className="h-3 w-3 mr-1" />
        Логист
      </Badge>
    )
  }

  // Only chief logistician can access user management
  if (currentUser.role !== "chief_logistician") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Доступ запрещен</p>
            <p className="text-sm text-muted-foreground">Только главный логист может управлять пользователями</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать нового пользователя</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ФИО</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Иван Иванов"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="ivan@logistics.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Введите пароль"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value as "logistician" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistician">Логист</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleCreateUser}>Создать</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список пользователей ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{user.name}</p>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  {user.id !== currentUser.id && (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
