import React, { useState } from 'react';

export default function LeadFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profileType: 'Investor',
        interest: '',
        status: 'New'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', phone: '', profileType: 'Investor', interest: '', status: 'New' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="bg-company p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-display font-bold">+ Nuevo Lead</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Ej: Carlos Gómez" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+57 320 000 0000" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Perfil (Buyer Persona)</label>
                        <select name="profileType" value={formData.profileType} onChange={handleChange} className="input-field appearance-none bg-white">
                            <option value="Investor">Inversionista</option>
                            <option value="Merchant">Comerciante</option>
                            <option value="Other">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Interés Principal</label>
                        <input required type="text" name="interest" value={formData.interest} onChange={handleChange} className="input-field" placeholder="Ej: Expandir franquicia, Renta" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-outline px-4 py-2 text-sm">Cancelar</button>
                        <button type="submit" className="btn-primary px-6 py-2 shadow-md">Guardar Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
