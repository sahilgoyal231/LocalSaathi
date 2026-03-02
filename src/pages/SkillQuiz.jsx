import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import { translations } from '../utils/translations';

const SkillQuiz = () => {
    const { user, updateProfile } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();

    // State to hold the chosen question indices (so language toggles don't randomize again)
    const [questionIndices, setQuestionIndices] = useState([]);

    // State to hold the populated questions based on the current language
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // 1. Pick indices once when the component mounts or user category changes.
    useEffect(() => {
        const userSkillCategory = user?.skills || 'default';
        const normalizedCategory = Object.keys(quizQuestions).find(
            key => key.toLowerCase() === userSkillCategory.toLowerCase()
        ) || 'default';

        // Get the total length of questions for this category (usually 10)
        let qList = quizQuestions['en']?.[normalizedCategory] || quizQuestions['en']?.['default'] || [];

        // Generate an array of indices [0, 1, 2, ..., length-1]
        const indices = Array.from({ length: qList.length }, (_, i) => i);

        // Shuffle the indices and take 5
        const shuffledIndices = indices.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestionIndices(shuffledIndices);
    }, [user]);

    // 2. Hydrate the actual questions when the language or indices change.
    useEffect(() => {
        if (questionIndices.length === 0) return;

        const userSkillCategory = user?.skills || 'default';
        const normalizedCategory = Object.keys(quizQuestions).find(
            key => key.toLowerCase() === userSkillCategory.toLowerCase()
        ) || 'default';

        let qList = quizQuestions[language]?.[normalizedCategory] || quizQuestions[language]?.['default'] || quizQuestions['en']?.[normalizedCategory] || quizQuestions['en']?.['default'] || [];

        // Map the preserved random indices to the currently selected language's question list
        const selected = questionIndices.map(index => qList[index]);
        setQuestions(selected);
    }, [language, questionIndices, user]);

    const handleAnswer = (optionIndex) => {
        if (optionIndex === questions[currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleComplete = () => {
        const passed = score >= 4;
        updateProfile({ quizScore: score, skillVerified: passed });
        if (passed) {
            alert(t.passedQuiz || 'Congratulations! You passed the skill verification.');
            navigate('/dashboard');
        } else {
            navigate('/profile');
        }
    };

    if (questions.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>{t.loadingQuizData || 'Loading Quiz Data...'}</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%' }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>
                    {user?.skills ? `${user.skills.replace(/([A-Z])/g, ' $1').trim()} ${t.skillVerification}` : t.skillVerification}
                </h2>

                {!showResult ? (
                    <div>
                        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            {t.question} {currentQuestion + 1} {t.of} {questions.length}
                        </div>
                        <h3 style={{ marginBottom: '2rem', lineHeight: '1.4' }}>{questions[currentQuestion].question}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}
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
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            {score >= 4 ? (
                                <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto' }} />
                            ) : (
                                <XCircle size={64} color="var(--error-color)" style={{ margin: '0 auto' }} />
                            )}
                        </div>
                        <h3>{t.youScored} {score} {t.outOf} {questions.length}</h3>
                        <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                            {score >= 4 ? t.passedQuiz : t.failedQuiz}
                        </p>
                        <button onClick={handleComplete} className="btn btn-primary">{score >= 4 ? t.returnToDashboard : (t.profile || 'Return to Profile')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillQuiz;
