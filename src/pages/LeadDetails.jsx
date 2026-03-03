import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, Plus, Trash, Image as ImageIcon } from 'lucide-react';
import logoImg from '../assets/logo.png';

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { requests, addQuotation } = useData();

    const request = requests.find(r => r.id === id);

    // Advanced Quote State
    const [quoteType, setQuoteType] = useState('manual'); // 'manual' or 'image'
    const [lineItems, setLineItems] = useState([{ name: '', qty: '', price: '', total: 0 }]);
    const [imageQuoteTotal, setImageQuoteTotal] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [notes, setNotes] = useState('');
    const [validity, setValidity] = useState('');
    const [quotationImage, setQuotationImage] = useState(null);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuotationImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateGrandTotal = () => {
        const baseTotal = quoteType === 'manual'
            ? lineItems.reduce((sum, item) => sum + (item.total || 0), 0)
            : (parseFloat(imageQuoteTotal) || 0);

        return baseTotal + (parseFloat(deliveryCharge) || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (quoteType === 'manual' && lineItems.some(i => !i.name || !i.price)) {
            alert('Please fill out all line items.');
            return;
        }

        if (quoteType === 'image' && !quotationImage) {
            alert('Please upload a quotation image.');
            return;
        }

        if (quoteType === 'image' && (!imageQuoteTotal || parseFloat(imageQuoteTotal) <= 0)) {
            alert('Please enter the total quotation amount.');
            return;
        }

        addQuotation({
            requestId: request.id,
            shopkeeperId: user.id,
            shopkeeperName: user.name || user.shopName,
            items: quoteType === 'manual' ? lineItems : [],
            deliveryCharge: parseFloat(deliveryCharge),
            totalAmount: calculateGrandTotal(),
            note: notes,
            validity: validity,
            image: quotationImage
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
                    {request.image && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Attached Image</label>
                            <a href={request.image} target="_blank" rel="noopener noreferrer">
                                <img src={request.image} alt="Request Attachment" onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }} />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ border: '2px solid var(--primary-color)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Create Quotation</h3>

                {/* Toggle Input Type */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--surface-color)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                    <div
                        onClick={() => setQuoteType('manual')}
                        style={{
                            flex: 1, textAlign: 'center', padding: '0.75rem', cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            background: quoteType === 'manual' ? 'var(--primary-color)' : 'transparent',
                            color: quoteType === 'manual' ? '#fff' : 'var(--text-primary)',
                            fontWeight: quoteType === 'manual' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        Manual Line Items
                    </div>
                    <div
                        onClick={() => setQuoteType('image')}
                        style={{
                            flex: 1, textAlign: 'center', padding: '0.75rem', cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            background: quoteType === 'image' ? 'var(--primary-color)' : 'transparent',
                            color: quoteType === 'image' ? '#fff' : 'var(--text-primary)',
                            fontWeight: quoteType === 'image' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        Upload Bill/Quote Image
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Conditional Rendering based on Quote Type */}
                    {quoteType === 'manual' ? (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Items</h4>
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
                    ) : (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)' }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1rem' }}>
                                    <ImageIcon size={20} /> Upload Quotation Image / Bill *
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ padding: '0.5rem 0' }}
                                    required={quoteType === 'image'}
                                />
                                {quotationImage && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <img src={quotationImage} alt="Preview" onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain', border: '1px solid var(--border-color)' }} />
                                    </div>
                                )}
                            </div>
                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label>Total Quotation Amount (₹) *</label>
                                <input
                                    type="number"
                                    value={imageQuoteTotal}
                                    onChange={(e) => setImageQuoteTotal(e.target.value)}
                                    placeholder="Enter total amount mentioned in the bill"
                                    required={quoteType === 'image'}
                                />
                            </div>
                        </div>
                    )}

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
                                <label>Delivery Charges (₹) (Optional)</label>
                                <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Validity (Optional)</label>
                                <input type="text" value={validity} onChange={(e) => setValidity(e.target.value)} placeholder="e.g. Valid for 7 days" />
                            </div>

                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Subtotal:</span>
                                    <span>
                                        {quoteType === 'manual'
                                            ? lineItems.reduce((sum, i) => sum + i.total, 0).toFixed(2)
                                            : parseFloat(imageQuoteTotal || 0).toFixed(2)
                                        }
                                    </span>
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
