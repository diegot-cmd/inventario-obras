'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  role: string;
  estado: string;
  creado_en: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('success');
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    role: 'Trabajador'
  });

  // Estado para reseteo de contraseña
  const [resetModal, setResetModal] = useState<{ open: boolean; usuario: Usuario | null }>({
    open: false,
    usuario: null
  });
  const [nuevaPassword, setNuevaPassword] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      
      if (res.status === 403) {
        setMensajeTipo('error');
        setMensaje('No tienes permisos para ver esta página');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      const data = await res.json();
      
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        setMensajeTipo('error');
        setMensaje(data.error || 'Error al cargar usuarios');
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setMensajeTipo('error');
      setMensaje('Error de conexión');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let res;
      
      if (editId !== null) {
        // Actualizar usuario (sin password)
        const { password, ...dataWithoutPassword } = form;
        res = await fetch(`/api/usuarios/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataWithoutPassword)
        });
      } else {
        // Crear nuevo usuario
        res = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }

      const data = await res.json();

      if (res.ok) {
        setMensajeTipo('success');
        setMensaje(editId !== null ? '✅ Usuario actualizado correctamente' : '✅ Usuario creado correctamente');
        setForm({ nombre: '', email: '', password: '', role: 'Trabajador' });
        setEditId(null);
        fetchUsuarios();
      } else {
        setMensajeTipo('error');
        setMensaje('❌ ' + (data.error || 'Error al guardar usuario'));
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setMensajeTipo('error');
      setMensaje('⚠️ Error de conexión');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditId(usuario.id_usuario);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      role: usuario.role
    });
  };

  const handleDelete = async (id: number) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMensajeTipo('success');
        setMensaje('✅ Usuario eliminado correctamente');
        fetchUsuarios();
      } else {
        setMensajeTipo('error');
        setMensaje('❌ ' + (data.error || 'No se pudo eliminar el usuario'));
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setMensajeTipo('error');
      setMensaje('⚠️ Error al intentar eliminar');
    }
  };

  const handleResetPassword = async () => {
    if (!resetModal.usuario || !nuevaPassword) {
      setMensajeTipo('error');
      setMensaje('❌ Ingresa una nueva contraseña');
      return;
    }

    if (nuevaPassword.length < 6) {
      setMensajeTipo('error');
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await fetch('/api/usuarios/resetear-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: resetModal.usuario.id_usuario,
          nueva_password: nuevaPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMensajeTipo('success');
        setMensaje('✅ Contraseña actualizada correctamente');
        setResetModal({ open: false, usuario: null });
        setNuevaPassword('');
      } else {
        setMensajeTipo('error');
        setMensaje('❌ ' + (data.error || 'Error al resetear contraseña'));
      }
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      setMensajeTipo('error');
      setMensaje('⚠️ Error de conexión');
    }
  };

  const handleCambiarEstado = async (id_usuario: number, nuevo_estado: string) => {
    try {
      const res = await fetch('/api/usuarios/cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, nuevo_estado })
      });

      const data = await res.json();

      if (res.ok) {
        setMensajeTipo('success');
        setMensaje(`✅ Usuario ${nuevo_estado === 'aprobado' ? 'aprobado' : 'rechazado'} correctamente`);
        fetchUsuarios();
      } else {
        setMensajeTipo('error');
        setMensaje('❌ ' + (data.error || 'Error al cambiar estado'));
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensajeTipo('error');
      setMensaje('⚠️ Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Inicio
            </button>
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">👤</span>
            {editId !== null ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">Nombre Completo</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-black font-medium mb-2">Correo Electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@ejemplo.com"
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {editId === null && (
              <div>
                <label className="block text-black font-medium mb-2">Contraseña</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required={editId === null}
                  minLength={6}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-black font-medium mb-2">Rol</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="Trabajador">Trabajador</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                {editId !== null ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ nombre: '', email: '', password: '', role: 'Trabajador' });
                  }}
                  className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Cancelar
                </button>
              )}
            </div>

            {mensaje && (
              <div
                className={`md:col-span-2 p-4 rounded-xl ${
                  mensajeTipo === 'success'
                    ? 'bg-green-100 border border-green-300 text-green-800'
                    : 'bg-red-100 border border-red-300 text-red-800'
                }`}
              >
                {mensaje}
              </div>
            )}
          </form>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">👥</span>
            Lista de Usuarios
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="text-gray-600 mt-4">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-gray-600 text-lg">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-black">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Nombre</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Rol</th>
                    <th className="text-left py-4 px-4 font-semibold">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold">Fecha Registro</th>
                    <th className="text-left py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{usuario.nombre}</td>
                      <td className="py-4 px-4 text-gray-600">{usuario.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            usuario.role === 'Admin'
                              ? 'bg-black text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {usuario.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            usuario.estado === 'aprobado'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : usuario.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {usuario.estado === 'aprobado' ? '✅ Aprobado' : usuario.estado === 'pendiente' ? '⏳ Pendiente' : '❌ Rechazado'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(usuario.creado_en).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          {usuario.estado === 'pendiente' && (
                            <>
                              <button
                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'aprobado')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                title="Aprobar usuario"
                              >
                                ✓ Aprobar
                              </button>
                              <button
                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'rechazado')}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                title="Rechazar usuario"
                              >
                                ✗ Rechazar
                              </button>
                            </>
                          )}
                          {usuario.estado === 'rechazado' && (
                            <button
                              onClick={() => handleCambiarEstado(usuario.id_usuario, 'aprobado')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                              title="Aprobar usuario"
                            >
                              ✓ Aprobar
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setResetModal({ open: true, usuario })}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Resetear
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id_usuario)}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Reseteo de Contraseña */}
      {resetModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-4">Resetear Contraseña</h3>
            <p className="text-gray-600 mb-6">
              Usuario: <span className="font-semibold text-black">{resetModal.usuario?.nombre}</span>
            </p>

            <div className="mb-6">
              <label className="block text-black font-medium mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleResetPassword}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setResetModal({ open: false, usuario: null });
                  setNuevaPassword('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
