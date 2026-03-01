import {
    Wrench, Zap, Droplets, PaintBucket, Hammer, Sparkles, ShieldCheck,
    Footprints, SprayCan, BrickWall, HardHat,
    Lightbulb, Plug, Cable,
    Bath, Waves, Wrench as Tool,
    Ruler, Scissors,
    Brush, Palette, Droplet,
    Trash2, Home,
    Truck, Box, Pickaxe,
    Building, DoorOpen, HardHat as Helmet,
    Dog, Cat, Bone,
    Lock, Key, Shield,
    Store, ShoppingBag, ShoppingCart, Tag, CreditCard,
    User, Heart, Star, Bell, Clock
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Each category has its own distinct color identity.
// primary    → the main brand accent for that skill
// secondary  → lighter / text variant (used for headings, sub-labels)
// accent     → muted background tint (icon pillsinner panels)
// border     → subtle border that matches the primary
// gradient   → radial/linear bg used in the hero banner header
// buttonGradient → CTA button gradient
// ─────────────────────────────────────────────────────────────────────────────
export const serviceThemes = {
    'Electrician': {
        primary: '#F59E0B',    // Amber — electrical energy
        secondary: '#FCD34D',
        accent: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.30)',
        gradient: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        icon: Zap,
        icons: [Zap, Lightbulb, Plug, Cable],
        image: '/images/electrician.png',
    },
    'Plumber': {
        primary: '#06B6D4',    // Cyan — water
        secondary: '#67E8F9',
        accent: 'rgba(6,182,212,0.12)',
        border: 'rgba(6,182,212,0.30)',
        gradient: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        icon: Droplets,
        icons: [Droplets, Bath, Waves, Tool],
        image: '/images/plumber.png',
    },
    'Carpenter': {
        primary: '#92400E',    // Warm Brown — wood craft
        secondary: '#B45309',
        accent: 'rgba(146,64,14,0.14)',
        border: 'rgba(146,64,14,0.30)',
        gradient: 'linear-gradient(135deg, rgba(180,83,9,0.20) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
        icon: Hammer,
        icons: [Hammer, Ruler, Scissors, Tool],
        image: '/images/carpenter.png',
    },
    'Painter': {
        primary: '#8B5CF6',    // Violet — creative arts
        secondary: '#A78BFA',
        accent: 'rgba(139,92,246,0.12)',
        border: 'rgba(139,92,246,0.30)',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        icon: PaintBucket,
        icons: [PaintBucket, Brush, Palette, Droplet],
        image: '/images/painter.png',
    },
    'Cleaning': {
        primary: '#10B981',    // Emerald — fresh / clean
        secondary: '#34D399',
        accent: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.30)',
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        icon: Sparkles,
        icons: [Sparkles, Trash2, Home],
        image: '/images/cleaning.png',
    },
    'Labour': {
        primary: '#EF4444',    // Red — physical strength
        secondary: '#FCA5A5',
        accent: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.30)',
        gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        icon: HardHat,
        icons: [HardHat, Truck, Box, Pickaxe],
        image: '/images/labour.png',
    },
    'Mistri': {
        primary: '#D97706',    // Orange — construction
        secondary: '#FBB040',
        accent: 'rgba(217,119,6,0.12)',
        border: 'rgba(217,119,6,0.30)',
        gradient: 'linear-gradient(135deg, rgba(217,119,6,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
        icon: BrickWall,
        icons: [BrickWall, Building, DoorOpen, Helmet],
        image: '/images/mistri.png',
    },
    'Maid': {
        primary: '#EC4899',    // Pink — home care
        secondary: '#F9A8D4',
        accent: 'rgba(236,72,153,0.12)',
        border: 'rgba(236,72,153,0.30)',
        gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
        icon: SprayCan,
        icons: [SprayCan, Home, Sparkles],
        image: '/images/maid.png',
    },
    'DogWalker': {
        primary: '#14B8A6',    // Teal — outdoors / nature
        secondary: '#5EEAD4',
        accent: 'rgba(20,184,166,0.12)',
        border: 'rgba(20,184,166,0.30)',
        gradient: 'linear-gradient(135deg, rgba(20,184,166,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
        icon: Footprints,
        icons: [Footprints, Dog, Bone, Cat],
        image: '/images/dogwalker.png',
    },
    'Guard': {
        primary: '#64748B',    // Slate — security / authority
        secondary: '#94A3B8',
        accent: 'rgba(100,116,139,0.14)',
        border: 'rgba(100,116,139,0.30)',
        gradient: 'linear-gradient(135deg, rgba(100,116,139,0.20) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
        icon: ShieldCheck,
        icons: [ShieldCheck, Lock, Key, Shield],
        image: '/images/guard.png',
    },
    'Shopkeeper': {
        primary: '#6366F1',    // Indigo — commerce / brand
        secondary: '#A5B4FC',
        accent: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.30)',
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        icon: Store,
        icons: [Store, ShoppingBag, ShoppingCart, Tag, CreditCard],
        image: '/images/shopkeeper.png',
    },
    'Customer': {
        primary: '#6366F1',
        secondary: '#A5B4FC',
        accent: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.30)',
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        icon: User,
        icons: [User, Heart, Star, Bell, Clock],
        image: '/images/customer.png',
    },
    'default': {
        primary: '#6366F1',
        secondary: '#A5B4FC',
        accent: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.30)',
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(17,24,39,0) 70%)',
        buttonGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        icon: Wrench,
        icons: [Wrench, Sparkles, Star, Tag],
        image: '/images/default.png',
    }
};
