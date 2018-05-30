import React from 'react';
import times from '../../common/timeConfig.js';
import {message} from 'antd';
import './comment.css';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import Week from "./week.jsx";
import Dmodal from './Modal.jsx';
import BigCalendar from 'react-big-calendar'
import events from '../../common/events.js'
import 'react-big-calendar/lib/css/react-big-calendar.css' 

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

@inject('commentStore', 'layoutStore','modalStore')
@observer
export default class Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    componentWillMount () {
        autorun(() => {
            const { RoomId } = this.props.layoutStore
            this.props.commentStore.fetchData(RoomId)
            this._roomStates()
        })
    }
    _roomStates () {
        let _this = this
        socket.on('roomStates',function(data) {
            _this.props.commentStore.setresponseData(data)
        })
    }
    showModel = (item) => {
        console.log(item)
        // console.log(moment(item.start).format("YYYY-MM-DD"), item.end)
        // const nowTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).getTime() - 1800000
        // if(val.time < nowTime) {
        //     message.warning("不可预定过去时间～")
        //     return false
        // }
        this.props.modalStore.setVisibleModal(true)
        this.props.modalStore.setmodalData(item)
        // this.props.modalStore.setisModalData(val)
    }

    render() {
        const {commentStore} = this.props
        return(
            <div className="Chart">
                <div className="CtContent">
                    <div className="calendar">
                        <div className="content">
                            <BigCalendar 
                                selectable
                                events={commentStore.listDatas}
                                defaultView="week"
                                defaultDate={new Date()}
                                onSelectEvent={event => this.showModel(event)}
                                onSelectSlot={slotInfo =>this.showModel(slotInfo)}
                                views={['day', 'week']}
                            />
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