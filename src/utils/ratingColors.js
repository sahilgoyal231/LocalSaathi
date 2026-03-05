/**
 * Returns a hex color code based on a 5.0 rating scale
 * 
 * - Red for ratings < 2.5
 * - Yellow for ratings 2.5 - 3.9
 * - Green for ratings >= 4.0
 * 
 * @param {number|string} rating 
 * @returns {string} Hex color
 */
export const getRatingColor = (rating) => {
    const r = parseFloat(rating) || 0;

    if (r === 0) return '#94a3b8'; // Neutral Slate for brand new 0.0 ratings
    if (r < 2.5) return '#ef4444'; // Red
    if (r < 4.0) return '#eab308'; // Yellow
    return '#10b981'; // Green
};
