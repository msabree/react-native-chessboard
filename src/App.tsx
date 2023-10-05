/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Chessboard from './components/Chessboard/Chessboard';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isBoardFlipped, _setIsBoardFlipped] = React.useState(true);
  const [position, _setPosition] = React.useState<string>(
    'rnbqkbnr/pppppppp/8/8/8/8/PRPPPPPP/PP1QKBNR',
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Chessboard
          isBoardFlipped={isBoardFlipped}
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
          position={position}
          customDarkSquareStyle={{backgroundColor: '#60688e'}}
          customLightSquareStyle={{backgroundColor: '#d3d7ec'}}
          customSquareStyles={
            new Map<string, object>([
              [
                'e3',
                {
                  backgroundColor: '#b3b4c36e',
                  opacity: 0.5,
                  height: 15,
                  width: 15,
                  borderRadius: 50,
                },
              ],
              [
                'e4',
                {
                  backgroundColor: '#b3b4c36e',
                  height: 15,
                  width: 15,
                  borderRadius: 50,
                },
              ],
            ])
          }
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
