import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Feedback() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [answers, setAnswers] = useState({});
  const [openFeedback, setOpenFeedback] = useState("");
  const [tags, setTags] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  const [currentUserUid, setCurrentUserUid] = useState("");

  useEffect(() => {
    // Fetch all users
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const localStorageUser = JSON.parse(localStorage.getItem("user"));
        const fullUser = data.find(u => u.uid === localStorageUser.uid);
        setCurrentUser(fullUser);
        setCurrentUserUid(localStorageUser.uid);
      });
  }, []);

  // Fetch question set after user selection
  useEffect(() => {
    if (selectedUser && currentUser) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/question-sets/filter?from=${currentUser.seniority}&to=${selectedUser.seniority}`)
        .then(res => res.json())
        .then(data => {
          const qs = Array.isArray(data) ? data[0] : data;
          setQuestionSet(qs);
          // Initialize answers
          if (qs && qs.criteria) {
            const initial = {};
            qs.criteria.forEach(q => { initial[q] = 0; });
            setAnswers(initial);
          }
          setLoading(false);
        });
    }
  }, [selectedUser, currentUser]);

  const handleAnswerChange = (criterion, value) => {
    setAnswers(prev => ({ ...prev, [criterion]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !selectedUser) return;
    const payload = {
      answers,
      from_user: currentUser.uid,
      to_user: selectedUser.uid,
      open_feedback: openFeedback,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/feedbacks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Feedback sent!");
      router.push("/home");
    } else {
      alert("Failed to send feedback");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-white text-2xl font-bold mb-6">Give Feedback</h1>
        {console.log(currentUserUid)}
        {step === 1 && (
          <div>
            <label className="text-white block mb-2">Select a user to rate:</label>
            <select
              className="w-full p-2 rounded bg-neutral-700 text-white mb-4"
              value={selectedUser ? selectedUser.uid : ""}
              onChange={e => {
                const user = users.find(u => u.uid === e.target.value);
                setSelectedUser(user);
                setStep(2);
              }}
            >
              <option value="">-- Select User --</option>
              {users.filter(u => u.uid !== currentUserUid).map(u => (
                <option key={u.uid} value={u.uid}>{u.name} ({u.position})</option>
              ))}
            </select>
          </div>
        )}
        {step === 2 && questionSet && Array.isArray(questionSet.criteria) && questionSet.criteria.length > 0 ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-white text-lg font-semibold mb-2">Questions</h2>
              {questionSet.criteria.map((criterion, idx) => (
                <div key={idx} className="mb-2">
                  <label className="text-white block mb-1">{criterion}</label>
                  <select
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                    value={answers[criterion]}
                    onChange={e => handleAnswerChange(criterion, e.target.value)}
                    required
                  >
                    {[...Array(7).keys()].map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label className="text-white block mb-1">Open Feedback (optional)</label>
              <textarea
                className="w-full p-2 rounded bg-neutral-700 text-white"
                value={openFeedback}
                onChange={e => setOpenFeedback(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="text-white block mb-1">Tags (comma separated, optional)</label>
              <input
                className="w-full p-2 rounded bg-neutral-700 text-white"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g. first_quarter, teamwork"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setStep(1)}
              >Back</button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                disabled={loading}
              >Submit Feedback</button>
            </div>
          </form>
        ) : step === 2 && questionSet && (!Array.isArray(questionSet.criteria) || questionSet.criteria.length === 0) ? (
          <div className="text-white">No questions available for this feedback.</div>
        ) : null}
      </div>
    </div>
  );
}