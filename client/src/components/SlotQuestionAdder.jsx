
import React, { useState } from 'react';
import api from '../services/api';

const SlotQuestionAdder = ({ testId, dateIndex, slotIndex, onQuestionAdded }) => {
  const [type, setType] = useState('mcq');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        type,
        questionText,
        correctAnswer,
        marks,
      };
      if (type === 'mcq') payload.options = options;

      await api.post(`/test/${testId}/dateslot/${dateIndex}/slot/${slotIndex}/question`, payload);
      alert('Question added!');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setMarks(1);
      if (onQuestionAdded) onQuestionAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add question');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 10, border: '1px solid #ccc', padding: 10 }}>
      <label>Type:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="mcq">MCQ</option>
          <option value="short">Short Answer</option>
          <option value="blank">Fill in the Blank</option>
        </select>
      </label>
      <br />
      <textarea
        placeholder="Question Text"
        value={questionText}
        onChange={e => setQuestionText(e.target.value)}
      />
      <br />
      {type === 'mcq' && options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => handleOptionChange(i, e.target.value)}
        />
      ))}
      <br />
      <input
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={e => setCorrectAnswer(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Marks"
        value={marks}
        onChange={e => setMarks(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding...' : 'Add Question'}
      </button>
    </div>
  );
};

export default SlotQuestionAdder;
