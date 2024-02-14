import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { getRepository } from './db/db.utils';
import { ActivityEntity } from './db/activity/activity.entity';
import { List, FAB } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { theme } from './theme';
import { ActivityRespository } from './db/activity/activity.repository';

type WorkoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'workout'
>;

type WrokoutPageProps = {
  route: RouteProp<RootStackParamList, 'workout'>;
  navigation: WorkoutNavigationProp;
};

export const Workout: React.FC<WrokoutPageProps> = ({ navigation, route }) => {
  const id = route.params.id;
  const [activities, setActivities] = useState<ActivityEntity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const activityEntities =
        await ActivityRespository.getAllActivitiesForAWorkout(id);

      console.log('Activities: ', activityEntities);

      setActivities(activityEntities);
    };

    const unsubscribe = navigation.addListener('focus', fetchData);

    fetchData();

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {activities.map(activity => (
        <List.Item
          key={activity.id}
          title={activity.name}
          description={`Type: ${activity.type}, Reps: ${activity.reps}`}
          onPress={() =>
            navigation.navigate('activity', {
              ...activity,
              workoutId: activity.workoutId,
            })
          }
        />
      ))}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('activity', { workoutId: id })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    backgroundColor: theme.colors.secondary,
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
