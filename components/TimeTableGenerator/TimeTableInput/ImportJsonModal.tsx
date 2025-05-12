// components/TimeTable/TimeTableInput/ImportJsonModal.tsx
"use client";

import React, { useState } from "react";

import { CourseItem } from "../types";

import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const prompt = `
Tôi cung cấp cho bạn một file dữ liệu trong định dạng <DOCUMENT> chứa các trang <PAGE> với nội dung từ <CONTENT_FROM_OCR>. Trong file này, tôi quan tâm đến các thông tin sau:

- Mã học phần (Course Code): Mã định danh duy nhất cho mỗi học phần.
- Tên học phần (Course Name): Tên đầy đủ của học phần.
- Mã lớp học phần (Class Code): Mã riêng cho từng lớp của học phần (một học phần có thể có nhiều lớp). Lưu ý: Nếu "Class Code" có dạng gộp như "HUS1011 1,2,3,4", "HUS1011 17-18-19-20", hoặc "HUS1011 1;2;3;4", hãy hiểu rằng đây là nhiều mã lớp riêng biệt (ví dụ: "HUS1011 1", "HUS1011 2", ... hoặc "HUS1011 17", "HUS1011 18", ...) nhưng chung lịch học, và cần tách thành các bản ghi riêng trong JSON. Ký tự phân cách có thể là dấu phẩy (,), dấu gạch ngang (-), dấu chấm phẩy (;), hoặc bất kỳ ký tự đặc biệt nào khác.
- Thứ (Day of Week): Ngày trong tuần mà lớp học diễn ra, được chuyển thành số nguyên từ 0 đến 6, với Thứ Hai = 0, Thứ Ba = 1, Thứ Tư = 2, Thứ Năm = 3, Thứ Sáu = 4, Thứ Bảy = 5, Chủ Nhật = 6.
- Tiết học (Period): Thời gian diễn ra lớp học, được chuyển thành mảng số (array of numbers). Ví dụ: "1-3" thành [1, 2, 3], "5" thành [5], "1,3,5" thành [1, 3, 5].
- Số tín chỉ (Credits): Số tín chỉ của học phần, thường là một số nguyên (ví dụ: 3, 4).

Yêu cầu của tôi:
1. Đọc và xử lý **toàn bộ dữ liệu** từ file được cung cấp trong <DOCUMENT>, bất kể kích thước dữ liệu lớn (ví dụ: hơn 52.000 ký tự).
2. Xử lý dữ liệu:
   - Chuyển "Day of Week" từ tên ngày (tiếng Anh hoặc tiếng Việt) thành số theo quy ước: "Monday" hoặc "Thứ Hai" = 0, "Tuesday" hoặc "Thứ Ba" = 1, ..., "Sunday" hoặc "Chủ Nhật" = 6.
   - Chuyển "Period" từ chuỗi thành mảng số:
     - Nếu là "x-y" (ví dụ: "1-3"), tạo mảng từ x đến y (bao gồm cả x và y).
     - Nếu là "x" (ví dụ: "5"), tạo mảng [x].
     - Nếu là "x,y,z" (ví dụ: "1,3,5"), tạo mảng [x, y, z].
     - Nếu không có thông tin, tạo mảng rỗng [].
   - Xử lý "Class Code":
     - Nếu "Class Code" là một giá trị đơn (ví dụ: "CS101-01"), giữ nguyên.
     - Nếu "Class Code" có dạng gộp (ví dụ: "HUS1011 1,2,3,4", "HUS1011 17-18-19-20", "HUS1011 1;2;3;4"):
       - Tách phần prefix (ví dụ: "HUS1011") và phần danh sách số (ví dụ: "1,2,3,4", "17-18-19-20", "1;2;3;4").
       - Xác định ký tự phân cách (dấu phẩy ",", dấu gạch ngang "-", dấu chấm phẩy ";", hoặc bất kỳ ký tự đặc biệt nào khác) bằng cách kiểm tra chuỗi:
         - Nếu chuỗi chứa nhiều ký tự đặc biệt, ưu tiên ký tự xuất hiện nhiều nhất làm phân cách.
         - Nếu không rõ ràng, mặc định dùng dấu phẩy (",") làm phân cách.
       - Tách danh sách số tại ký tự phân cách đã xác định để tạo các mã riêng biệt (ví dụ: "HUS1011 1", "HUS1011 2", ... hoặc "HUS1011 17", "HUS1011 18", ...).
       - Tạo bản ghi riêng cho từng mã, giữ nguyên các giá trị "Course Code", "Course Name", "Day of Week", "Period", và "Credits" cho tất cả.
   - Xử lý "Credits":
     - Nếu file chứa thông tin credits (ví dụ: "3", "4"), chuyển thành số nguyên và thêm vào mỗi bản ghi.
     - Nếu không có thông tin credits trong file, mặc định gán giá trị null và ghi chú trong "assumptions".
    
3. Trả về kết quả dưới dạng JSON với cấu trúc {items: []}, trong đó:
   - Mỗi phần tử trong mảng "items" là một object chứa 6 trường:
     - courseCode: string
     - courseName: string
     - classCode: string
     - dayOfWeek: number (0-6)
     - period: array of numbers
     - credits: number (hoặc null nếu không có dữ liệu)
   - **Không rút gọn hoặc bỏ sót bất kỳ phần tử nào**, đảm bảo toàn bộ dữ liệu từ file được phản ánh đầy đủ trong JSON, bao gồm tất cả các bản ghi sau khi tách "Class Code" gộp.
4. Nếu dữ liệu trong file không đầy đủ, không rõ ràng, hoặc không thể xử lý, hãy:
   - Ghi chú trong phần "assumptions" trong JSON.
   - Vẫn bao gồm các phần tử có thể xử lý được vào "items".
5. Nếu file không chứa dữ liệu cụ thể (chỉ có ký tự phân cách như "|"), trả về {items: []} và thêm ghi chú trong "assumptions".

Lưu ý:
- Đảm bảo xử lý toàn bộ dữ liệu, không giả định dữ liệu bị cắt hoặc chỉ trả về một phần kết quả.
- Kết quả JSON phải đầy đủ, không được rút ngắn để "giữ phản hồi ngắn gọn". Tôi muốn thấy tất cả các phần tử được xử lý từ file.
- Khi tách "Class Code" gộp, xử lý linh hoạt các ký tự phân cách (",", "-", ";", hoặc ký tự đặc biệt khác), đảm bảo nhận diện chính xác prefix và danh sách số.

Ví dụ output mong muốn:
{
  "items": [
    {
      "courseCode": "HUS1011",
      "courseName": "Introduction to History",
      "classCode": "HUS1011 17",
      "dayOfWeek": 0,
      "period": [1, 2, 3],
      "credits": 3
    },
    {
      "courseCode": "HUS1011",
      "courseName": "Introduction to History",
      "classCode": "HUS1011 18",
      "dayOfWeek": 0,
      "period": [1, 2, 3],
      "credits": 3
    },
    {
      "courseCode": "HUS1011",
      "courseName": "Introduction to History",
      "classCode": "HUS1011 19",
      "dayOfWeek": 0,
      "period": [1, 2, 3],
      "credits": 3
    },
    {
      "courseCode": "HUS1011",
      "courseName": "Introduction to History",
      "classCode": "HUS1011 20",
      "dayOfWeek": 0,
      "period": [1, 2, 3],
      "credits": 3
    }
  ]
}

Bây giờ, hãy áp dụng yêu cầu này vào file dữ liệu được cung cấp trong <DOCUMENT> và trả về kết quả dưới dạng JSON đầy đủ.`;

interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courses: CourseItem[]) => void; // Trả về CourseItem[], sẽ được thêm selected trong TimeTableInput
}

const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [copyPrompt, setCopyPrompt] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setJsonFile(file);
    } else {
      alert("Vui lòng chọn file JSON hợp lệ!");
    }
  };

  const handleSubmit = () => {
    if (!jsonFile) {
      alert("Vui lòng chọn file JSON trước!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.items && Array.isArray(parsed.items)) {
          onSubmit(parsed.items);
          setJsonFile(null);
        } else {
          alert("File JSON không đúng định dạng!");
        }
      } catch (error) {
        alert("File JSON không hợp lệ!");
      }
    };
    reader.readAsText(jsonFile);
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center text-color-15 font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Import Course từ File JSON
        </h3>
        <p className="text-color-15 mb-4">Chọn file JSON theo định dạng sau:</p>
        <pre className="border border-color-15 bg-color-1 text-color-15 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap overflow-x-auto text-sm">
          {`{
  "items": [
    {
      "courseCode": "MAT3422",
      "courseName": "Lý thuyết bản và vỏ mỏng",
      "classCode": "MAT3422",
      "dayOfWeek": 1,
      "period": [1, 2, 3],
      "credits": 4
    }
  ]
}`}
        </pre>
        <div className="py-2">
          {
            "If you having a csv file, you can use AI with our prompt to generate valid json file."
          }
          <GenericButton
            onClick={() => {
              navigator.clipboard.writeText(`${prompt}`);
              setCopyPrompt(true);
              setTimeout(() => {
                setCopyPrompt(false);
              }, 5000);
            }}
            className="ml-2"
          >
            {copyPrompt ? "Copied" : "Copy Prompt"}
          </GenericButton>
        </div>

        <div className="mb-6">
          <label className="inline-block bg-color-1 text-color-15 rounded-full px-4 py-2 cursor-pointer hover:bg-color-6 transition-all duration-300 border border-color-15">
            Chọn File JSON
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {jsonFile && (
            <p className="text-color-15 mt-2">Đã chọn: {jsonFile.name}</p>
          )}
        </div>
        <div className="flex w-full justify-between">
          <GenericButton onClick={onClose} className="hover:bg-color-R6 l-0 px-10">
            Hủy
          </GenericButton>
          <GenericButton onClick={handleSubmit} className="mr-0 px-10">
            Xác nhận
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportJsonModal;
