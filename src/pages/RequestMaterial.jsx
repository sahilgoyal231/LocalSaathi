import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const RequestMaterial = () => {
    const { user } = useAuth();
    const { addRequest } = useData();
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        category: '',
        requirements: '',
        quantity: '',
        deliveryDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category || !formData.requirements) return;

        addRequest({
            userId: user.id,
            userName: user.name,
            type: 'material',
            ...formData
        });

        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'deliveryDate' && value && value < today) return;
        setFormData({ ...formData, [name]: value });
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
                        <label>Preferred Delivery Date (Optional)</label>
                        <div className="date-input-wrapper">
                            <span className="date-input-icon"><Calendar size={18} /></span>
                            <input
                                type="date"
                                name="deliveryDate"
                                value={formData.deliveryDate}
                                onChange={handleChange}
                                min={today}
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
