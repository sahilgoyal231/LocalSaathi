import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, Volume2, VolumeX, Loader } from 'lucide-react';
import { profileQuestions } from '../data/questions';
import { translations } from '../utils/translations';

// Map app language codes → BCP-47 tags for SpeechSynthesis
const LANG_TO_BCP47 = {
    en: 'en-IN', hi: 'hi-IN', te: 'te-IN', bn: 'bn-IN',
    mr: 'mr-IN', ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN',
    ml: 'ml-IN', pa: 'pa-IN', ur: 'ur-PK', or: 'or-IN',
};

// Languages with no reliable TTS engine on any platform — hide Listen button entirely
const NO_TTS_LANGS = new Set(['pa', 'gu', 'mr', 'ur', 'or', 'ml']);

// Natural-language speech scripts per language
// Each entry: { bridge, options: [A,B,C,D] }
// "bridge" is read between the question and options: "Your options are —"
const SPEECH_SCRIPTS = {
    en: {
        bridge: 'Your options are.',
        options: ['First option:', 'Second option:', 'Third option:', 'Fourth option:'],
    },
    hi: {
        bridge: 'आपके विकल्प इस प्रकार हैं।',
        options: ['पहला विकल्प है:', 'दूसरा विकल्प है:', 'तीसरा विकल्प है:', 'चौथा विकल्प है:'],
    },
    te: {
        bridge: 'మీ సమాధానాలు ఇవి.',
        options: ['మొదటి ఎంపిక:', 'రెండవ ఎంపిక:', 'మూడవ ఎంపిక:', 'నాల్గవ ఎంపిక:'],
    },
    bn: {
        bridge: 'আপনার বিকল্পগুলি হলো।',
        options: ['প্রথম বিকল্প:', 'দ্বিতীয় বিকল্প:', 'তৃতীয় বিকল্প:', 'চতুর্থ বিকল্প:'],
    },
    mr: {
        bridge: 'तुमचे पर्याय खालीलप्रमाणे आहेत।',
        options: ['पहला पर्याय:', 'दुसरा पर्याय:', 'तिसरा पर्याय:', 'चौथा पर्याय:'],
    },
    ta: {
        bridge: 'உங்கள் விருப்பங்கள் பின்வருமாறு.',
        options: ['முதல் விருப்பம்:', 'இரண்டாவது விருப்பம்:', 'மூன்றாவது விருப்பம்:', 'நான்காவது விருப்பம்:'],
    },
    gu: {
        bridge: 'તમારા વિકલ્પો નીચે મુજબ છે.',
        options: ['પ્રથમ વિકલ્પ:', 'બીજો વિકલ્પ:', 'ત્રીજો વિકલ્પ:', 'ચોથો વિકલ્પ:'],
    },
    kn: {
        bridge: 'ನಿಮ್ಮ ಆಯ್ಕೆಗಳು ಹೀಗಿವೆ.',
        options: ['ಮೊದಲ ಆಯ್ಕೆ:', 'ಎರಡನೇ ಆಯ್ಕೆ:', 'ಮೂರನೇ ಆಯ್ಕೆ:', 'ನಾಲ್ಕನೇ ಆಯ್ಕೆ:'],
    },
    ml: {
        bridge: 'നിങ്ങളുടെ ഓപ്ഷനുകൾ ഇവയാണ്.',
        options: ['ഒന്നാമത്തെ ഓപ്ഷൻ:', 'രണ്ടാമത്തെ ഓപ്ഷൻ:', 'മൂന്നാമത്തെ ഓപ്ഷൻ:', 'നാലാമത്തെ ഓപ്ഷൻ:'],
    },
    pa: {
        bridge: 'ਤੁਹਾਡੇ ਵਿਕਲਪ ਇਸ ਤਰ੍ਹਾਂ ਹਨ।',
        options: ['ਪਹਿਲਾ ਵਿਕਲਪ:', 'ਦੂਜਾ ਵਿਕਲਪ:', 'ਤੀਜਾ ਵਿਕਲਪ:', 'ਚੌਥਾ ਵਿਕਲਪ:'],
    },
    ur: {
        bridge: 'آپ کے اختیارات یہ ہیں۔',
        options: ['پہلا آپشن:', 'دوسرا آپشن:', 'تیسرا آپشن:', 'چوتھا آپشن:'],
    },
    or: {
        bridge: 'ଆପଣଙ୍କ ବିକଳ୍ପ ଗୁଡ଼ିକ ହେଉଛି।',
        options: ['ପ୍ରଥମ ବିକଳ୍ପ:', 'ଦ୍ୱିତୀୟ ବିକଳ୍ପ:', 'ତୃତୀୟ ବିକଳ୍ପ:', 'ଚତୁର୍ଥ ବିକଳ୍ପ:'],
    },
};

