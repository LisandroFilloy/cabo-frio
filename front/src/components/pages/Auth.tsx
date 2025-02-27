import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Importing icons from React Icons
import { useAuth } from '@/components/contexts/auth-context'
import { useNavigate } from "react-router-dom";
import { useModal } from "../contexts/modal-context";

export function LoginForm() {
    const navigate = useNavigate();
    // State to toggle password visibility
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [username, setUser] = useState('')
    const [password, setPassword] = useState('')
    const { openModal } = useModal();

    // Toggle the password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const { login } = useAuth();

    const handleLogin = async () => {
        if (username === '' || password === '') {
            return;
        }

        try {
            const loggedIn = await login(username, password);

            if (loggedIn) {
                navigate('/caja')
                openModal();

            } else {
                alert('Credenciales Invalidas')
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-1">
            <Card className="w-full md:max-w-sm max-w-[300px]">
                <CardHeader>
                    {/* <CardTitle className="text-xl">Inicio de sesión</CardTitle> */}
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Usuario</Label>
                        <Input id="email"
                            type="email"
                            placeholder="Usuario"
                            required
                            className="border-gray-2"
                            onChange={(e) => setUser(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                required
                                placeholder="********"
                                className="border-gray-2"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 bg-transparent hover:bg-transparent"
                            >
                                {isPasswordVisible ? (
                                    <FiEyeOff className="w-5 h-5 text-black" />
                                ) : (
                                    <FiEye className="w-5 h-5 text-black" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogin}>Iniciar sesión</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginForm;
