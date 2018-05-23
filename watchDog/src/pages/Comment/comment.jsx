import React from 'react';
// import { Button } from 'antd';
// import moment from 'moment';
import './comment.css';
import Calendar from 'tui-calendar';

export default class Comment extends React.Component {
    componentDidMount () {
        const cal = document.getElementById('content');
        const calendar = new Calendar(cal, {
            defaultView: 'week',
            taskView: false,
            useCreationPopup: true,
            useDetailPopup: true,
            template: {
                milestone: function(model) {
                    return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
                },
                allday: function(schedule) {
                    return getTimeTemplate(schedule, true);
                },
                time: function(schedule) {
                    return getTimeTemplate(schedule, false);
                }
            },
            week: {
                daynames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                startDayOfWeek: 1,
                // narrowWeekend: true
            }
        })
        cal.on({
            'clickSchedule': function(e) {
                console.log('clickSchedule', e);
            },
            'clickDayname': function(date) {
                console.log('clickDayname', date);
            },
            'beforeCreateSchedule': function(e) {
                console.log('beforeCreateSchedule', e);
                saveNewSchedule(e);
            },
            'beforeUpdateSchedule': function(e) {
                console.log('beforeUpdateSchedule', e);
                e.schedule.start = e.start;
                e.schedule.end = e.end;
                // cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
            },
            'beforeDeleteSchedule': function(e) {
                console.log('beforeDeleteSchedule', e);
                // cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
            },
            'afterRenderSchedule': function(e) {
                var schedule = e.schedule;
                // var element = cal.getElement(schedule.id, schedule.calendarId);
                // console.log('afterRenderSchedule', element);
            }
        })

        $('#btn-save-schedule').on('click', onNewSchedule)
    }
    onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
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
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }
    getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
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
            <div style={{width:'100%',height:800,backgroundColor: '#fff'}}>
                <div id="content"></div>
            </div>
        )
    }
}