// Build an array of natural speech segments: [question, bridge, optA, optB, optC, optD]
const buildSpeechParts = (q, lang) => {
    const script = SPEECH_SCRIPTS[lang] || SPEECH_SCRIPTS['en'];
    return [
        q.question,
        script.bridge,
        ...q.options.map((opt, i) => `${script.options[i]} ${opt}`),
    ];
};

// --- useSpeech hook ---
// Chains one SpeechSynthesisUtterance per segment so the TTS engine
// inserts natural pauses at sentence boundaries between question and each option.
const useSpeech = (language) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported] = useState(() => 'speechSynthesis' in window);
    const [hasVoice, setHasVoice] = useState(false);

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [isSupported]);

    // ── Voice cache: built once voices are available, updated on voiceschanged ──
    const voiceCache = useRef({});   // bcp47 → SpeechSynthesisVoice

    const buildCache = useCallback(() => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return;

        // Known warm Indian voices by partial name match
        const PREFERRED = ['raveena', 'heera', 'lekha', 'neerja', 'veena', 'priya', 'manisha', 'moira'];

        // Score a single voice — higher is better
        const scoreVoice = (v, bcp47) => {
            const name = v.name.toLowerCase();
            let s = 0;
            if (v.lang === bcp47) s += 100;
            if (name.includes('premium') || name.includes('neural')) s += 80;
            if (name.includes('enhanced')) s += 60;
            if (name.includes('natural')) s += 50;
            if (v.lang.includes('IN')) s += 35;
            if (name.includes('female') || name.includes('woman')) s += 40;
            if (PREFERRED.some(n => name.includes(n))) s += 50;
            if (!v.localService) s += 15;
            return s;
        };

        // ── Identify the guaranteed fallback: best en-IN or any English voice ──
        const enInVoices = voices.filter(v => v.lang === 'en-IN' || v.lang.startsWith('en'));
        const bestEnFallback = enInVoices
            .map(v => ({ v, s: scoreVoice(v, 'en-IN') }))
            .sort((a, b) => b.s - a.s)[0]?.v || voices[0]; // absolute last resort

        // ── Build per-language cache ──
        Object.entries(LANG_TO_BCP47).forEach(([, bcp47]) => {
            const langBase = bcp47.split('-')[0];

            // 1) Try voices that exactly match or are in the same language family
            const candidates = voices.filter(v =>
                v.lang === bcp47 || v.lang.startsWith(langBase)
            );

            if (candidates.length > 0) {
                const best = candidates
                    .map(v => ({ v, s: scoreVoice(v, bcp47) }))
                    .sort((a, b) => b.s - a.s)[0].v;
                voiceCache.current[bcp47] = best;
            } else {
                // 2) Language not available on this device → use en-IN fallback
                voiceCache.current[bcp47] = bestEnFallback;
            }
        });
        setHasVoice(true); // at least one voice is available on this device
    }, []);

    const pickVoice = useCallback((bcp47) => {
        if (voiceCache.current[bcp47]) return voiceCache.current[bcp47];
        // Voices not ready yet — trigger a fresh build and return what we have
        buildCache();
        const voices = window.speechSynthesis.getVoices();
        return (
            voiceCache.current[bcp47] ||
            voices.find(v => v.lang === 'en-IN') ||
            voices.find(v => v.lang.startsWith('en')) ||
            (voices.length ? voices[0] : null)
        );
    }, [buildCache]);

    // Listen for voice list updates (async on Chrome/Edge/Safari)
    useEffect(() => {
        buildCache();
        window.speechSynthesis.addEventListener('voiceschanged', buildCache);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', buildCache);
    }, [buildCache]);

    const speak = useCallback((parts) => {
        if (!isSupported || !parts?.length) return;
        stop();

        const bcp47 = LANG_TO_BCP47[language] || 'en-IN';
        const voice = pickVoice(bcp47);

        const makeUtterance = (text, isLast) => {
            const utt = new SpeechSynthesisUtterance(text);
            // Use the voice's OWN lang tag — setting utt.lang to a language the
            // device has no TTS engine for (e.g. pa-IN, ur-PK, or-IN) causes
            // the browser to SILENTLY reject the utterance even with a voice set.
            utt.lang = voice?.lang || bcp47;
            utt.rate = 0.78;
            utt.pitch = 1.08;
            utt.volume = 0.82;
            if (voice) utt.voice = voice;
            if (isLast) utt.onend = () => setIsSpeaking(false);
            utt.onerror = () => setIsSpeaking(false);
            return utt;
        };

        const first = makeUtterance(parts[0], parts.length === 1);
        first.onstart = () => setIsSpeaking(true);
        window.speechSynthesis.speak(first);

        for (let i = 1; i < parts.length; i++) {
            window.speechSynthesis.speak(makeUtterance(parts[i], i === parts.length - 1));
        }
    }, [language, stop, isSupported, pickVoice]);

    // Cancel on unmount
    useEffect(() => () => stop(), [stop]);

    return { speak, stop, isSpeaking, isSupported, hasVoice };
};

