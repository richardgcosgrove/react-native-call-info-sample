/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  AppState,
  Platform,
  StyleSheet,
  Text,
  View,
  Linking
} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import RNLocalNotifications from 'react-native-local-notifications';
import moment from 'moment';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const notificationMessage = 'do something on click';

type Props = {};
export default class App extends Component<Props> {
  state = {
    start: 0,
    end: 0,
    phoneState: 'idle',
    appState: AppState.currentState,
  };
  

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.state.start && this.state.phoneState !== 'idle' && Platform.OS === 'android') {
        this.setState({
          end: Date.now(),
          phoneState: 'idle'
        });
      }
    }
    this.setState({appState: nextAppState});
  };

  startListenerTapped() {
    this.callDetector = new CallDetectorManager((event)=> {
      // For iOS event will be either "Connected",
      // "Disconnected","Dialing" and "Incoming"
      
      // For Android event will be either "Offhook",
      // "Disconnected", "Incoming" or "Missed"
      
      if (event === 'Disconnected') {
      // Do something call got disconnected
        if (Platform.OS === 'ios') {
          this.setState({
            end: Date.now()
          });
        }
        this.callDetector && this.callDetector.dispose();
        this.callDetector = null;
      } 
      else if (event === 'Connected') {
      // Do something call got connected
      // This clause will only be executed for iOS
      } 
      else if (event === 'Incoming') {
      // Do something call got incoming
      }
      else if (event === 'Dialing') {
      // Do something call got dialing
      // This clause will only be executed for iOS
      }
      else if (event === 'Offhook') {
        //Device call state: Off-hook. 
        // At least one call exists that is dialing,
        // active, or on hold, 
        // and no calls are ringing or waiting.
        // This clause will only be executed for Android
      }
      else if (event === 'Missed') {
        // Do something call got missed
        // This clause will only be executed for Android
      }
    },
    false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
    ()=>{}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
    {
      title: 'Phone State Permission',
      message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
    } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
  )}

  callNumber() {
    this.setState({
      start: Date.now(),
      end: 0,
      phoneState: 'calling'
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text 
          style={{color: 'blue'}}
          onPress={() => {
            const date = moment(Date.now() + 5000).format('YYYY-MM-DD kk:mm:ss');
            RNLocalNotifications
              .createNotification(
                1,
                notificationMessage,
                date,
                'default'
              );
            RNLocalNotifications.not
            this.callNumber();
            const phone = '12345667890';
            const url = `${Platform.OS === 'ios' ? 'telprompt' : 'tel'}:${phone}`;
            if (Linking.canOpenURL(url)) {
              Linking.openURL(url).catch((err) => {});
            } else {
              alert('Phone not supported');
            }
          }}>
          Call Richard
        </Text>
        <Text>"Started {new Date(this.state.start).toString()}"</Text>
        <Text>"Ended {new Date(this.state.end).toString()}"</Text>
        <Text>"{this.state.end && this.state.start && Math.round((this.state.end - this.state.start)/1000) || 0} seconds have passed"</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
