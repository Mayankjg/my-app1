"use client";

import React, { useState } from 'react';
import { ArrowRight, Calendar, ArrowLeft } from 'lucide-react';

export default function LeadDateTimePicker() {
    const now = new Date();
    const [startDate] = useState(now.toISOString().split('T')[0]);
    const [startTime] = useState(now.toTimeString().slice(0, 8));
    const [remindDate, setRemindDate] = useState('');
    const [remindTime, setRemindTime] = useState('00:00');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingMinute, setSelectingMinute] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [currentAngle, setCurrentAngle] = useState(0);
    const [currentRadius, setCurrentRadius] = useState('outer');

    const daysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysArray = [];

        const firstDayOfWeek = firstDay.getDay();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            daysArray.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false
            });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            daysArray.push({
                day: i,
                isCurrentMonth: true
            });
        }

        const remainingDays = 42 - daysArray.length;
        for (let i = 1; i <= remainingDays; i++) {
            daysArray.push({
                day: i,
                isCurrentMonth: false
            });
        }

        return daysArray;
    };

    const handleDateSelect = (day, isCurrentMonth) => {
        if (!isCurrentMonth) return;

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        setRemindDate(`${year}-${month}-${dayStr}`);
        setShowCalendar(false);
    };

    const handleTimeClick = (hour) => {
        const hourStr = String(hour).padStart(2, '0');
        const currentMinute = remindTime.split(':')[1];
        setRemindTime(`${hourStr}:${currentMinute}`);
        setSelectingMinute(true);
    };

    const handleMinuteClick = (minute) => {
        const hourStr = remindTime.split(':')[0];
        const minuteStr = String(minute).padStart(2, '0');
        setRemindTime(`${hourStr}:${minuteStr}`);
        if (minute % 5 === 0) {
            setShowTimePicker(false);
            setSelectingMinute(false);
        }
    };

    const updateTimeFromAngle = (e, shouldAdvance = false) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        const distance = Math.sqrt(x * x + y * y);
        
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;
        
        setCurrentAngle(angle);

        if (!selectingMinute) {
            const isInner = distance < 65;
            setCurrentRadius(isInner ? 'inner' : 'outer');
            
            let baseHour = Math.round(angle / 30);
            if (baseHour >= 12) baseHour = 0;
            
            let hour;
            if (isInner) {
                hour = baseHour === 0 ? 12 : baseHour;
            } else {
                hour = baseHour;
                if (baseHour > 0) hour = baseHour + 12;
                if (hour >= 24) hour = 0;
            }
            
            const hourStr = String(hour).padStart(2, '0');
            const currentMinute = remindTime.split(':')[1];
            setRemindTime(`${hourStr}:${currentMinute}`);
            
            if (shouldAdvance && !isDragging) {
                setSelectingMinute(true);
            }
        } else {
            let totalMinutes = Math.round(angle / 6) % 60;
            const hourStr = remindTime.split(':')[0];
            const minuteStr = String(totalMinutes).padStart(2, '0');
            setRemindTime(`${hourStr}:${minuteStr}`);
        }
    };

    const handleClockClick = (e) => {
        updateTimeFromAngle(e, true);
    };

    const handleClockMouseMove = (e) => {
        if (!isDragging) return;
        updateTimeFromAngle(e, false);
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <label className="block text-gray-600 font-medium mb-3">
                            Lead Start Date
                        </label>
                        <div className="flex gap-10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={startDate}
                                    readOnly
                                    className="w-48 px-4 py-2.5 pr-12 border border-gray-300 rounded bg-gray-100 cursor-not-allowed text-gray-700"
                                />
                                <button className="absolute right-0 top-0 h-full px-3 bg-blue-500 text-white rounded-r flex items-center cursor-pointer justify-center">
                                    <Calendar className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={startTime}
                                readOnly
                                className="w-32 px-4 py-2.5 border border-gray-300 rounded bg-gray-200 text-gray-700 cursor-not-allowed text-center"
                            />
                        </div>  
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium mb-3">
                            Lead Remind Date
                        </label>
                        <div className="flex gap-10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={remindDate || '0000-00-00'}
                                    readOnly
                                    onClick={() => {
                                        setShowCalendar(!showCalendar);
                                        setShowTimePicker(false);
                                    }}
                                    className="w-48 px-4 py-2.5 pr-12 border border-gray-300 rounded bg-white text-gray-400 cursor-pointer"
                                    placeholder="0000-00-00"
                                />
                                <button
                                    onClick={() => {
                                        setShowCalendar(!showCalendar);
                                        setShowTimePicker(false);
                                    }}
                                    className="absolute right-0 top-0 h-full px-3 bg-blue-500 text-white rounded-r flex items-center justify-center cursor-pointer hover:bg-blue-600"
                                >
                                    <Calendar className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={remindTime}
                                readOnly
                                onClick={() => {
                                    setShowTimePicker(!showTimePicker);
                                    setShowCalendar(false);
                                    setSelectingMinute(false);
                                }}
                                className="w-32 px-4 py-2.5 border border-gray-300 rounded bg-white text-gray-700 text-center cursor-pointer"
                            />
                        </div>

                        {showCalendar && (
                            <div className="mt-1 mr-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-60">
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        onClick={prevMonth}
                                        className="text-blue-500 hover:text-blue-700 text-xl font-bold w-10 h-10 flex items-center justify-center"
                                    >
                                        <ArrowLeft size={256} strokeWidth={5} className="w-7 h-7" />
                                    </button>
                                    <h3 className="font-semibold text-gray-700">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </h3>
                                    <button
                                        onClick={nextMonth}
                                        className="text-blue-500 hover:text-blue-700 text-xl font-bold w-8 h-8"
                                    >
                                        <ArrowRight size={270} strokeWidth={5} className="w-7 h-7" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 mb-1">
                                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-gray-600 py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-0">
                                    {daysInMonth(currentMonth).map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDateSelect(item.day, item.isCurrentMonth)}
                                            disabled={!item.isCurrentMonth}
                                            className={`
                        py-1 text-center rounded text-sm
                        ${item.isCurrentMonth
                                                    ? 'text-gray-700 hover:bg-blue-100 cursor-pointer font-medium'
                                                    : 'text-gray-300 cursor-default'
                                                }
                        ${item.day === 2 && item.isCurrentMonth ? 'bg-blue-500 text-white font-bold' : ''}
                      `}
                                        >
                                            {item.day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showTimePicker && (
                            <div className="mt-2 bg-white ml-55 border border-gray-500 rounded-lg shadow-lg overflow-hidden w-64">
                                <div className="text-center mb-1 bg-white py-2">
                                    <span className={`text-3xl font-light ${selectingMinute ? 'text-gray-400' : 'text-cyan-400'}`}>
                                        {remindTime.split(':')[0]}
                                    </span>
                                    <span className="text-3xl font-light text-gray-400 mx-1">:</span>
                                    <span className={`text-3xl font-light ${selectingMinute ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        {remindTime.split(':')[1]}
                                    </span>
                                </div>

                                <div className="bg-gray-100 p-2">
                                    <div 
                                        className="relative w-48 h-48 mx-auto cursor-pointer"
                                        onClick={handleClockClick}
                                        onMouseDown={() => setIsDragging(true)}
                                        onMouseUp={() => setIsDragging(false)}
                                        onMouseLeave={() => setIsDragging(false)}
                                        onMouseMove={handleClockMouseMove}
                                    >
                                        <div className="absolute inset-0 border-2 border-gray-300 rounded-full bg-white"></div>
                                        {!selectingMinute ? (
                                            <>
                                                {[...Array(12)].map((_, i) => {
                                                    const hour = i + 1;
                                                    const angle = (hour * 30 - 90) * (Math.PI / 180);
                                                    const radius = 50;
                                                    const x = 96 + radius * Math.cos(angle);
                                                    const y = 96 + radius * Math.sin(angle);

                                                    return (
                                                        <button
                                                            key={hour}
                                                            onClick={() => handleTimeClick(hour)}
                                                            className={`    
                              absolute w-7 h-7 flex items-center justify-center rounded-full
                              text-sm hover:bg-cyan-100 transition-colors
                              ${parseInt(remindTime.split(':')[0]) === hour ? 'bg-white text-gray-800 font-semibold shadow-sm' : 'text-gray-500 font-normal'}
                            `}
                                                            style={{
                                                                left: `${x - 14}px`,
                                                                top: `${y - 14}px`
                                                            }}
                                                        >
                                                            {hour}
                                                        </button>
                                                    );
                                                })}
                                                
                                                {[...Array(12)].map((_, i) => {
                                                    const hour = i === 11 ? 0 : i + 13;
                                                    const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
                                                    const radius = 80;
                                                    const x = 96 + radius * Math.cos(angle);
                                                    const y = 96 + radius * Math.sin(angle);

                                                    return (
                                                        <button
                                                            key={`outer-${hour}`}
                                                            onClick={() => handleTimeClick(hour)}
                                                            className={`    
                              absolute w-7 h-7 flex items-center justify-center rounded-full
                              text-sm hover:bg-cyan-100 transition-colors
                              ${parseInt(remindTime.split(':')[0]) === hour ? 'bg-white text-gray-800 font-semibold shadow-sm' : 'text-gray-500 font-normal'}
                            `}
                                                            style={{
                                                                left: `${x - 14}px`,
                                                                top: `${y - 14}px`
                                                            }}
                                                        >
                                                            {hour === 0 ? '00' : hour}
                                                        </button>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            [...Array(12)].map((_, i) => {
                                                const minute = i * 5;
                                                const angle = (i * 30 - 90) * (Math.PI / 180);
                                                const radius = 80;
                                                const x = 96 + radius * Math.cos(angle);
                                                const y = 96 + radius * Math.sin(angle);

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleMinuteClick(minute)}
                                                        className={`    
                          absolute w-7 h-7 flex items-center justify-center rounded-full
                          text-sm hover:bg-cyan-100 transition-colors
                          ${parseInt(remindTime.split(':')[1]) === minute ? 'bg-white text-gray-800 font-semibold shadow-sm' : 'text-gray-500 font-normal'}
                        `}
                                                        style={{
                                                            left: `${x - 14}px`,
                                                            top: `${y - 14}px`
                                                        }}
                                                    >
                                                        {String(minute).padStart(2, '0')}
                                                    </button>
                                                );
                                            })
                                        )}

                                        <div
                                            className="absolute w-0.5 bg-cyan-400 origin-bottom"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                height: selectingMinute ? '74px' : (currentRadius === 'inner' ? '46px' : '74px'),
                                                transform: `translateX(-50%) translateY(-100%) rotate(${currentAngle}deg)`,
                                                transformOrigin: 'bottom center',
                                                transition: isDragging ? 'none' : 'all 0.1s ease-out'
                                            }}
                                        >
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                                        </div>

                                        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}