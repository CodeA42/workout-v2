import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { RootStackParamList } from './App';
import { RouteProp } from '@react-navigation/native';
import { Activity } from './db/activity/activity.schema';
import { z } from 'zod';
import { ActivityRespository } from './db/activity/activity.repository';
import DateTimePicker from '@react-native-community/datetimepicker';

type ActivityNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'activity'
>;

type ActivityPageProps = {
  route: RouteProp<RootStackParamList, 'activity'>;
  navigation: ActivityNavigationProp;
};

export const ActivityPage: React.FC<ActivityPageProps> = ({
  route,
  navigation,
}) => {
  const [name, setName] = useState(route.params?.name || '');
  const [type, setType] = useState(route.params?.type || '');
  const [repsString, setReps] = useState(route.params?.reps?.toString() || '');
  const [workoutId] = useState(route.params.workoutId);
  const [id] = useState(route.params?.id || undefined);
  const [error, setError] = useState<z.ZodError<Activity> | string | undefined>(
    undefined,
  );
  const [duration, setDuration] = useState(
    route.params?.duration || new Date(),
  );

  const resetErrorState = () => setError(undefined);

  const handleSaveOrUpdateActivity = async () => {
    resetErrorState();
    const reps = parseInt(repsString, 10);

    if (id) {
      const updateResult = await ActivityRespository.updateExistingEctivity(
        id,
        {
          name,
          type,
          reps,
          workoutId,
        },
      );

      if (updateResult.success) return navigation.goBack();
      setError(updateResult.error);
    } else {
      resetErrorState();
      const reps = parseInt(repsString, 10);

      const result = await ActivityRespository.createActivity({
        name,
        type,
        reps,
        workoutId,
      });
      if (result.success) return navigation.goBack();
      setError(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputField}
        label="Activity  Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputField}
        label="Activity Type"
        value={type}
        onChangeText={setType}
      />
      <DateTimePicker
        value={duration}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, newDuration) => {
          setDuration(newDuration || duration);
        }}
      />
      {!!error && <Text style={styles.errorText}>{error.toString()}</Text>}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSaveOrUpdateActivity}>
          {id ? 'Update Activity' : 'Add Activity'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the start of the screen
    alignItems: 'stretch', // Stretch items to fill the width
    padding: 20, // Add padding around the container
    backgroundColor: '#F5FCFF', // Background color
  },
  inputField: {
    width: '100%', // Full width
    marginBottom: 15, // Space between input fields
  },
  buttonContainer: {
    flex: 1, // Take up all available space
    justifyContent: 'flex-end', // Align button to the bottom
    paddingBottom: 20, // Padding at the bottom
  },
  button: {
    alignSelf: 'center', // Center button horizontally
  },
  errorText: {
    color: 'red', // Error text color
  },
});
