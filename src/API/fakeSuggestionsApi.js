// fakeSuggestionsApi.js

export const fetchSuggestedCourses = async (userId) => {
  console.log('Giả lập gọi API:', `/api/suggestions?userId=${userId}`);

  // Giả lập độ trễ API (network delay)
  await new Promise((res) => setTimeout(res, 1000));

  // Trả về danh sách gợi ý mẫu
  return [
    {
      id: 1,
      title: "Lập trình Python cho người mới",
      description: "Khóa học giúp bạn bắt đầu với Python từ con số 0.",
    },
    {
      id: 2,
      title: "Thiết kế UI/UX cơ bản",
      description: "Hiểu tư duy thiết kế, nguyên tắc giao diện người dùng.",
    },
    {
      id: 3,
      title: "Web Fullstack với React & Node",
      description: "Xây dựng website từ frontend tới backend.",
    },
  ];
};
