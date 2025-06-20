import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ManageQuestions = () => {
  const { id, dateIndex, slotIndex } = useParams();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    type: 'mcq',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1
  });

  const fetchTest = async () => {
    const res = await api.get(`/test/details/${id}`);
    setTest(res.data.test);
  };

  const fetchQuestions = async () => {
    const res = await api.get(`/test/${id}/questions`);
    setQuestions(res.data.questions);
  };

  const filteredQuestions = () => {
    const slot = test?.dateSlots[dateIndex]?.slots[slotIndex];
    return questions.filter(q => slot?.questions.includes(q._id));
  };

  const handleAdd = async () => {
  try {
    if (!form.questionText.trim()) {
      alert("Question text cannot be empty");
      return;
    }

    const payload = { ...form };
    if (form.type !== 'mcq') delete payload.options;

    await api.post(`/test/${id}/dateslot/${dateIndex}/slot/${slotIndex}/questions`, payload);
    await fetchQuestions();
    setForm({
      type: 'mcq',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    });
    alert('Question added successfully');
  } catch (err) {
    console.error('Error adding question:', err);
    alert('Failed to add question');
  }
};


  const handleDelete = async (qid) => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/test/question/${qid}`);
    await fetchQuestions();
  };

  useEffect(() => {
    fetchTest();
    fetchQuestions();
  }, []);

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      {/* Left - Add Question */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <h3>Add Question</h3>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="mcq">MCQ</option>
          <option value="short">Short</option>
          <option value="blank">Blank</option>
        </select><br />

        <textarea
          placeholder="Question Text"
          value={form.questionText}
          onChange={e => setForm({ ...form, questionText: e.target.value })}
        /><br />

        {form.type === 'mcq' && form.options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={e => {
              const copy = [...form.options];
              copy[i] = e.target.value;
              setForm({ ...form, options: copy });
            }}
          />
        ))}

        <input
          placeholder="Correct Answer"
          value={form.correctAnswer}
          onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
        /><br />

        <input
          type="number"
          value={form.marks}
          onChange={e => setForm({ ...form, marks: Number(e.target.value) })}
        /><br />

        <button onClick={handleAdd}>Add Question</button>
      </div>

      {/* Right - Question List */}
      <div style={{ flex: 1 }}>
        <h3>Added Questions</h3>
        {filteredQuestions().map((q, i) => (
          <div key={q._id} style={{ background: '#f5f5f5', padding: 10, marginBottom: 8 }}>
            <strong>{i + 1}. </strong>{q.questionText} <em>({q.type}, {q.marks} marks)</em>
            <button style={{ marginLeft: 10, color: 'red' }} onClick={() => handleDelete(q._id)}>🗑 Delete</button>
          </div>
        ))}
        {filteredQuestions().length === 0 && <p>No questions yet.</p>}
      </div>
    </div>
  );
};

export default ManageQuestions;
