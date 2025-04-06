// components/TimeTable/TimeTableInput/CourseList.tsx
import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

import { CourseItem } from "../types";

import GenericButton from "@/components/Common/GenericButton";
import GenericModal from "@/components/Common/GenericModal";

interface CourseItemWithStatus extends CourseItem {
  selected: boolean;
}

interface CourseListProps {
  courses: CourseItemWithStatus[];
  toggleCourseSelection: (courseCode: string) => void;
  setCourses: (courses: CourseItemWithStatus[]) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  toggleCourseSelection,
  setCourses,
}) => {
  const [editCourse, setEditCourse] = useState<CourseItemWithStatus | null>(
    null
  );

  const groupCoursesByCode = (items: CourseItemWithStatus[]) => {
    const grouped: { [key: string]: CourseItemWithStatus[] } = {};
    items.forEach((item) => {
      if (!grouped[item.courseCode]) {
        grouped[item.courseCode] = [];
      }
      grouped[item.courseCode].push(item);
    });
    return grouped;
  };

  const groupedCourses = groupCoursesByCode(courses);

  const handleUpdateSubmit = (updatedCourse: CourseItemWithStatus) => {
    const updatedCourses = courses.map((course) =>
      course === editCourse ? { ...updatedCourse } : course
    );
    setCourses(updatedCourses);
    setEditCourse(null);
  };

  return (
    <>
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-gray-700">Select</th>
              <th className="p-2 border border-gray-700">Course Code</th>
              <th className="p-2 border border-gray-700">Course Name</th>
              <th className="p-2 border border-gray-700">Credits</th>
              <th className="p-2 border border-gray-700">Class Code</th>
              <th className="p-2 border border-gray-700">Period</th>
              <th className="p-2 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedCourses).map(([courseCode, courseList]) => {
              const rowSpan = courseList.length;
              return courseList.map((course, index) => (
                <tr
                  key={`${courseCode}-${index}`}
                  className="border-b border-gray-700"
                >
                  {index === 0 && (
                    <>
                      <td
                        className="p-2 border border-gray-700 align-middle text-center"
                        rowSpan={rowSpan}
                      >
                        <input
                          checked={courseList[0].selected}
                          className="text-cyan-400 border-gray-700 rounded focus:ring-cyan-500"
                          type="checkbox"
                          onChange={() => toggleCourseSelection(courseCode)}
                        />
                      </td>
                      <td
                        className={`p-2 border border-gray-700 align-middle ${
                          course.selected ? "text-cyan-300" : "text-gray-500"
                        }`}
                        rowSpan={rowSpan}
                      >
                        {courseCode}
                      </td>
                      <td
                        className={`p-2 border border-gray-700 align-middle ${
                          course.selected ? "text-cyan-300" : "text-gray-500"
                        }`}
                        rowSpan={rowSpan}
                      >
                        {course.courseName}
                      </td>
                      <td
                        className="p-2 border border-gray-700 align-middle text-center"
                        rowSpan={rowSpan}
                      >
                        {course.credits}
                      </td>
                    </>
                  )}
                  <td className="p-2 border border-gray-700">
                    {course.classCode}
                  </td>
                  <td className="p-2 border border-gray-700">
                    Day {course.dayOfWeek + 1}, Period{" "}
                    {course.period.join(", ")}
                  </td>
                  <td className="p-2 border border-gray-700 text-center">
                    <div className="flex justify-center space-x-2">
                      <GenericButton
                        className="text-xs hover:bg-blue-500 hover:text-white"
                        onClick={() => setEditCourse(course)}
                      >
                        <FaEdit size={12} />
                      </GenericButton>
                      <GenericButton
                        className="text-xs hover:bg-red-500 hover:text-white"
                        onClick={() =>
                          setCourses(courses.filter((c) => c !== course))
                        }
                      >
                        <FaTrash size={12} />
                      </GenericButton>
                    </div>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa */}
      {editCourse && (
        <GenericModal isOpen={!!editCourse} onClose={() => setEditCourse(null)}>
          <div className="text-center text-white font-sans p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Edit Course
            </h3>
            <div className="space-y-4 text-left">
              <input
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                placeholder="Course Code"
                type="text"
                value={editCourse.courseCode}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, courseCode: e.target.value })
                }
              />
              <input
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                placeholder="Course Name"
                type="text"
                value={editCourse.courseName}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, courseName: e.target.value })
                }
              />
              <input
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                placeholder="Class Code"
                type="text"
                value={editCourse.classCode}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, classCode: e.target.value })
                }
              />
              <select
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                value={editCourse.dayOfWeek}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    dayOfWeek: parseInt(e.target.value),
                  })
                }
              >
                <option value={0}>Monday</option>
                <option value={1}>Tuesday</option>
                <option value={2}>Wednesday</option>
                <option value={3}>Thursday</option>
                <option value={4}>Friday</option>
                <option value={5}>Saturday</option>
                <option value={6}>Sunday</option>
              </select>
              <input
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                placeholder="Period (e.g., 1,2,3)"
                type="text"
                value={editCourse.period.join(",")}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    period: e.target.value
                      .split(",")
                      .map((p) => parseInt(p.trim()))
                      .filter((p) => !isNaN(p)),
                  })
                }
              />
              <input
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
                placeholder="Credits"
                type="number"
                value={editCourse.credits}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    credits: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <GenericButton onClick={() => setEditCourse(null)}>
                Cancel
              </GenericButton>
              <GenericButton onClick={() => handleUpdateSubmit(editCourse)}>
                Confirm
              </GenericButton>
            </div>
          </div>
        </GenericModal>
      )}
    </>
  );
};

export default CourseList;
