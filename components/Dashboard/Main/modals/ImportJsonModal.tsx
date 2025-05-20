import React, { useState } from "react";

import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";

const prompt = `
Bạn là Grok 3, được xây dựng bởi xAI. Tôi cung cấp một tài liệu (hình ảnh, file PDF hoặc Word) chứa thông tin về các môn học. Nhiệm vụ của bạn là phân tích tài liệu và trích xuất thông tin về các môn học, bao gồm tên môn học, mã môn học, số tín chỉ và điểm chữ (gradeLatin). Sau đó, xuất kết quả dưới dạng JSON theo định dạng sau:

{
  "subjects": [
    {
      "name": "Tên môn học",
      "code": "Mã môn học",
      "credit": Số tín chỉ,
      "gradeLatin": "Điểm chữ"
    }
  ]
}

Yêu cầu chi tiết:
1. Phân tích tài liệu: Đọc toàn bộ nội dung từ hình ảnh, PDF hoặc Word bằng cách sử dụng OCR (nếu cần) để xác định các thông tin liên quan đến môn học.
2. Trích xuất thông tin:
   - name (string, bắt buộc): Tên môn học, ví dụ: "Advanced Math", "General Physics".
   - code (string, bắt buộc): Mã môn học, ví dụ: "MATH101", "PHYS102".
   - credit (number, bắt buộc): Số tín chỉ của môn học, ví dụ: 3, 4.
   - gradeLatin (string, bắt buộc): Điểm chữ của môn học, ví dụ: "A", "B+".
3. Xử lý dữ liệu:
   - Nếu thông tin không đầy đủ hoặc không rõ ràng (thiếu tên, mã, tín chỉ hoặc điểm), bỏ qua môn học đó và tiếp tục với các môn học khác.
   - Đảm bảo định dạng JSON hợp lệ, với tất cả các trường được điền đầy đủ và đúng kiểu dữ liệu (credit là số, các trường khác là chuỗi).
4. Kết quả:
   - Trả về JSON chứa danh sách các môn học theo định dạng đã cho.
   - Nếu tài liệu không chứa dữ liệu môn học, trả về JSON với "subjects" là mảng rỗng: {"subjects": []} và thêm ghi chú trong "assumptions" (nếu cần).

Ví dụ tài liệu đầu vào:
- Bảng hoặc văn bản như: "Advanced Math, MATH101, 3 tín chỉ, A" hoặc "General Physics, PHYS102, 4 tín chỉ, B+".
- Hoặc bảng với các cột: Tên môn học, Mã môn học, Tín chỉ, Điểm.

Xử lý lỗi:
- Nếu tài liệu không đọc được hoặc không có dữ liệu môn học, trả về:
  {
    "subjects": [],
    "assumptions": ["Không tìm thấy dữ liệu môn học trong tài liệu"]
  }

Hãy xử lý tài liệu được cung cấp và trả về JSON chính xác theo định dạng trên.`;

const ImportJsonModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copyPrompt, setCopyPrompt] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    } else {
      alert("Please select a JSON file before submitting.");
    }
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-color-15 mb-4">
          Import JSON to Update Grades
        </h3>
        <p className="text-color-15 mb-4">
          The JSON file should follow this format:
        </p>
        <pre className="bg-color-1 text-color-15 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap overflow-x-auto border border-1 border-color-15">
          {`{
  "subjects": [
    {
      "name": "Advanced Math",
      "code": "MATH101",
      "credit": 3,
      "gradeLatin": "A"
    },
    {
      "name": "General Physics",
      "code": "PHYS102",
      "credit": 4,
      "gradeLatin": "B+"
    }
  ]
}`}
        </pre>

        <div className="py-2">
          {
            "If you having a csv file, you can use AI with our prompt to generate valid json file."
          }
          <GenericButton
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(`${prompt}`);
              setCopyPrompt(true);
              setTimeout(() => {
                setCopyPrompt(false);
              }, 5000);
            }}
          >
            {copyPrompt ? "Copied" : "Copy Prompt"}
          </GenericButton>
        </div>
        <div className="mb-6">
          <label className="inline-block bg-color-1 text-color-15 rounded-lg px-4 py-2 cursor-pointer hover:bg-color-6 transition-all duration-300 border border-color-15">
            Select JSON File
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <p className="text-color-15 mt-2">Selected: {selectedFile.name}</p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="min-w-[200px] bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-2 hover:from-color-9 hover:to-color-1 transition-all duration-300 border border-color-15 shadow-lg hover:shadow-color-15/50"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportJsonModal;
