import React, {Component} from 'react';
import {ImageBackground, View,Dimensions, Image} from 'react-native';
import {styles} from './forecast.style';
import * as Progress from 'react-native-progress';
import {View as AnimatableView} from 'react-native-animatable';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import R, {Images} from '@res/R';
import LevelProgressStore from '@library/mobx/levelProgressStore';
import UserStore from '@library/mobx/userStore';
import {observer, inject} from 'mobx-react';
import SyncService from '@library/services/syncService';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';

import {wp, isTablet} from '@library/services/deviceService';
import NoNotchView from '@library/components/common/noNotchView';
import Navbar from '@library/components/home/navbar';
import OptionButton from '@library/components/home/optionButton';
import {strings} from '@library/services/i18nService';
import delayPromise from '@library/utils/delayPromise';

type Props = {
  navigation: any;
  levelProgressStore: LevelProgressStore;
  userStore: UserStore;
};

type State = {
  downloadProgress: number;
};

@inject('levelProgressStore')
@inject('userStore')
@observer
export default class Splash extends Component<Props, State> {
  container: any;
  progressBar: any;

  state = {
    downloadProgress: 0,
  };

  componentDidMount() {
    SyncService.hydrate(
      this.props.levelProgressStore,
      this.props.userStore,
      (progress: number) => {
        this.setState({...this.state, downloadProgress: progress});
      },
    ).then(async () => {
      await delayPromise(500);
      this.progressBar.animate('fadeOut', 100);
      await delayPromise(100);
      this.container.animate('fadeIn', 200);
    });
  }

  render() {
    return (
      <ImageBackground
        source={R.img(Images.mountain_bg)}
        style={styles.background}>
        <NoNotchView>
          <AnimatableView
            useNativeDriver
            ref={(ref) => {
              this.container = ref;
            }}
            style={styles.container}>
            <View style={styles.top}>
              <Navbar
                style={styles.navBar}
                onCoinsTap={() => {
                  this.props.navigation.navigate('AddCoins', {noCoins: false});
                }}
                coins={this.props.userStore.coins}
              />
            </View>
            <View>
  <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>
           
          </AnimatableView>
        </NoNotchView>
        <AnimatableView
          useNativeDriver
          ref={(ref) => {
            this.progressBar = ref;
          }}
          style={styles.progressBar}
          pointerEvents="none">
          <Progress.Bar
            progress={this.state.downloadProgress}
            width={isTablet() ? wp('40%') : wp('70%')}
            color={'black'}
          />
        </AnimatableView>
      </ImageBackground>
    );
  }
}
