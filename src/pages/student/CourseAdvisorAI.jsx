import React, { useEffect, useState } from 'react';
import { fetchSuggestedCourses } from '../../api/fakeSuggestionsApi';
import { useUser } from '@clerk/clerk-react';

const CourseAdvisorAI = () => {
  const { user } = useUser();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [formData, setFormData] = useState({
    level: '',
    goal: '',
    interest: '',
  });

  const OPENAI_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // ❗️Thay bằng khóa thật của bạn

  // Danh sách khóa học demo cho AI gợi ý
  const courseCatalog = [
    { title: 'Lập trình Python cơ bản', field: 'lập trình', level: 'mới bắt đầu' },
    { title: 'Phân tích dữ liệu với Excel', field: 'dữ liệu', level: 'mới bắt đầu' },
    { title: 'Fullstack Web với React & Node.js', field: 'web', level: 'trung bình' },
    { title: 'Machine Learning nâng cao', field: 'AI', level: 'nâng cao' },
    { title: 'Thiết kế UI/UX cho người mới', field: 'thiết kế', level: 'mới bắt đầu' },
    { title: 'Kỹ năng giao tiếp chuyên nghiệp', field: 'kỹ năng mềm', level: 'mọi cấp' },
  ];

  // 🔹 Gọi API giả lập khi load trang
  useEffect(() => {
    const loadSuggestions = async () => {
      if (user?.id) {
        setLoading(true);
        const data = await fetchSuggestedCourses(user.id);
        setSuggestions(data);
        setLoading(false);
      }
    };
    loadSuggestions();
  }, [user]);

  // 🔹 Xử lý thay đổi form
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Gửi form cho OpenAI
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion('');

    const prompt = `
Tôi là một trợ lý giáo dục AI. Dưới đây là danh sách khóa học:
${courseCatalog.map(c => `- ${c.title} (${c.field}, ${c.level})`).join('\n')}

Dựa trên thông tin sau:
- Trình độ: ${formData.level}
- Mục tiêu học: ${formData.goal}
- Lĩnh vực quan tâm: ${formData.interest}

Hãy gợi ý 2-3 khóa học phù hợp nhất từ danh sách, giải thích vì sao chọn chúng.
Trả lời ngắn gọn, dễ hiểu bằng tiếng Việt.
`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không tìm được khóa phù hợp.';
      setSuggestion(reply);
    } catch (err) {
      console.error(err);
      setSuggestion('Lỗi xảy ra khi kết nối AI.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow mt-10 bg-white">
      <h2 className="text-2xl font-bold mb-4">🎓 Gợi ý khóa học bằng AI</h2>

      {/* 🔹 Gợi ý mặc định từ mock API */}
      {loading ? (
        <p className="mt-4 text-gray-500 italic">Đang tải gợi ý từ AI...</p>
      ) : (
        <>
          {suggestions.length > 0 && (
            <ul className="mt-4 space-y-4">
              {suggestions.map((course) => (
                <li key={course.id} className="p-4 bg-gray-100 border rounded">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 🔹 Form AI */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block font-medium">1. Trình độ hiện tại của bạn?</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          >
            <option value="">-- Chọn trình độ --</option>
            <option value="mới bắt đầu">Mới bắt đầu</option>
            <option value="trung bình">Trung bình</option>
            <option value="nâng cao">Nâng cao</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">2. Mục tiêu học của bạn là gì?</label>
          <input
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="Ví dụ: Tìm việc, nâng cao kỹ năng..."
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">3. Bạn quan tâm lĩnh vực nào?</label>
          <input
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            placeholder="Ví dụ: lập trình, thiết kế, dữ liệu..."
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Gợi ý ngay
        </button>
      </form>

      {/* 🔹 Kết quả gợi ý của AI */}
      {suggestion && (
        <div className="mt-6 bg-gray-100 p-4 rounded border text-gray-800 whitespace-pre-line">
          {suggestion}
        </div>
      )}
    </div>
  );
};

export default CourseAdvisorAI;
