// utils/auth.ts
import { jwtDecode } from 'jwt-decode';


export const isTeacher = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role === 'teacher';
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return false;
    }
};
