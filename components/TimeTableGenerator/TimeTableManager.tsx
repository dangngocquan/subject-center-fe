// components/TimeTable/TimeTableManager.tsx
"use client";

import React, { useState } from "react";

import TimeTableInput from "./TimeTableInput/TimeTableInput";
import { CourseItem, TimeTable } from "./types";
import TimeTableResult from "./TimeTableResult/TimeTableResult";

// Add a selected state to CourseItem
interface CourseItemWithStatus extends CourseItem {
  selected: boolean;
}

const TimeTableManager: React.FC = () => {
  const [courses, setCourses] = useState<CourseItemWithStatus[]>([]);
  const [timetables, setTimetables] = useState<TimeTable[]>([]);
  const [currentTimetableIndex, setCurrentTimetableIndex] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // List of 20 diverse colors suitable for the theme
  const colorPalette = [
    {
      bg: "bg-cyan-500/50",
      border: "border-cyan-400/50",
      hoverShadow: "hover:shadow-cyan-500/50",
    },
    {
      bg: "bg-green-500/50",
      border: "border-green-400/50",
      hoverShadow: "hover:shadow-green-500/50",
    },
    {
      bg: "bg-yellow-500/50",
      border: "border-yellow-400/50",
      hoverShadow: "hover:shadow-yellow-500/50",
    },
    {
      bg: "bg-red-500/50",
      border: "border-red-400/50",
      hoverShadow: "hover:shadow-red-500/50",
    },
    {
      bg: "bg-purple-500/50",
      border: "border-purple-400/50",
      hoverShadow: "hover:shadow-purple-500/50",
    },
    {
      bg: "bg-blue-500/50",
      border: "border-blue-400/50",
      hoverShadow: "hover:shadow-blue-500/50",
    },
    {
      bg: "bg-pink-500/50",
      border: "border-pink-400/50",
      hoverShadow: "hover:shadow-pink-500/50",
    },
    {
      bg: "bg-teal-500/50",
      border: "border-teal-400/50",
      hoverShadow: "hover:shadow-teal-500/50",
    },
    {
      bg: "bg-orange-500/50",
      border: "border-orange-400/50",
      hoverShadow: "hover:shadow-orange-500/50",
    },
    {
      bg: "bg-indigo-500/50",
      border: "border-indigo-400/50",
      hoverShadow: "hover:shadow-indigo-500/50",
    },
    {
      bg: "bg-lime-500/50",
      border: "border-lime-400/50",
      hoverShadow: "hover:shadow-lime-500/50",
    },
    {
      bg: "bg-amber-500/50",
      border: "border-amber-400/50",
      hoverShadow: "hover:shadow-amber-500/50",
    },
    {
      bg: "bg-emerald-500/50",
      border: "border-emerald-400/50",
      hoverShadow: "hover:shadow-emerald-500/50",
    },
    {
      bg: "bg-rose-500/50",
      border: "border-rose-400/50",
      hoverShadow: "hover:shadow-rose-500/50",
    },
    {
      bg: "bg-violet-500/50",
      border: "border-violet-400/50",
      hoverShadow: "hover:shadow-violet-500/50",
    },
    {
      bg: "bg-fuchsia-500/50",
      border: "border-fuchsia-400/50",
      hoverShadow: "hover:shadow-fuchsia-500/50",
    },
    {
      bg: "bg-sky-500/50",
      border: "border-sky-400/50",
      hoverShadow: "hover:shadow-sky-500/50",
    },
    {
      bg: "bg-stone-500/50",
      border: "border-stone-400/50",
      hoverShadow: "hover:shadow-stone-500/50",
    },
    {
      bg: "bg-zinc-500/50",
      border: "border-zinc-400/50",
      hoverShadow: "hover:shadow-zinc-500/50",
    },
    {
      bg: "bg-slate-500/50",
      border: "border-slate-400/50",
      hoverShadow: "hover:shadow-slate-500/50",
    },
  ];

  // Map colors based on the index order of selectedCourses
  const getColorMap = (selectedCourses: CourseItemWithStatus[]) => {
    const colorMap: { [courseCode: string]: (typeof colorPalette)[number] } =
      {};
    const uniqueCourses = Array.from(
      new Set(selectedCourses.map((course) => course.courseCode))
    );
    uniqueCourses.forEach((courseCode, index) => {
      colorMap[courseCode] = colorPalette[index % colorPalette.length];
    });
    return colorMap;
  };

  // Function to convert CourseItem to a format compatible with the algorithm
  interface SubjectForTimetable {
    courseCode: string;
    courseName: string;
    credits: number;
    listTimes: number[][]; // List of periods for each class
    listEnableTimeLessons: boolean[]; // Enable state for each class
  }

  // Group CourseItem by courseCode and create SubjectForTimetable
  const prepareSubjects = (
    items: CourseItemWithStatus[]
  ): { subjects: SubjectForTimetable[]; maxLessonPerDay: number } => {
    const grouped: { [key: string]: CourseItemWithStatus[] } = {};
    items.forEach((item) => {
      if (!grouped[item.courseCode]) {
        grouped[item.courseCode] = [];
      }
      grouped[item.courseCode].push(item);
    });

    const maxDays = 7;

    // Calculate maxLessonPerDay based on the largest period
    let maxLessonPerDay = 10;
    items.forEach((course) => {
      const maxPeriod = Math.max(...course.period);
      if (maxPeriod > maxLessonPerDay) {
        maxLessonPerDay = maxPeriod;
      }
    });

    const subjects = Object.entries(grouped)
      .map(([courseCode, courseList]) => {
        const validCourseList = courseList.filter((course) => {
          const isValidDay =
            course.dayOfWeek >= 0 && course.dayOfWeek < maxDays;
          const isValidPeriod = course.period.every(
            (p) => p >= 1 && p <= maxLessonPerDay
          );
          if (!isValidDay || !isValidPeriod) {
            console.warn(
              `Course ${course.courseCode} - ${course.classCode} has invalid dayOfWeek (${course.dayOfWeek}) or period (${course.period}) - maxLessonPerDay: ${maxLessonPerDay}`
            );
            return false;
          }
          return true;
        });

        return {
          courseCode,
          courseName: validCourseList[0]?.courseName || "",
          credits: validCourseList[0]?.credits || 0,
          listTimes: validCourseList.map((course) =>
            course.period.map(
              (period) => course.dayOfWeek * maxLessonPerDay + period - 1
            )
          ),
          listEnableTimeLessons: validCourseList.map(() => true),
        };
      })
      .filter((subject) => subject.listTimes.length > 0);

    return { subjects, maxLessonPerDay };
  };

  // Algorithm to generate timetables
  const calculateTimetables = (
    subjects: SubjectForTimetable[],
    maxLessonPerDay: number
  ): number[][] => {
    const result: number[][] = [];
    const maxDays = 7;
    const status = new Array(maxLessonPerDay * maxDays).fill(0);
    const tempIndexTimeLessons = new Array(subjects.length).fill(-1);

    const find = (
      indexSubject: number,
      subjects: SubjectForTimetable[],
      status: number[],
      tempIndexTimeLessons: number[],
      result: number[][]
    ) => {
      if (indexSubject >= subjects.length) {
        result.push([...tempIndexTimeLessons]);
        return;
      }

      const subject = subjects[indexSubject];
      const listTimes = subject.listTimes;
      const listEnableTimes = subject.listEnableTimeLessons;

      for (
        let indexTimeLesson = 0;
        indexTimeLesson < listTimes.length;
        indexTimeLesson++
      ) {
        let valid = listEnableTimes[indexTimeLesson];
        for (const time of listTimes[indexTimeLesson]) {
          if (time >= status.length || time < 0) {
            console.error(
              `Invalid time index: ${time} for subject ${subject.courseCode}`
            );
            valid = false;
            continue;
          }
          status[time]++;
          if (status[time] > 1) valid = false;
        }
        if (valid) {
          tempIndexTimeLessons[indexSubject] = indexTimeLesson;
          find(
            indexSubject + 1,
            subjects,
            status,
            tempIndexTimeLessons,
            result
          );
        }
        tempIndexTimeLessons[indexSubject] = -1;
        for (const time of listTimes[indexTimeLesson]) {
          if (time >= status.length || time < 0) continue;
          status[time]--;
        }
      }
    };

    if (subjects.length > 0) {
      find(0, subjects, status, tempIndexTimeLessons, result);
    }
    return result;
  };

  // Function to create timetables from the list of selected courses
  const generateTimetables = () => {
    setIsCalculating(true);
    const selectedCourses = courses.filter((course) => course.selected);
    const { subjects, maxLessonPerDay } = prepareSubjects(selectedCourses);

    const timetableIndices = calculateTimetables(subjects, maxLessonPerDay);
    const result: TimeTable[] = timetableIndices.map((indices) => {
      const timetableCourses: CourseItem[] = [];
      let totalCredits = 0;

      indices.forEach((timeIndex, subjectIndex) => {
        if (timeIndex >= 0) {
          const subject = subjects[subjectIndex];
          const courseList = selectedCourses.filter(
            (c) => c.courseCode === subject.courseCode
          );
          const selectedCourse = courseList[timeIndex];
          timetableCourses.push(selectedCourse);
          totalCredits += selectedCourse.credits;
        }
      });

      return { courses: timetableCourses, totalCredits };
    });

    setTimetables(result);
    setIsCalculating(false);
  };

  // Map colors for the courses
  const colorMap = getColorMap(courses.filter((course) => course.selected));

  return (
    <div className="flex flex-row gap-4 p-4 h-[90%]">
      <div className="w-1/3">
        <TimeTableInput
          courses={courses}
          isCalculating={isCalculating}
          setCourses={setCourses}
          onGenerate={generateTimetables}
        />
      </div>
      <div className="w-2/3">
        <TimeTableResult
          colorMap={colorMap} // Pass colorMap to TimeTableResult
          currentIndex={currentTimetableIndex}
          setCurrentIndex={setCurrentTimetableIndex}
          timetables={timetables}
        />
      </div>
    </div>
  );
};

export default TimeTableManager;
