import React, { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { logout } from '../../hooks/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleString();
    }
    return String(timestamp);
  };

  useEffect(() => {
    // Fetch all users for mapping user info in feedbacks
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data));

    // Get current user from localStorage and fetch full user info
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser && localUser.uid) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/${localUser.uid}`)
        .then(res => res.json())
        .then(userData => {
          setCurrentUser(userData);
          setIsAdmin(userData.isAdmin);
          if (userData.isAdmin) {
            // Fetch all feedbacks if admin
            fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/feedbacks`)
              .then(res => res.json())
              .then(data => setFeedbacks(data));
          }
        });
    }
  }, []);

  const handleLogout = async () => {
    await logout(auth);
    router.push("/");
  };

  const getUserInfo = (uid) => users.find(u => u.uid === uid) || {};

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-2xl font-bold">Question Sets</h1>
        <div className="flex gap-2">
          <Button variant={'outline'} onClick={() => router.push('/feedback')}>Give Feedback</Button>
          <Button variant={'destructive'} onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      {isAdmin && (
        <div className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">All Feedbacks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((fb, idx) => {
              const fromUser = getUserInfo(fb.from_user);
              const toUser = getUserInfo(fb.to_user);
              return (
                <div key={idx} className="bg-neutral-800 rounded-lg shadow p-6 text-white">
                  <div className="flex items-center mb-2">
                    {fromUser.picture && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-neutral-700 flex-shrink-0">
                        <img src={fromUser.picture} alt="from user" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">{fromUser.name || fb.from_user}</span>
                      <div className="text-xs text-neutral-400">{fromUser.position} | {fromUser.seniority}</div>
                    </div>
                    <span className="mx-2 text-neutral-400">→</span>
                    {toUser.picture && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-neutral-700 flex-shrink-0">
                        <img src={toUser.picture} alt="to user" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">{toUser.name || fb.to_user}</span>
                      <div className="text-xs text-neutral-400">{toUser.position} | {toUser.seniority}</div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-neutral-400">Answers:</div>
                  <ul className="mb-2">
                    {fb.answers &&
                      Object.entries(fb.answers).map(([question, value], i) => {
                        // Determine bar color based on value
                        let barColor = "bg-red-500";
                        if (value >= 5) barColor = "bg-green-500";
                        else if (value >= 3) barColor = "bg-yellow-400";
                        // Render 6 bars, fill up to the value
                        return (
                          <li key={i} className="mb-3">
                            <div className="text-sm text-neutral-300 mb-1">{question}</div>
                            <div className="flex items-center gap-2 mb-1">
                              {[...Array(6)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`w-4 h-4 rounded-sm border border-neutral-700 ${idx < value ? barColor : 'bg-neutral-700'}`}
                                ></div>
                              ))}
                              <span className="ml-2 text-xs text-neutral-400">{value}/6</span>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  {fb.tags && fb.tags.length > 0 && (
                    <div className="mb-2 text-xs text-neutral-400">Tags: {fb.tags.join(', ')}</div>
                  )}
                  {fb.open_feedback && (
                    <div className="mb-2 text-xs text-neutral-400">Open Feedback: {fb.open_feedback}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}