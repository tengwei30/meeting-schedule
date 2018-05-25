import React from 'react';
// import { Button } from 'antd';
import moment from 'moment';
import './comment.css';
import Calendar from 'tui-calendar';
import datePicker from 'tui-date-picker'
// import { chance } from 'chance';
import { findCalendar } from '../../common/calendar.js';

export default class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            CalendarList: []
        }
    }
    componentDidMount () {
        const { CalendarList } = this.state
        const calendarList = document.getElementById('calendarList')
        const html = []
        CalendarList.forEach(function(calendar) {
            html.push('<div class="lnb-calendars-item"><label>' +
                '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
                '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
                '<span>' + calendar.name + '</span>' +
                '</label></div>'
            )
        })
        calendarList.innerHTML = html.join('\n')
        this.getInit()
    }
    getInit () {
        const _this = this
        const { CalendarList } = this.state

        const calen = document.getElementById('content');
        const cal = new Calendar(calen, {
            defaultView: 'week',
            taskView: false,
            useCreationPopup: true,
            useDetailPopup: true,
            template: {
                milestone: function(model) {
                    return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
                },
                allday: function(schedule) {
                    return _this.getTimeTemplate(schedule, true)
                },
                time: function(schedule) {
                    return _this.getTimeTemplate(schedule, false)
                }
            },
            mouth: {
                visibleWeeksCount: 2
            },
            week: {
                daynames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                startDayOfWeek: 1,
                narrowWeekend: true
            }
        })
        cal.on({
            'clickSchedule': function(e) {
                console.log('clickSchedule', e)
            },
            'clickDayname': function(date) {    // 点击日期
                console.log('clickDayname', date)
            },
            'beforeCreateSchedule': function(e) {  // 点击save触发
                console.log(JSON.stringify(e))
                _this.saveNewSchedule(e)
                
            },
            'beforeUpdateSchedule': function(e) {
                console.log('beforeUpdateSchedule', e)
                e.schedule.start = e.start;
                e.schedule.end = e.end;
                // cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
            },
            'beforeDeleteSchedule': function(e) {
                console.log('beforeDeleteSchedule', e)
                // cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
            },
            'afterRenderSchedule': function(e) {
                const schedule = e.schedule
                // var element = cal.getElement(schedule.id, schedule.calendarId);
            }
        })
        // document.getElementById('btn-save-schedule').addEventListener("click", this.onNewSchedule)
    }
    saveNewSchedule (e) {
        const calendar = e.calendar || findCalendar(e.calendarId);
                const schedule = {
                    id: String(Math.random()),
                    title: e.title,
                    isAllDay: e.isAllDay,
                    start: e.start,
                    end: e.end,
                    category: e.isAllDay ? 'allday' : 'time',
                    dueDateClass: '',
                    color: e.color,
                    bgColor: e.bgColor,
                    dragBgColor: e.bgColor,
                    borderColor: e.borderColor,
                    raw: {
                        'class': e.raw['class'],
                        location: e.raw.location
                    },
                    state: e.state
                };
                if (calendar) {
                    schedule.calendarId = calendar.id;
                    schedule.color = calendar.color;
                    schedule.bgColor = calendar.bgColor;
                    schedule.borderColor = calendar.borderColor;
                }
                cal.createSchedules([schedule]);
                // this.refreshScheduleVisibility()
                var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
                CalendarList.forEach(function(calendar) {
                    cal.toggleSchedules(calendar.id, !calendar.checked, false);
                });
                cal.render();
                calendarElements.forEach(function(input) {
                    var span = input.nextElementSibling;
                    span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
                });
    }

    refreshScheduleVisibility () {   // 更新数据的可见性
        const { CalendarList } = this.state
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render();

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    onNewSchedule() {
        const title = document.getElementById('new-schedule-title').val()
        const location = document.getElementById('new-schedule-location').val()
        const isAllDay = document.getElementById('new-schedule-allday').checked
        const start = datePicker.getStartDate()
        const end = datePicker.getEndDate()
        const calendar = selectedCalendar ? selectedCalendar : CalendarList[0]

        if (!title) {
            return;
        }

        calendar.createSchedules([{
            id: String(Math.random()),
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location
            },
            state: 'busy'
        }]);

        document.getElementById('modal-new-schedule').modal('hide');
    }
    getTimeTemplate(schedule, isAllDay) {
        const html = [];
        const start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            html.push(' ' + schedule.title);
        }

        return html.join('');
    }
    render() {
        return(
            <div style={{width:'100%',height:700,backgroundColor: '#fff'}}>
                <div id="content"></div>
            </div>
        )
    }
}