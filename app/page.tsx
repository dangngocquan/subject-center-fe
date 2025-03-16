import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center gap-8 py-20 md:py-32 text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjMDBBQ0MxIiBvcGFjaXR5PSIwLjEiLz48L3N2ZyA=')] opacity-20 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-gray-900/50 to-transparent z-0" />

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl animate-fade-in">
          Tối Ưu Hóa <span className="text-cyan-400">Hành Trình Đại Học</span>
        </h1>
        <p className="relative z-10 text-xl md:text-2xl max-w-3xl font-light tracking-wide text-gray-300 animate-fade-in-up delay-100">
          Quản lý môn học, theo dõi điểm số, và lập kế hoạch học tập thông minh
          với công nghệ AI.
        </p>
        <div className="relative z-10 flex gap-6 animate-fade-in-up delay-200">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
              className:
                "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/40 px-8",
            })}
            href={siteConfig.links.register}
          >
            Đăng Ký Ngay
          </Link>
          <Link
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
              className:
                "border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-300 px-8",
            })}
            href={siteConfig.links.docs}
          >
            Tìm Hiểu Thêm
          </Link>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-gray-950 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">
            Giao Diện <span className="text-cyan-400">Thông Minh</span>
          </h2>
          <div className="relative bg-gray-900/80 p-8 rounded-2xl shadow-2xl shadow-cyan-500/20">
            <img
              alt="Dashboard preview"
              className="w-full max-w-4xl mx-auto rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
              src="/images/dashboard-preview.jpg"
            />
            <p className="mt-6 text-gray-400 font-light">
              Xem lịch học, điểm số, và GPA của bạn trong một giao diện trực
              quan.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTAgMHY0ME0zMCAwVjQwTTAgMTBIMzBNMCAzMEgzMCIgc3Ryb2tlPSIjMDBBQ0MxIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-10" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Công Cụ <span className="text-cyan-400">Hỗ Trợ Toàn Diện</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="group p-8 bg-gray-900/80 rounded-2xl hover:bg-gray-900 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <img
                alt="Lịch học thông minh"
                className="w-20 h-20 mx-auto mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                src="/images/schedule-icon.jpg"
              />
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                Xếp Lịch Tối Ưu
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Tự động tạo lịch học dựa trên lịch trường, tối ưu thời gian và
                số môn mỗi kỳ.
              </p>
            </div>
            <div className="group p-8 bg-gray-900/80 rounded-2xl hover:bg-gray-900 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <img
                alt="Quản lý môn học"
                className="w-20 h-20 mx-auto mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                src="/images/documents-icon.jpg"
              />
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                Quản Lý Môn Học
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Lưu trữ danh sách môn học đã học, đang học, và dự kiến học trong
                suốt chương trình.
              </p>
            </div>
            <div className="group p-8 bg-gray-900/80 rounded-2xl hover:bg-gray-900 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <img
                alt="Theo dõi GPA"
                className="w-20 h-20 mx-auto mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                src="/images/progress-icon.jpg"
              />
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                Theo Dõi GPA
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Tính GPA hiện tại và điểm cần đạt để đủ điều kiện tốt nghiệp ở
                các mức bằng.
              </p>
            </div>
            <div className="group p-8 bg-gray-900/80 rounded-2xl hover:bg-gray-900 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <img
                alt="Dự đoán điểm"
                className="w-20 h-20 mx-auto mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                src="/images/score-icon.jpg"
              />
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                Dự Đoán Điểm
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Tính điểm cuối kỳ tối thiểu cần đạt dựa trên mục tiêu và điểm
                thành phần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-gray-900 to-cyan-900/40 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEwzMCAxNUw0NSAwIiBzdHJva2U9IiMwMEFDQzEiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-15" />

        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <img
            alt="Công nghệ học tập"
            className="w-72 h-72 object-contain opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-500"
            src="/images/cta-student.jpg"
          />
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Chủ Động <span className="text-cyan-400">Thành Công</span>
          </h2>
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
              className:
                "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/50 px-10 py-5 text-xl",
            })}
            href={siteConfig.links.register}
          >
            Bắt Đầu Miễn Phí
          </Link>
        </div>
      </section>
    </main>
  );
}
