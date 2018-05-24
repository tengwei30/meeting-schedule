import React from 'react';
import { Button } from 'antd';
import moment, { months } from 'moment';
import './comment.css';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
// import Chart from './chart.jsx';
// import { inject, observer } from 'mobx-react';

// @inject('commentStore')
// @observer
BigCalendar.momentLocalizer(moment);
export default class Comment extends React.Component {
    // switchWeek = () => {
    //     this.props.commentStore.setswitchWeek(!this.props.commentStore.switchWeek)
    // }
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return(
            <div style={{width:'100%',height:'100%'}}>
                {/* {this.todayRender()}
                <Chart /> */}
                <BigCalendar
                    culture='en-GB'
                    events={[]}
                    views={['week']}
                    defaultView= 'week'
                    toolbar = {false}
                />
            </div>
        )
    }
    // todayRender() {
    //     return(
    //         <div className="btnDate">
    //             <p>今天：{moment().locale('zh-cn').format('dddd')}</p>
    //             <p><Button type="primary" onClick={this.switchWeek}>{this.props.commentStore.switchWeek ? '本周' : '下周' }</Button></p>
    //         </div>
    //     )
    // }
}