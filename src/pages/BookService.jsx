import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Sun, Moon, Sunrise, Briefcase, Plus, Minus } from 'lucide-react';
import { serviceThemes } from '../utils/serviceThemes';

const BookService = () => {
    const { user } = useAuth();
    const { addBooking } = useData();
    const navigate = useNavigate();
    const dateRef = useRef(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const today = new Date().toISOString().split('T')[0]; // e.g. "2026-03-01"

    const [formData, setFormData] = useState({
        serviceCategory: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        contractDays: 1,         // 1 = single day, >1 = contract
        isContract: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.serviceCategory || !formData.description) return;

        addBooking({
            userId: user.id,
            userName: user.name,
            ...formData,
            status: 'pending'
        });

        navigate('/dashboard');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Reject past dates entered via keyboard
        if (name === 'preferredDate' && value && value < today) return;
        setFormData({ ...formData, [name]: value });
    };

    const selectService = (category) => setFormData({ ...formData, serviceCategory: category });
    const selectTime = (time) => setFormData({ ...formData, preferredTime: time });

    const services = Object.keys(serviceThemes).filter(k => !['default', 'Shopkeeper', 'Customer'].includes(k));

    const timeSlots = [
        { id: 'morning', label: 'Morning', icon: Sunrise, time: '9AM - 12PM' },
        { id: 'afternoon', label: 'Afternoon', icon: Sun, time: '12PM - 4PM' },
        { id: 'evening', label: 'Evening', icon: Moon, time: '4PM - 8PM' }
    ];

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', textAlign: 'center' }}>Book a Service</h2>

                <form onSubmit={handleSubmit}>
                    {/* Visual Service Selection */}
                    <div className="form-group">
                        <label style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>Select Service Required:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
                            {services.map(service => {
                                const isSelected = formData.serviceCategory === service;
                                const theme = serviceThemes[service];

                                return (
                                    <div
                                        key={service}
                                        onClick={() => selectService(service)}
                                        style={{
                                            cursor: 'pointer',
                                            border: isSelected ? `3px solid ${theme.primary}` : '2px solid var(--border-color)',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            // transform: isSelected ? 'scale(1.05)' : 'scale(1)', // Removed to prevent layout shift
                                            boxShadow: isSelected ? `0 10px 25px -5px ${theme.primary}40` : 'var(--shadow-sm)',
                                            background: 'var(--surface-color)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ height: '100px', width: '100%', overflow: 'hidden' }}>
                                            <img
                                                src={theme.image}
                                                alt={service}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            background: isSelected ? theme.accent : 'var(--surface-color)',
                                            color: isSelected ? theme.secondary : 'var(--text-primary)',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '3rem',
                                            borderTop: isSelected ? `1px solid ${theme.primary}20` : '1px solid var(--border-color)'
                                        }}>
                                            {service.replace(/([A-Z])/g, ' $1').trim()}
                                        </div>
                                        {
                                            isSelected && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    background: theme.primary,
                                                    color: '#ffffff',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px'
                                                }}>✓</div>
                                            )
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Problem Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue (e.g., Leaking tap, No power)..."
                            rows="4"
                            required
                            style={{ fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferred Date</label>
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
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPickerOpen(false); // picker closed after picking; reset so next icon click opens directly
                                }}
                                required
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

                    {/* Contract / Duration Section */}
                    <div className="form-group">
                        <label>Work Duration:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            {/* Single Day */}
                            <div
                                onClick={() => setFormData(f => ({ ...f, isContract: false, contractDays: 1 }))}
                                style={{
                                    cursor: 'pointer',
                                    border: !formData.isContract ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    background: !formData.isContract ? 'var(--primary-muted)' : 'var(--surface-color)',
                                    borderRadius: '0.75rem',
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    color: !formData.isContract ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Clock size={20} />
                                <span>Single Day</span>
                            </div>
                            {/* Contract / Multi-Day */}
                            <div
                                onClick={() => setFormData(f => ({ ...f, isContract: true, contractDays: f.contractDays < 2 ? 2 : f.contractDays }))}
                                style={{
                                    cursor: 'pointer',
                                    border: formData.isContract ? '2px solid var(--secondary-color)' : '1px solid var(--border-color)',
                                    background: formData.isContract ? 'rgba(245,158,11,0.12)' : 'var(--surface-color)',
                                    borderRadius: '0.75rem',
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    color: formData.isContract ? 'var(--secondary-color)' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Briefcase size={20} />
                                <span>Contract / Multi-Day</span>
                            </div>
                        </div>

                        {/* Days stepper — shown only in contract mode */}
                        {formData.isContract && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'var(--surface-raised)',
                                border: '1.5px solid var(--secondary-color)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem 1rem',
                                width: 'fit-content'
                            }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.25rem' }}>Number of Days:</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(f => ({ ...f, contractDays: Math.max(2, f.contractDays - 1) }))}
                                    style={{
                                        background: 'var(--surface-highlight)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px', height: '32px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    minWidth: '3ch',
                                    textAlign: 'center',
                                    color: 'var(--secondary-color)'
                                }}>
                                    {formData.contractDays}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(f => ({ ...f, contractDays: f.contractDays + 1 }))}
                                    style={{
                                        background: 'var(--surface-highlight)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px', height: '32px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>days</span>
                            </div>
                        )}
                    </div>

                    {/* Time Slot — only shown in single-day mode */}
                    {!formData.isContract && (
                        <div className="form-group">
                            <label>Preferred Time Slot:</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {timeSlots.map(slot => {
                                    const isSelected = formData.preferredTime === slot.id;
                                    const Icon = slot.icon;
                                    return (
                                        <div
                                            key={slot.id}
                                            onClick={() => selectTime(slot.id)}
                                            style={{
                                                cursor: 'pointer',
                                                border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                background: isSelected ? 'var(--primary-color)' : 'var(--surface-color)',
                                                borderRadius: '0.75rem',
                                                padding: '0.75rem',
                                                textAlign: 'center',
                                                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Icon size={24} style={{ marginBottom: '0.25rem', color: isSelected ? '#ffffff' : 'var(--text-secondary)' }} />
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{slot.label}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{slot.time}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{
                            padding: '1rem',
                            fontSize: '1.2rem',
                            marginTop: '1rem',
                            opacity: (!formData.serviceCategory || !formData.description) ? 0.7 : 1
                        }}
                        disabled={!formData.serviceCategory || !formData.description}
                    >
                        Find Professionals
                    </button>
                </form>
            </div >
        </div >
    );
};

export default BookService;
