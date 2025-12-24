'use client';

import React, { useState } from 'react';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';

const LeadsCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
    const [viewMode, setViewMode] = useState('month');

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const fullDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const timeSlots = [
        '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
        '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
    ];

    const leadsData = {
        '2025-11-8': 2,
        '2025-11-13': 0
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const getWeekDays = (date) => {
        const current = new Date(date);
        const first = current.getDate() - current.getDay();
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(current);
            day.setDate(first + i);
            weekDays.push(day);
        }

        return weekDays;
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const getLeadsForDate = (date) => {
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return leadsData[dateStr];
    };

    const isToday = (date) => {
        const today = new Date(2025, 10, 13);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const handleTimeSlotClick = (day, time) => {
        console.log('Clicked:', day, time);
    };

    const days = getDaysInMonth(currentDate);
    const weekDays = getWeekDays(currentDate);

    return (
        <div className="w-full h-screen bg-[#e8ecef] overflow-y-auto">
            <div className="py-2 sm:py-4 md:py-6">
                <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
                    <div className="bg-white rounded shadow border border-gray-200">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-normal text-[#4a4a4a]">
                                    Calendar : <span className="text-[#ef4444] font-normal">
                                        {monthNames[currentDate.getMonth()]}-{currentDate.getFullYear()}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 bg-[#334155] rounded-sm"></span>
                                    <span className="text-sm sm:text-base md:text-lg text-gray-800 font-normal">No. Of Leads</span>
                                </div>
                            </div>
                            <hr className="border-t border-gray-300 -mx-4 sm:-mx-6" />
                        </div>

                        <div className="px-4 sm:px-6 pb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-0 bg-[#38bdf8] rounded overflow-hidden">
                                    <button
                                        onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
                                        className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white p-2 sm:p-3 transition-colors border-r border-white/20"
                                    >
                                        <ArrowBigLeft size={20} className="sm:w-6 sm:h-6" />
                                    </button>
                                    <button
                                        onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
                                        className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white p-2 sm:p-3 transition-colors"
                                    >
                                        <ArrowBigRight size={20} className="sm:w-6 sm:h-6" />
                                    </button>
                                </div>

                                <div className="flex rounded overflow-hidden shadow-sm w-full sm:w-auto">
                                    <button
                                        onClick={() => setViewMode('month')}
                                        className={`flex-1 sm:flex-none px-6 sm:px-10 py-2 text-sm sm:text-base font-normal transition-colors ${viewMode === 'month'
                                            ? 'bg-[#14b8a6] text-white'
                                            : 'bg-[#14b8a6] text-white opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        month
                                    </button>
                                    <button
                                        onClick={() => setViewMode('week')}
                                        className={`flex-1 sm:flex-none px-6 sm:px-10 py-2 text-sm sm:text-base font-normal transition-colors ${viewMode === 'week'
                                            ? 'bg-[#14b8a6] text-white'
                                            : 'bg-[#14b8a6] text-white opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        week
                                    </button>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'month' && (
                            <div className="px-2 sm:px-6 pb-6">
                                <div className="bg-white rounded border border-gray-300 overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        <div className="grid grid-cols-7 bg-[#e5e7eb]">
                                            {daysOfWeek.map((day) => (
                                                <div
                                                    key={day}
                                                    className="text-center py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#6b7280] border-r border-b border-gray-300 last:border-r-0"
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7">
                                            {days.map((dayInfo, index) => {
                                                const leads = getLeadsForDate(dayInfo.date);
                                                const today = isToday(dayInfo.date);
                                                const isLastColumn = (index + 1) % 7 === 0;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`min-h-[70px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] border-b border-gray-300 p-2 sm:p-3 ${!isLastColumn ? 'border-r border-gray-300' : ''
                                                            } ${!dayInfo.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                                                            } hover:bg-gray-50 transition-colors relative`}
                                                    >
                                                        <div className="flex flex-col h-full">
                                                            <div className="text-left">
                                                                {today ? (
                                                                    <span className="inline-flex items-center justify-center text-white bg-[#ef4444] rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs sm:text-sm md:text-base font-normal">
                                                                        {dayInfo.day}
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className={`text-xs sm:text-sm md:text-base font-normal ${!dayInfo.isCurrentMonth
                                                                            ? 'text-gray-400'
                                                                            : 'text-gray-700'
                                                                            }`}
                                                                    >
                                                                        {dayInfo.day}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {dayInfo.isCurrentMonth && leads !== undefined && leads > 0 && (
                                                                <div className="mt-auto">
                                                                    <div className="bg-[#334155] text-white text-xs sm:text-sm font-semibold rounded px-2 sm:px-3 py-1 sm:py-1.5 inline-block">
                                                                        {leads}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {viewMode === 'week' && (
                            <div className="px-2 sm:px-6 pb-6">
                                <div className="bg-white rounded border border-gray-300 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <div className="min-w-[700px]">
                                            <div className="grid grid-cols-8 bg-[#e5e7eb] border-b border-gray-300">
                                                <div className="bg-[#e5e7eb] border-r border-gray-300"></div>
                                                {weekDays.map((day, dayIndex) => (
                                                    <div
                                                        key={dayIndex}
                                                        className="text-center min-h-[50px] sm:min-h-[60px] p-2 border-r border-gray-300 bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
                                                    >
                                                        <div className="text-xs sm:text-sm font-normal text-gray-700">
                                                            {fullDaysOfWeek[day.getDay()]} {day.getMonth() + 1}/{day.getDate()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-8 border-b border-gray-300">
                                                <div className="bg-[#e5e7eb] text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-normal text-gray-600 border-r border-gray-300">
                                                    all-day
                                                </div>
                                                {weekDays.map((day, dayIndex) => (
                                                    <div
                                                        key={dayIndex}
                                                        className="min-h-[40px] sm:min-h-[50px] p-2 border-r border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                                                    >
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px]">
                                                {timeSlots.map((time, timeIndex) => (
                                                    <div key={timeIndex} className="grid grid-cols-8 border-b border-gray-200 hover:bg-gray-50">
                                                        <div className="text-left py-4 px-2 text-xs sm:text-sm text-gray-600 border-r border-gray-300 bg-gray-50">
                                                            {time}
                                                        </div>
                                                        {weekDays.map((day, dayIndex) => (
                                                            <div
                                                                key={dayIndex}
                                                                className="min-h-[60px] p-2 border-r border-gray-300 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                                                                onClick={() => handleTimeSlotClick(day, time)}
                                                            >
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsCalendar;