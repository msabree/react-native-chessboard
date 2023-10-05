import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Chessboard from 'react-native-chessboardjs';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Chessboard
          boardOrientation={'black'}
          onPieceDrop={(startingSquareName: string, squareName: string) => {
            'worklet';

            console.log(`onPieceDrop:=>${startingSquareName}-->${squareName}`);
            return true;
          }}
          onSquareClick={(squareName: string) => {
            'worklet';

            console.log(`onSquareClick:=>${squareName}`);
            return true;
          }}
          isDraggablePiece={(squareName: string) => {
            'worklet';

            console.log(`isDraggablePiece:=>${squareName}`);
            return true;
          }}
          customDarkSquareStyle={{backgroundColor: '#60688e'}}
          customLightSquareStyle={{backgroundColor: '#d3d7ec'}}
          customSquareStyles={{
            e3: {
              backgroundColor: '#b3b4c36e',
              height: 15,
              width: 15,
              borderRadius: 50,
            },
            e4: {
              backgroundColor: '#b3b4c36e',
              height: 15,
              width: 15,
              borderRadius: 50,
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  GestureHandlerRootView: {flex: 1},
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
