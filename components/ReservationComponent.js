import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { postComment, postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';


class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            startDate: new Date(),
            endDate: new Date(),
            title: '',
            timeZone: '',
            location: ''
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));

        Alert.alert(
            "Your Reservation OK?",
            `Number of Guests: ${this.state.guests}\n` +
            `Smoking?: ${this.state.smoking}\n` +
            `Date and Time: ${this.state.date}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.addReservationToCalendar(this.state.date);
                        this.resetForm();
                    }

                }
            ],
            { cancelable: false }
        );

    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async obtainCalendarPermission() {
        let calendarPermission = await Permissions.getAsync(Permissions.CALENDAR);
        if (calendarPermission.status !== 'granted') {
            calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
            if (calendarPermission.status !== 'granted') {
                Alert.alert('Permission not granted to show calendar');
            }
        }
        return calendarPermission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
    
        let msDate = Date.parse(date);
        let startDate = new Date(msDate);
        let endDate = new Date(msDate + 2 * 60 * 60 * 1000);
    
        await Calendar.createEventAsync(Calendar.DEFAULT, {
          title: 'Con Fusion Table Reservation',
          startDate: startDate,
          endDate: endDate,
          timeZone: 'Asia/Hong_Kong',
          location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
      }
// Other variation to Add someting in calendar and create calendar:

    //   async addReservationToCalendar(date) {
    //     await this.obtainCalendarPermission();
    //     const calendars = await Calendar.getCalendarsAsync();
    //     const newCalendar = {
    //         title: 'My-calendar',
    //         entityType: Calendar.EntityTypes.EVENT,
    //         color: '#c0ff33',
    //         sourceId:
    //           Platform.OS === 'ios'
    //             ? calendars.find(cal => cal.source && cal.source.name === 'iCloud').source.id
    //             : undefined,
    //         source:
    //           Platform.OS === 'android'
    //             ? {
    //               name: calendars.find(
    //                   cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
    //                 ).source.name,
    //               isLocalAccount: true,
    //             }
    //             : undefined,
    //         name: 'My-calendar',
    //         accessLevel: Calendar.CalendarAccessLevel.OWNER,
    //         ownerAccount:
    //           Platform.OS === 'android'
    //             ? calendars.find(cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER)
    //                 .ownerAccount
    //             : undefined,
    //       };
    //     let calendarId = await Calendar.createCalendarAsync(newCalendar);

    //     Calendar.createEventAsync(calendarId.toString(), {
    //         title: 'Con Fusion Table Reservation',
    //         startDate: new Date(Date.parse(date)),
    //         endDate: new Date(Date.parse(date) + (2*60*60*1000) ),
    //         timeZone: 'Asia/Hong_Kong',
    //         location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
    //     });
    // }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation="zoomInUp" duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor='#512DA8'
                            onValueChange={(value) => this.setState({ smoking: value })}>
                        </Switch>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{ flex: 2, marginRight: 20 }}
                            date={this.state.date}
                            format=''
                            mode="datetime"
                            placeholder="select date and Time"
                            minDate="2017-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys. 
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>

                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="Reserve"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        margin: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;