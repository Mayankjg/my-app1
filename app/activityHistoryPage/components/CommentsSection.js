"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function CommentsSection() {
  const [comments, setComments] = useState([
    {
      id: 1,    
      text: "Need to have a followup call. - By Test",
      date: "28-Oct-25 10:29",
    },
  ]);

  const [inputComment, setInputComment] = useState("");

  const addComment = () => {
    if (!inputComment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: inputComment,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setComments([newComment, ...comments]);
    setInputComment("");
  };

  const deleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  return (
    <>
      <textarea
        className="w-full border border-gray-300 rounded p-3 h-32 outline-none text-sm"
        placeholder="Comment"
        value={inputComment}
        onChange={(e) => setInputComment(e.target.value)}
      ></textarea>

      <div className="flex gap-3 mt-4">
        <button
          onClick={addComment}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white px-8 py-2.5 rounded font-medium text-sm"
        >
          Add
        </button>

        <button
          onClick={() => setInputComment("")}
          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-8 py-2.5 rounded font-medium text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="border-t border-dashed border-gray-300 my-6"></div>

      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#e8eef2]">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">
                COMMENT
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">
                DATE
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {comments.map((c) => (
              <tr key={c.id} className="bg-white">
                <td className="px-4 py-4 text-gray-600 border border-gray-300">
                  {c.text}
                </td>
                <td className="px-4 py-4 text-[#00bcd4] font-medium border border-gray-300">
                  {c.date}
                </td>
                <td className="px-4 py-4 border border-gray-300">
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="border border-gray-300 bg-white rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 p-4 text-sm text-gray-600">
              {c.text}
            </div>
            <div className="border-b border-gray-200 p-4 text-sm font-semibold text-[#00bcd4]">
              {c.date}
            </div>
            <div className="p-4 flex justify-start">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => deleteComment(c.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}