// --- VoiceButton component ---
const VoiceButton = ({ onClick, isSpeaking, isSupported, hasVoice, style = {} }) => {
    if (!isSupported || !hasVoice) return null;
    return (
        <button
            onClick={onClick}
            title={isSpeaking ? 'Stop reading' : 'Read question aloud'}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: `1.5px solid ${isSpeaking ? 'var(--error-color, #ef4444)' : 'var(--primary-color)'}`,
                background: isSpeaking
                    ? 'rgba(239,68,68,0.10)'
                    : 'rgba(99,102,241,0.10)',
                color: isSpeaking ? 'var(--error-color, #ef4444)' : 'var(--primary-color)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                animation: isSpeaking ? 'voicePulse 1.4s ease-in-out infinite' : 'none',
                ...style,
            }}
        >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isSpeaking ? 'Stop' : 'Listen'}
        </button>
    );
};

const SkillQuiz = () => {
    const { user, updateProfile, logout } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();

    const [questionIndices, setQuestionIndices] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const { speak, stop, isSpeaking, isSupported, hasVoice } = useSpeech(language);


    // Stop speaking when the question index changes (new question tapped)
    useEffect(() => { stop(); }, [currentQuestion, stop]);


    // 1. Pick random indices once on mount
    useEffect(() => {
        const userSkillCategory = user?.skills || 'default';
        const normalizedCategory = Object.keys(profileQuestions).find(
            key => key.toLowerCase() === userSkillCategory.toLowerCase()
        ) || Object.keys(profileQuestions)[0];

        const qList = profileQuestions[normalizedCategory]?.['en'] || [];
        const indices = Array.from({ length: qList.length }, (_, i) => i);
        const shuffled = indices.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestionIndices(shuffled);
    }, [user]);

    // 2. Hydrate questions when language or indices change
    useEffect(() => {
        if (questionIndices.length === 0) return;
        const userSkillCategory = user?.skills || 'default';
        const normalizedCategory = Object.keys(profileQuestions).find(
            key => key.toLowerCase() === userSkillCategory.toLowerCase()
        ) || Object.keys(profileQuestions)[0];

        const profileData = profileQuestions[normalizedCategory] || profileQuestions[Object.keys(profileQuestions)[0]];
        const qList = profileData?.[language] || profileData?.['en'] || [];
        setQuestions(questionIndices.map(i => qList[i]));
    }, [language, questionIndices, user]);

    const handleAnswer = (optionIndex) => {
        stop();
        if (optionIndex === questions[currentQuestion].correct) setScore(s => s + 1);
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(c => c + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleComplete = async () => {
        const passed = score >= 4;
        await updateProfile({ quizScore: score, skillVerified: passed });
        if (passed) {
            alert(t.passedQuiz || 'Congratulations! You passed the skill verification.');
            navigate('/dashboard');
        } else {
            logout();
            navigate('/register', { state: { error: t.failedQuiz } });
        }
    };

    if (questions.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
                {t.loadingQuizData || 'Loading Quiz Data...'}
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <>
            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes voicePulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
                    50%       { box-shadow: 0 0 0 7px rgba(239,68,68,0); }
                }
            `}</style>

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="card" style={{ width: '100%' }}>

                    {/* Header */}
                    <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>
                        {user?.skills ? `${user.skills.replace(/([A-Z])/g, ' $1').trim()} ${t.skillVerification}` : t.skillVerification}
                    </h2>

                    {!showResult ? (
                        <div>
                            {/* Progress + voice button row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {t.question} {currentQuestion + 1} {t.of} {questions.length}
                                </span>

                                {!NO_TTS_LANGS.has(language) && (
                                    <VoiceButton
                                        isSupported={isSupported}
                                        hasVoice={hasVoice}
                                        isSpeaking={isSpeaking}
                                        onClick={() => isSpeaking
                                            ? stop()
                                            : speak(buildSpeechParts(q, language))
                                        }
                                    />
                                )}
                            </div>

                            {/* Question */}
                            <h3 style={{ marginBottom: '2rem', lineHeight: '1.5' }}>{q.question}</h3>

                            {/* Options */}
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {q.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        className="btn btn-outline"
                                        style={{ padding: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                    >
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', minWidth: '20px' }}>
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        <span style={{ wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'left' }}>
                                            {option}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Helper hint for voice */}
                            {isSupported && hasVoice && !NO_TTS_LANGS.has(language) && (
                                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted, var(--text-secondary))', opacity: 0.7 }}>
                                    🔊 {language === 'hi' ? 'सुनने के लिए Listen दबाएँ'
                                        : language === 'te' ? 'వినడానికి Listen నొక్కండి'
                                            : language === 'bn' ? 'শুনতে Listen চাপুন'
                                                : language === 'ta' ? 'கேட்க Listen அழுத்தவும்'
                                                    : language === 'kn' ? 'ಕೇಳಲು Listen ಒತ್ತಿ'
                                                        : language === 'ml' ? 'കേൾക്കാൻ Listen അമർത്തുക'
                                                            : 'Tap Listen to hear the question read aloud'}
                                </p>
                            )}

                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                {score >= 4
                                    ? <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto' }} />
                                    : <XCircle size={64} color="var(--error-color)" style={{ margin: '0 auto' }} />
                                }
                            </div>
                            <h3>{t.youScored} {score} {t.outOf} {questions.length}</h3>
                            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                                {score >= 4 ? t.passedQuiz : t.failedQuiz}
                            </p>
                            <button onClick={handleComplete} className="btn btn-primary">
                                {score >= 4 ? t.returnToDashboard : (t.profile || 'Return to Profile')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SkillQuiz;
