import React from 'react';
import {Dimensions} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  SharedValue,
} from 'react-native-reanimated';
import {FenPosition} from '../../types';
import {COLUMN_LENGTH, MARGIN} from '../../constants';
import {getPosition, getSquare, getImage} from '../../utils';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const ChessPiece = ({
  board,
  boardState,
  row,
  col,
  squareToHighlight,
  value,
}: ChessSquareProps) => {
  const trueIndex = row * COLUMN_LENGTH + col;

  const position = getPosition(trueIndex);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const isDragging = useSharedValue(false);
  const isHovered = useSharedValue(false);

  useAnimatedReaction(
    () => squareToHighlight.value,
    (square, oldSquare) => {
      console.log(square, oldSquare);
      if (oldSquare === -1) {
        isHovered.value = false;
        return;
      }
      if (square === trueIndex) {
        isHovered.value = true;
      } else {
        isHovered.value = false;
      }
    },
  );

  const panGesture = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      isDragging.value = true;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;

      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };

      const square = getSquare(center.x, center.y);

      squareToHighlight.value = square;
    },
    onFinish: (_event, _ctx) => {
      squareToHighlight.value = -1;
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const square = getSquare(center.x, center.y);
      const rowIndex = Math.floor(square / COLUMN_LENGTH);
      const colIndex = square % COLUMN_LENGTH;

      if (rowIndex > 7 || colIndex > 7 || rowIndex < 0 || colIndex < 0) {
        // spring back to starting position
        translateX.value = withSpring(position.x);
        translateY.value = withSpring(position.y);

        isDragging.value = false;
        isHovered.value = false;
        return;
      }

      const oldBoardState = JSON.parse(JSON.stringify(boardState.value));
      const newBoardState = JSON.parse(JSON.stringify(boardState.value));

      newBoardState[rowIndex][colIndex] = boardState.value[row][col];
      newBoardState[row][col] = '8';

      if (oldBoardState.flat().join('') !== newBoardState.flat().join('')) {
        boardState.value = newBoardState;

        // snap to new position
        translateX.value = withSpring(getPosition(square).x);
        translateY.value = withSpring(getPosition(square).y);

        isDragging.value = false;
        isHovered.value = false;
      } else {
        // spring back to starting position
        translateX.value = withSpring(position.x);
        translateY.value = withSpring(position.y);

        isDragging.value = false;
        isHovered.value = false;
      }
    },
  });

  const chessPiece = useAnimatedStyle(() => {
    const zIndex = isDragging.value ? 100 : 2;
    const scale = isDragging.value ? 1.2 : 1;
    console.log(isHovered.value, isDragging.value);
    const backgroundColor = isHovered.value ? 'green' : 'transparent';

    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      zIndex: zIndex,
      backgroundColor,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale},
      ],
    };
  });
  const chessSquare = useAnimatedStyle(() => {
    const borderColor = isDragging.value ? 'red' : 'black';
    const backgroundColor = isHovered.value ? 'green' : 'transparent';

    return {
      position: 'absolute',
      margin: MARGIN * 2,
      borderWidth: 1,
      borderColor,
      width: SIZE,
      height: SIZE,
      backgroundColor,
      transform: [{translateX: position.x}, {translateY: position.y}],
      zIndex: 1,
    };
  });

  return !isNaN(+value) ? (
    isHovered ? (
      <Animated.View key={board[row][col].square} style={chessSquare} />
    ) : (
      <></>
    )
  ) : (
    // <Animated.View key={board[row][col].square} style={chessSquare} />
    // <Animated.View key={board[row][col].square} style={chessSquare}>
    // {/* </Animated.View> */}
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.Image
          source={getImage(boardState.value[row][col])}
          style={chessPiece}
        />
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default ChessPiece;

type ChessSquareProps = {
  board: {square: string}[][];
  boardState: SharedValue<FenPosition[][]>;
  row: number;
  col: number;
  value: string;
  squareToHighlight: SharedValue<number>;
};
