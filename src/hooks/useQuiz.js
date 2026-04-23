import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';

const useQuiz = () => {
  const { quizQuestions, quizState, setQuizState, addScore, addWeakTopic } = useAppStore();

  const startQuiz = useCallback((mode = 'standard') => {
    setQuizState({ current: 0, score: 0, mode, answered: [], finished: false, waitingNext: false });
  }, [setQuizState]);

  const answer = useCallback((selectedOption) => {
    const state = useAppStore.getState().quizState;
    const questions = useAppStore.getState().quizQuestions;
    if (!state || state.finished) return;
    // Ignore if already answered this question (waiting for Next)
    if (state.answered[state.current]) return;

    const q = questions[state.current];
    const correct = selectedOption === q.answer;
    if (!correct && q.topic) addWeakTopic(q.topic);

    const newAnswered = [...state.answered];
    newAnswered[state.current] = { selected: selectedOption, correct };
    const newScore = correct ? state.score + 1 : state.score;
    const isLast = state.current >= questions.length - 1;

    if (isLast) {
      const pct = Math.round((newScore / questions.length) * 100);
      addScore(pct);
      setQuizState({ ...state, answered: newAnswered, score: newScore, finished: true });
    } else if (state.mode === 'speed') {
      // Speed mode: auto-advance after a brief moment handled by component
      setQuizState({ ...state, answered: newAnswered, score: newScore, waitingNext: true });
    } else {
      // Standard mode: wait for user to click "Next"
      setQuizState({ ...state, answered: newAnswered, score: newScore, waitingNext: true });
    }
  }, [addScore, addWeakTopic, setQuizState]);

  const nextQuestion = useCallback(() => {
    const state = useAppStore.getState().quizState;
    if (!state || state.finished) return;
    setQuizState({ ...state, current: state.current + 1, waitingNext: false });
  }, [setQuizState]);

  const resetQuiz = useCallback(() => setQuizState(null), [setQuizState]);

  const currentQuestion = quizState && !quizState.finished ? quizQuestions[quizState.current] : null;
  const scorePercent = quizState?.finished
    ? Math.round((quizState.score / quizQuestions.length) * 100)
    : 0;

  return { quizState, currentQuestion, quizQuestions, scorePercent, startQuiz, answer, nextQuestion, resetQuiz };
};

export default useQuiz;
