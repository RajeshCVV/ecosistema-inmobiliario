import React, { useState } from 'react';

export default function MilestoneFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        dueDate: '',
        status: 'Pendiente'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ title: '', dueDate: '', status: 'Pendiente' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="bg-company p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-display font-bold">+ Añadir Hito</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Entregable</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Ej: Lanzamiento Landing Page" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Entrega</label>
                        <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-field" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="input-field appearance-none bg-white">
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Completado">Completado</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-outline px-4 py-2 text-sm">Cancelar</button>
                        <button type="submit" className="btn-primary px-6 py-2 shadow-md">Guardar Hito</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
