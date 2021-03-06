import React, { Component } from 'react'
import DateRangePicker from 'react-daterange-picker'
import UserService from '../../services/User'
import withRouter from 'react-router/withRouter'
import * as moment from 'moment'
import KhozContext from '../../services/Context'
import Axios from '../../services/Axios';
import './RoomContainer.css'
class BookRoom extends Component {
    state = {
        showCalendar: false,
        checkin: UserService.getSessionItem('check_in'),
        checkout: UserService.getSessionItem('check_out'),
        rooms_no: UserService.getSessionItem('rooms_no') ? UserService.getSessionItem('rooms_no') : 1,
        guests_no: UserService.getSessionItem('guests_no') ? UserService.getSessionItem('guests_no') : 1,
        noOfDays: null,
        pickDateText: UserService.getSessionItem('check_in')
            ? `${moment(UserService.getSessionItem('check_in')).format('MMM Do YY')} - ${moment(UserService.getSessionItem('check_out')).format('MMM Do YY')}`
            : 'Select checkin-checkout date',
        noOfRoomsError: null
    }

    componentWillMount() {
        let checkin = UserService.getSessionItem('check_in')
        if (checkin) {
            this.setState({
                checkin: checkin,
                checkout: UserService.getSessionItem('check_out'),
                noOfDays: moment(UserService.getSessionItem('check_out')).diff(moment(checkin), 'days')
            })
        
        }
    }
    openCalendar = () => {
        this.setState({ showCalendar: true })
    }
    handleDateSelect = range => {
        let checkin = moment(range.start).format('YYYY-MM-DD')
        let checkout = moment(range.end).format('YYYY-MM-DD')
        UserService.setSessionItem('check_in', checkin)
        UserService.setSessionItem('check_out', checkout)
        this.setState({
            showCalendar: false,
            pickDateText: `${moment(range.start).format('MMM Do YY')} - ${moment(range.end).format('MMM Do YY')}`,
            checkin: checkin,
            checkout: checkout,
            noOfDays: moment(range.end).diff(moment(range.start), 'days')
        })
    }
    roomCountChange = e => {
        e.preventDefault()
        if (e.target.value > this.props.room.room_count) {
            this.setState({
                rooms_no: e.target.value,
                noOfRoomsError: `Only ${this.props.room.room_count} rooms are available`
            })

        } else {
            this.setState({
                rooms_no: e.target.value,
                noOfRoomsError: null
            })
        }
    }
    guestCountChange = e => {
        e.preventDefault()
        if (e.target.value > this.state.rooms_no * this.props.room.max_capacity) {
            this.setState({
                guests_no: e.target.value,
                noOfGuestsError: `Only ${this.props.room.max_capacity} guests is allowed per room`
            })
        } else {
            this.setState({
                guests_no: e.target.value,
                noOfGuestsError: null
            })
        }
    }
    submitRoomBooking = () => {
        if (this.props.context.user) {
            let data = {
                room_id : this.props.room.id,
                checkin: this.state.checkin,
                checkout: this.state.checkout,
                room_count: this.state.rooms_no,
                guest_count: this.state.guests_no
            }
            console.log(data)
            Axios.authInstance.post(Axios.API.room.createReservationUrl, data).then(response => {
                if (response && response.data) {
                    this.props.history.push('/user/bookings')
                }
            })
        } else {
           this.props.history.push('/khoz/login')
        }
    }
    render() {
        let selectRooms = [];
        for (let i = 0; i < this.props.room.room_count; i++) {
            selectRooms.push(i + 1)
        }
        let selectGuests = []
        for (let i = 0; i < this.props.room.max_capacity * this.state.rooms_no; i++) {
            selectGuests.push(i + 1)
        }
        return (
            <React.Fragment>
                <div className='booking_portal_container'>
                    <h3>Book Room</h3>
                    <div className='book_form_datepicker'>
                    <h5>Check In - Check Out</h5>
                    <button onClick={this.openCalendar}>{this.state.pickDateText}</button>
                    {
                        this.state.showCalendar
                            ? <DateRangePicker
                                numberOfCalendars={1}
                                selectionType='range'
                                minimumDate={new Date()}
                                onSelect={this.handleDateSelect} />
                            : null
                    }
                    </div>
                    <div className='book_form_room'>
                    <h5>Rooms:</h5>
                    <select onChange={e => this.roomCountChange(e)}>
                        {
                            selectRooms.map((noOfRooms, index) =>
                                <option key={index} value={noOfRooms}>{noOfRooms}</option>
                            )
                        }
                    </select>
                    {/* 
                    {this.state.noOfRoomsError}
                    <input
                        type='number'
                        value={this.state.rooms_no ? this.state.rooms_no : 1}
                        min='1'
                        onChange={e => this.roomCountChange(e)} /> */}
                        </div>
                        <div className='book_form_guests'>
                    <h5>Guests:</h5>
                    {/* <input
                        type='number'
                        value={this.state.guests_no ? this.state.guests_no : this.props.room.max_capacity}
                        min='1'
                        onChange={e => this.guestCountChange(e)}
                    />
                    {this.state.noOfGuestsError} */}
                    <select onChange={e => this.guestCountChange(e)}>
                        {
                            selectGuests.map((noOfGuests, index) =>
                                <option key={index} value={noOfGuests}>{noOfGuests}</option>
                            )
                        }
                    </select>
                    </div>
                </div>
                <div className='room_price_container'>
                <div className='base_price'>
                    {
                        this.state.rooms_no > 1
                            ?
                            <React.Fragment>
                                <span>Base Price</span>
                                <span className='room_base_price'>
                                    Rs.{this.props.room.price_after_discount}
                                </span>
                                <span className='room_price_a_discount'>
                                    Rs.{this.props.room.price}
                                </span>
                            </React.Fragment>
                            : null

                    }
                    </div>
                    <span>Total Price</span>
                    <span className='room_total_price'>
                        Rs.{
                            this.state.rooms_no 
                            ? this.state.noOfDays
                                ? this.props.room.price_after_discount * this.state.rooms_no * this.state.noOfDays
                                : this.props.room.price_after_discount * this.state.rooms_no 
                            : this.props.room.price_after_discount}
                    </span>
                    <span className='room_price_a_discount'>
                        Rs.{this.state.rooms_no ? this.props.room.price * this.state.rooms_no : this.props.room.price}
                    </span>
                    <span className='room_discount_percent'>
                        {this.state.rooms_no ? this.props.room.discount * this.state.rooms_no : this.props.room.discount}% off
                    </span>
                    <span className='room_discount_text'>(inclusive of all taxes)</span>
                    {
                        this.state.noOfDays
                        ? <span className='for_one_day'>For {this.state.noOfDays} days</span>
                        : <span className='for_one_day'>For 1 Day</span>
                    }
                    <button
                        className='room_book_button'
                        onClick={this.submitRoomBooking}
                        disabled={this.state.noOfRoomsError || this.state.noOfGuestsError ? true : false}>Book Now</button>
                </div>
            </React.Fragment>
        )
    }
}
export default KhozContext.withAppContext(withRouter(BookRoom))