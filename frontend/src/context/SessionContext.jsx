import { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession]       = useState(null);
  const [messages, setMessages]     = useState([]);
  const [examsDone, setExamsDone]   = useState([]);
  const [testsOrdered, setTestsOrdered] = useState([]);
  const [drugs, setDrugs]           = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport]         = useState(null);

  const startSession = (sessionData) => {
    setSession(sessionData);
    setMessages([]);
    setExamsDone([]);
    setTestsOrdered([]);
    setDrugs([]);
    setIsSubmitted(false);
    setReport(null);
  };

  const addMessage = (sender, text) =>
    setMessages(prev => [...prev, { sender, text, time: new Date() }]);

  const addExam    = (exam) => setExamsDone(prev => [...prev, exam]);
  const addTest    = (test) => setTestsOrdered(prev =>
    prev.includes(test) ? prev : [...prev, test]);
  const removeTest = (test) => setTestsOrdered(prev => prev.filter(t => t !== test));

  const submitReport = (reportData) => {
    setReport(reportData);
    setIsSubmitted(true);
  };

  return (
    <SessionContext.Provider value={{
      session, messages, examsDone, testsOrdered, drugs, setDrugs,
      isSubmitted, report,
      startSession, addMessage, addExam, addTest, removeTest, submitReport
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
