import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';

const RequestMaterial = () => {
    const { user } = useAuth();
    const { addRequest } = useData();
    const navigate = useNavigate();
    const dateRef = useRef(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        category: '',
        requirements: '',
        quantity: '',
        deliveryDate: ''
    });

    const [imageStr, setImageStr] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category || !formData.requirements) return;

        addRequest({
            userId: user.id,
            userName: user.name,
            type: 'material',
            ...formData,
            image: imageStr
        });

        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'deliveryDate' && value && value < today) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageStr(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Request Materials</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category...</option>
                            <option value="plumbing">Plumbing Supplies</option>
                            <option value="electrical">Electrical Supplies</option>
                            <option value="cement">Cement & Sand</option>
                            <option value="paints">Paints & Chemicals</option>
                            <option value="tiles">Tiles & Flooring</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Detailed Requirements</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="Describe brand, specifications, sizes..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity Estimation</label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g. 50 bags, 100 sq ft"
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={18} /> Attach Image (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ padding: '0.5rem 0' }}
                        />
                        {imageStr && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img src={imageStr} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Preferred Delivery Date (Optional)</label>
                        <div className="date-input-wrapper">
                            <span
                                className="date-input-icon"
                                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                title={pickerOpen ? 'Close calendar' : 'Open calendar'}
                                onClick={() => {
                                    if (pickerOpen) {
                                        dateRef.current?.blur();
                                        setPickerOpen(false);
                                    } else {
                                        dateRef.current?.showPicker();
                                        setPickerOpen(true);
                                    }
                                }}
                            >
                                <Calendar size={18} />
                            </span>
                            <input
                                ref={dateRef}
                                type="date"
                                name="deliveryDate"
                                value={formData.deliveryDate}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPickerOpen(false);
                                }}
                                min={today}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    dateRef.current?.focus();
                                    setPickerOpen(false);
                                }}
                                onClick={(e) => e.preventDefault()}
                                onBlur={() => setPickerOpen(false)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default RequestMaterial;
