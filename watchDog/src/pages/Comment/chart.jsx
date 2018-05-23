import React from 'react';
import times from '../../common/timeConfig.js';
import {message} from 'antd';
import './comment.css';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import Week from "./week.jsx";
import Dmodal from './Modal.jsx';

import Calendar from 'tui-calendar';

@inject('commentStore', 'layoutStore','modalStore')
@observer
export default class Chart extends React.Component {
    constructor(props) {
        super(props)
    }
    componentWillMount () {
        autorun(() => {
            const { RoomId } = this.props.layoutStore
            this.props.commentStore.fetchData(RoomId)
            this._roomStates()
        })
    }
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
        calendar.on({
        //     'clickSchedule': function(e) {
        //         console.log('clickSchedule', e);
        //     },
        //     'clickDayname': function(date) {
        //         console.log('clickDayname', date);
        //     },
        //     'beforeCreateSchedule': function(e) {
        //         console.log('beforeCreateSchedule', e);
        //         saveNewSchedule(e);
        //     },
        //     'beforeUpdateSchedule': function(e) {
        //         console.log('beforeUpdateSchedule', e);
        //         e.schedule.start = e.start;
        //         e.schedule.end = e.end;
        //         cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
        //     },
        //     'beforeDeleteSchedule': function(e) {
        //         console.log('beforeDeleteSchedule', e);
        //         cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        //     },
        //     'afterRenderSchedule': function(e) {
        //         var schedule = e.schedule;
        //         // var element = cal.getElement(schedule.id, schedule.calendarId);
        //         // console.log('afterRenderSchedule', element);
        //     }
        })
    }
    _roomStates () {
        let _this = this
        socket.on('roomStates',function(data) {
            _this.props.commentStore.setresponseData(data)
        })
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
    showModel = (item, val) => {
        const nowTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).getTime() - 1800000
        if(val.time < nowTime) {
            message.warning("不可预定过去时间～")
            return false
        }
        this.props.modalStore.setVisibleModal(true)
        this.props.modalStore.setmodalData(item)
        this.props.modalStore.setisModalData(val)
    }
    render() {
        const {commentStore} = this.props
        return(
            <div className="Chart">
                <div className="CtContent">
                    <div className="calendar">
                        <div className="content" style={{height:700}} id="content">
                            {/* <div className="timeBlock">
                                <div style={{borderBottom: '3px solid #f3f3f3', height: 21,width:'100%',paddingBottom:'48px'}}></div>
                                {
                                    times.map((item,key) => {
                                        return(
                                            <div key={key} className="clock">{item}</div>
                                        )
                                    })
                                }
                            </div>
                            {
                                commentStore.switchWeek ? (
                                    commentStore.columnData.slice(0, 7).map((item, key) => {
                                       return (
                                           <div className="weekday" key={key}>
                                               <Week
                                                    {...item}
                                                    onShow = {this.showModel}
                                                />
                                           </div>
                                       )
                                    })
                                ) : (
                                    commentStore.columnData.slice(7, 14).map((item, key)=> {
                                        return (
                                            <div className="weekday" key={key}>
                                                <Week
                                                     {...item}
                                                     onShow = {this.showModel}
                                                 />
                                            </div>
                                        )
                                     })
                                )
                            } */}
                        </div>
                    </div>
                </div>
                <Dmodal
                    roomId={this.props.layoutStore.RoomId}
                />
            </div>
        )
    }
}