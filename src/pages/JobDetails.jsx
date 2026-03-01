import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bookings, updateBookingStatus } = useData();

    const job = bookings.find(b => b.id === id);
    const [proofImage, setProofImage] = useState(null);

    if (!job) return <div className="container" style={{ padding: '2rem' }}>Job not found.</div>;

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProofImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleComplete = () => {
        if (!proofImage) {
            alert('Please upload a completion proof (image) before marking as done.');
            return;
        }
        updateBookingStatus(job.id, 'completed', user.id);
        alert('Job marked as completed!');
        navigate('/dashboard');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>Job Details</h2>
                    <span className={`badge badge-${job.status}`}>{job.status}</span>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Service Category</label>
                        <h3 style={{ textTransform: 'capitalize' }}>{job.serviceCategory}</h3>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customer Details</label>
                        <div style={{ fontWeight: 'bold' }}>{job.userName}</div>
                        <div>{job.userEmail}</div> {/* Assuming userEmail is in booking or fetch from user ID */}
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
                        <p style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            {job.description}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date</label>
                            <div>{job.preferredDate}</div>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Time</label>
                            <div>{job.preferredTime}</div>
                        </div>
                    </div>
                </div>

                {job.status === 'accepted' && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Complete Job</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Completion Proof (Before/After Photo)</label>
                            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('proof-upload').click()}>
                                {proofImage ? (
                                    <img src={proofImage} alt="Proof" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
                                ) : (
                                    <>
                                        <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                                        <p style={{ color: 'var(--text-secondary)' }}>Click to upload image</p>
                                    </>
                                )}
                                <input type="file" id="proof-upload" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                            </div>
                        </div>

                        <button onClick={handleComplete} className="btn btn-primary btn-full">
                            <CheckCircle size={18} /> Mark as Completed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
