import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, Check, CheckCircle, Package } from 'lucide-react';
import logoImg from '../assets/logo.png';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { requests, quotations, acceptQuotation } = useData();

    const request = requests.find(r => r.id === id);
    const requestQuotes = quotations.filter(q => q.requestId === id);
    const acceptedQuote = requestQuotes.find(q => q.status === 'accepted');
    const pendingQuotes = requestQuotes.filter(q => q.status === 'sent');

    if (!request) return <div className="container" style={{ padding: '2rem' }}>Request not found.</div>;

    const handleAcceptQuote = (quoteId) => {
        acceptQuotation(quoteId);
        navigate('/dashboard');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Request Details</h2>
                    <span className={`badge badge-${request.status}`}>{request.status}</span>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
                        <div><strong>{request.category}</strong></div>
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Requirements</label>
                        <p>{request.requirements}</p>
                    </div>
                </div>
            </div>

            {/* If a quotation has been accepted, show confirmation and hide others */}
            {acceptedQuote ? (
                <div>
                    <div className="card" style={{
                        borderLeft: '4px solid var(--success-color)',
                        background: 'rgba(16, 185, 129, 0.05)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <CheckCircle size={24} color="var(--success-color)" />
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--success-color)' }}>Quotation Accepted!</h3>
                                <small style={{ color: 'var(--text-secondary)' }}>Your order is now confirmed.</small>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{acceptedQuote.shopkeeperName}</div>
                                <small style={{ color: 'var(--text-secondary)' }}>{new Date(acceptedQuote.date).toLocaleDateString()}</small>
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                ₹{acceptedQuote.totalAmount}
                            </div>
                        </div>
                        {acceptedQuote.note && <p style={{ fontSize: '0.9rem', marginTop: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{acceptedQuote.note}"</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'var(--surface-color)', borderRadius: '0.5rem' }}>
                        <Package size={16} />
                        <span>Your order is being processed. Track progress in <strong>Upcoming Orders</strong> on your dashboard.</span>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Received Quotations ({pendingQuotes.length})</h3>

                    {pendingQuotes.length === 0 ? (
                        <div className="card">No quotations received yet.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {pendingQuotes.map(quote => (
                                <div key={quote.id} className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4>{quote.shopkeeperName}</h4>
                                            <small style={{ color: 'var(--text-secondary)' }}>{new Date(quote.date).toLocaleDateString()}</small>
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            ₹{quote.totalAmount}
                                        </div>
                                    </div>
                                    {quote.note && <p style={{ fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>"{quote.note}"</p>}
                                    {quote.image && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Quotation Attachment</label>
                                            <a href={quote.image} target="_blank" rel="noopener noreferrer">
                                                <img src={quote.image} alt="Quotation Attachment" onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }} />
                                            </a>
                                        </div>
                                    )}

                                    <button onClick={() => handleAcceptQuote(quote.id)} className="btn btn-primary" style={{ width: '100%' }}>
                                        <Check size={16} /> Accept Quotation
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestDetails;

