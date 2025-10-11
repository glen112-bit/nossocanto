// client/src/pages/UploadPage.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import UploadForm from '../../components/UploadForm'; // Assumindo que você o salvou em components

export default function UploadPage() {
    const { isAuthenticated, loading } = useAuth();
    
    // Se ainda estiver carregando a autenticação, mostre um loader
    if (loading) return <div>Carregando...</div>;
    
    // 🛑 Protege a rota: redireciona para login se não estiver autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="page-content">
            <h2>Compartilhar Mídia</h2>
            <UploadForm />
        </div>
    );
}
