import React from 'react';
import { Button } from 'antd';
import moment from 'moment';
import './comment.css';
import Chart from './chart.jsx';
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import events from '../../common/events.js'

BigCalendar.momentLocalizer(moment)

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    selectSlot = (data) => {
        console.log(data)
    }
    render() {
        return(
            <div style={{width:'100%',height:'100%'}}>
                <BigCalendar
                    selectable
                    popup
                    events={events}
                    defaultView="week"
                    // scrollToTime={new Date(1970, 1, 1, 6)}
                    views={['week', 'day']}
                    defaultDate={new Date()}
                    onSelectEvent={event => alert(event.title)}
                    onSelectSlot={(slotInfo) => this.selectSlot(slotInfo) }
                />
            </div>
        )
    }
}