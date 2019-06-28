import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';
import { getReservations, changeReservation } from '../../actions/host';

const DATE_HEIGHT = 100;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  date: {
    flexDirection: 'row',
    height: DATE_HEIGHT,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
    alignSelf: 'center',
  },
  details: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  reservation: {
    position: 'absolute',
    backgroundColor: '#03a598',
    padding: 20,
    borderRadius: 5,
    top: 0,
    left: 0,
    right: 10,
    flexDirection: 'row'
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  }
});

class CalendarModal extends React.Component {

  componentWillMount() {
    const selectedRoomId = this.props.navigation.state.params.item.id;
    this.props.getReservations(selectedRoomId);
  }

  onReservationPress(reservation) {
    const selectedRoomId = this.props.navigation.state.params.item.id;
    const changeReservation = this.props.changeReservation;
    Alert.alert(
      'APPROVE RESERVATION',
      'Do you want to approve this reservation?',
      [
        {text: 'Decline', onPress: () => changeReservation(selectedRoomId, reservation.id, false)},
        {text: 'Approve', onPress: () => changeReservation(selectedRoomId, reservation.id, true)},
      ]
    );
  }

  render() {
    if (!this.props.reservations) return null;

    const dates = moment.range(moment(), moment().add(1, 'months')).toArray('days');

    let reservations = {};
    this.props.reservations.forEach(reservation => {
      reservations[reservation.startDate] = reservation;
    });

    return (
      <ScrollView style={styles.container}>
        {dates.map((date, idx) => {
          const reservation =reservations[date.format('YYYY-MM-DD')];
          let reservationDuration = 0;
          if (reservation) {
            reservationDuration = moment.range(reservation.startDate, reservation.endDate).toArray('days').length;
          }

          return (
            <View style={styles.date} key={idx}>
              <Text style={styles.label}>{date.format('DD MMM')}</Text>
              <View style={styles.details}>
                {
                  reservation &&
                  <TouchableOpacity
                    style={[styles.reservation, { height: DATE_HEIGHT * reservationDuration }]}
                    onPress={ () => this.onReservationPress(reservation) }
                    disabled={reservation.status !== 'Waiting' }>
                    <View style={styles.info}>
                      <Text style={styles.name}>{reservation.guest.fullname}</Text>
                      <Text style={{ color: 'white' }}>${reservation.total}</Text>
                      <Text style={{ color: 'white' }}>{reservation.status.toUpperCase()}</Text>
                    </View>
                    <Image style={styles.avatar} source={{uri: reservation.guest.avatar}} />
                  </TouchableOpacity>
                }
              </View>
            </View>
          );
        })}
      </ScrollView>

    );
  }
}

const mapStateToProps = state => ({
  reservations: state.host.reservations,
});

const mapDispatchToProps = dispatch => ({
  getReservations: (roomId) => dispatch(getReservations(roomId)),
  changeReservation: (roomId, reservationId, approve) => dispatch(changeReservation(roomId, reservationId, approve)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarModal);
