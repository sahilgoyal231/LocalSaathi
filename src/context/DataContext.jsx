import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [requests, setRequests] = useState(() => JSON.parse(localStorage.getItem('requests') || '[]'));
    const [quotations, setQuotations] = useState(() => JSON.parse(localStorage.getItem('quotations') || '[]'));
    const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('bookings') || '[]'));
    const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications') || '[]'));

    const [language, setLanguage] = useState('en');

    // Save changes to local storage
    useEffect(() => {
        localStorage.setItem('requests', JSON.stringify(requests));
    }, [requests]);

    useEffect(() => {
        localStorage.setItem('quotations', JSON.stringify(quotations));
    }, [quotations]);

    useEffect(() => {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addRequest = (request) => {
        const newRequest = { ...request, id: Date.now().toString(), status: 'open', date: new Date().toISOString() };
        setRequests(prev => [newRequest, ...prev]);
        return newRequest;
    };

    const addQuotation = (quotation) => {
        // quotation now includes items: [{name, qty, price, total}], deliveryCharge, terms, validity
        const newQuote = {
            ...quotation,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'sent'
        };
        setQuotations(prev => [newQuote, ...prev]);
        return newQuote;
    };

    const addBooking = (booking) => {
        const newBooking = { ...booking, id: 'BK-' + Date.now(), status: 'pending', date: new Date().toISOString() };
        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
    };

    const updateBookingStatus = (bookingId, status, servicemanId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status, servicemanId: servicemanId || b.servicemanId } : b
        ));
    };

    const expressInterest = (bookingId, provider) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const interested = booking.interestedProviders || [];
        if (interested.find(p => p.id === provider.id)) return; // Already interested

        addNotification(booking.userId, `${provider.name} is interested in your ${booking.serviceCategory} request!`);

        setBookings(prev => prev.map(b => {
            if (b.id === bookingId) {
                return { ...b, interestedProviders: [...interested, provider] };
            }
            return b;
        }));
    };

    const hireProvider = (bookingId, providerId) => {
        setBookings(prev => prev.map(b => {
            if (b.id === bookingId) {
                const provider = b.interestedProviders?.find(p => p.id === providerId);
                const agreedPrice = provider ? (provider.proposedRate || provider.rate) : 350;
                return {
                    ...b,
                    status: 'accepted',
                    servicemanId: providerId,
                    agreedPrice: agreedPrice,
                    interestedProviders: []
                };
            }
            return b;
        }));
    };

    const addBookingFeedback = (bookingId, feedback) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, feedback } : b
        ));
    };

    const acceptQuotation = (quotationId) => {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) return;

        setQuotations(prev => prev.map(q =>
            q.id === quotationId ? { ...q, status: 'accepted' } : q
        ));

        setRequests(prev => prev.map(r =>
            r.id === quotation.requestId ? { ...r, status: 'closed' } : r
        ));

        addNotification(quotation.shopkeeperId, `Your quotation for ₹${quotation.totalAmount || quotation.amount} has been accepted!`, 'success');
    };

    const addNotification = (userId, message, type = 'info') => {
        const newNotif = { id: Date.now().toString(), userId, message, type, read: false, date: new Date().toISOString() };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const changeLanguage = (langCode) => {
        setLanguage(langCode);
    };

    const getProviderRating = (providerId) => {
        const providerBookings = bookings.filter(b => b.servicemanId === providerId && b.feedback);
        if (providerBookings.length === 0) return 4.8; // default starting rating
        const totalRating = providerBookings.reduce((sum, b) => sum + b.feedback.rating, 0);
        return (totalRating / providerBookings.length).toFixed(1);
    };

    return (
        <DataContext.Provider value={{
            requests,
            quotations,
            bookings,
            notifications,
            addRequest,
            addQuotation,
            addBooking,
            updateBookingStatus,
            expressInterest,
            hireProvider,
            acceptQuotation,
            addNotification,
            markNotificationRead,
            addBookingFeedback,
            getProviderRating,
            language,
            changeLanguage
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
