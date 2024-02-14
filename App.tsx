import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './theme';
import { Home } from './Home';
import { Workout } from './Workout';
import { ActivityPage } from './Activity';

export type RootStackParamList = {
  workout: { id: number };
  activity: {
    id?: number;
    name?: string;
    type?: string;
    reps?: number;
    workoutId: number;
    duration?: Date;
  };
  home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={Home}></Stack.Screen>
          <Stack.Screen name="workout" component={Workout}></Stack.Screen>
          <Stack.Screen name="activity" component={ActivityPage}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
