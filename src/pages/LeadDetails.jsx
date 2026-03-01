import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, Plus, Trash } from 'lucide-react';

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { requests, addQuotation } = useData();

    const request = requests.find(r => r.id === id);

    // Advanced Quote State
    const [lineItems, setLineItems] = useState([{ name: '', qty: '', price: '', total: 0 }]);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [notes, setNotes] = useState('');
    const [validity, setValidity] = useState('');

    if (!request) return <div className="container" style={{ padding: '2rem' }}>Lead not found.</div>;

    const handleLineItemChange = (index, field, value) => {
        const newItems = [...lineItems];
        newItems[index][field] = value;

        // Auto calculate total
        if (field === 'qty' || field === 'price') {
            const qty = parseFloat(newItems[index].qty) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            newItems[index].total = qty * price;
        }

        setLineItems(newItems);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { name: '', qty: '', price: '', total: 0 }]);
    };

    const removeLineItem = (index) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((_, i) => i !== index));
        }
    };

    const calculateGrandTotal = () => {
        const itemsTotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
        return itemsTotal + (parseFloat(deliveryCharge) || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (lineItems.some(i => !i.name || !i.price)) {
            alert('Please fill out all line items.');
            return;
        }

        addQuotation({
            requestId: request.id,
            shopkeeperId: user.id,
            shopkeeperName: user.name || user.shopName,
            items: lineItems,
            deliveryCharge: parseFloat(deliveryCharge),
            totalAmount: calculateGrandTotal(),
            note: notes,
            validity: validity
        });
        alert('Detailed Quotation Sent!');
        navigate('/dashboard');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Request Details</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
                        <div><strong>{request.category}</strong></div>
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Customer</label>
                        <div>{request.userName}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Requirements</label>
                        <p style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>{request.requirements}</p>
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Quantity Needed</label>
                        <div>{request.quantity || 'N/A'}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '2px solid var(--primary-color)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Create Quotation</h3>
                <form onSubmit={handleSubmit}>

                    {/* Line Items */}
                    <h4 style={{ marginBottom: '0.5rem' }}>Items</h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                        {lineItems.map((item, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1.5fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                                <div>
                                    {index === 0 && <label style={{ fontSize: '0.8rem' }}>Item Name</label>}
                                    <input type="text" value={item.name} onChange={(e) => handleLineItemChange(index, 'name', e.target.value)} placeholder="Item" required />
                                </div>
                                <div>
                                    {index === 0 && <label style={{ fontSize: '0.8rem' }}>Qty</label>}
                                    <input type="number" value={item.qty} onChange={(e) => handleLineItemChange(index, 'qty', e.target.value)} placeholder="1" required />
                                </div>
                                <div>
                                    {index === 0 && <label style={{ fontSize: '0.8rem' }}>Price/Unit</label>}
                                    <input type="number" value={item.price} onChange={(e) => handleLineItemChange(index, 'price', e.target.value)} placeholder="0.00" required />
                                </div>
                                <div>
                                    {index === 0 && <label style={{ fontSize: '0.8rem' }}>Total</label>}
                                    <div style={{ padding: '0.5rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
                                        {item.total.toFixed(2)}
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeLineItem(index)} style={{ padding: '0.5rem', color: 'var(--error-color)' }}>
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addLineItem} className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>
                            <Plus size={14} /> Add Item
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem' }}>
                        <div>
                            <div className="form-group">
                                <label>Notes / Terms</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add delivery terms, warranty info..."
                                    rows="4"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <label>Delivery Charges (₹)</label>
                                <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Validity (Optional)</label>
                                <input type="text" value={validity} onChange={(e) => setValidity(e.target.value)} placeholder="e.g. Valid for 7 days" />
                            </div>

                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Subtotal:</span>
                                    <span>{lineItems.reduce((sum, i) => sum + i.total, 0).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Delivery:</span>
                                    <span>{parseFloat(deliveryCharge || 0).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                                    <span>Grand Total:</span>
                                    <span>₹{calculateGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">Send Quotation</button>
                </form>
            </div>
        </div>
    );
};

export default LeadDetails;
