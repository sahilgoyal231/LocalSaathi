import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition — wraps page content and re-triggers the entrance
 * animation every time the route changes. Pure CSS, no extra libraries.
 */
const PageTransition = ({ children }) => {
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Remove class to reset animation, then re-add
        el.classList.remove('page-enter');
        // Force reflow so the browser acknowledges the removal
        void el.offsetWidth;
        el.classList.add('page-enter');
    }, [location.pathname]);

    return (
        <div ref={ref} className="page-enter">
            {children}
        </div>
    );
};

export default PageTransition;
