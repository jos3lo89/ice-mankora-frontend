import { useUser } from "../hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CreditCard,
  CalendarDays,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { getInitials } from "@/utils/getInitials";

const UserProfile = () => {
  const { getUserProfileQuery } = useUser();
  const { data: user, isLoading, isError } = getUserProfileQuery;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Error al cargar perfil</h2>
        <p className="text-muted-foreground">
          No se pudo obtener la información del usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-4 px-4">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="pb-1">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <CardTitle className="text-3xl font-bold">
                  {user.name}
                </CardTitle>
                <div className="flex gap-2">
                  {user.isActive ? (
                    <Badge variant="default">Activo</Badge>
                  ) : (
                    <Badge variant="destructive">Inactivo</Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {user.role.toLowerCase()}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-lg flex items-center gap-2 justify-center md:justify-start">
                @{user.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <User size={20} /> Información Personal
              </h3>
              <div className="grid gap-4 pl-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CreditCard className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      DNI / Documento
                    </p>
                    <p className="font-medium">{user.dni}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Rol de Sistema
                    </p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Clock size={20} /> Actividad de Cuenta
              </h3>
              <div className="grid gap-4 pl-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CalendarDays className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Miembro desde
                    </p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Última actualización
                    </p>
                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
