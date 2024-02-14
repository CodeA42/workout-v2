import { useEffect, useState } from 'react';
import { WorkoutEntity } from './db/workout/workout.entity';
import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Modal,
} from 'react-native';
import { Link } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Separator } from './Separator';
import { theme } from './theme';

import { Dimensions } from 'react-native';
import { WorkoutRepository } from './db/workout/workout.repository';

const { width } = Dimensions.get('window');
// Scale function to adjust text size
const scale = (size: number) => (width / 375) * size;

const ListHeader = () => (
  <View>
    <Text style={styles.headerText}>Available Workouts</Text>
    {/* You can add more components here if needed */}
  </View>
);

const ListFooter = () => (
  <View style={styles.footerContainer}>
    {/* This can be an empty view to act as padding or any additional content */}
  </View>
);

export const Home = () => {
  const [workoutsArray, setDataArr] = useState<WorkoutEntity[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const workouts = await WorkoutRepository.findAll();
      console.log('Workouts:', workouts);
      setDataArr(workouts);
    };

    fetchData();
  }, []);

  const handleAddItem = async () => {
    try {
      const savedWorkout = await WorkoutRepository.create({
        name: newWorkoutName,
      });
      setDataArr([...workoutsArray, savedWorkout]);
      setNewWorkoutName('');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = (index: number) => {
    try {
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const newDataArr = [...workoutsArray];
            const removedWorkoutId = newDataArr.splice(index, 1).map(e => e.id);

            await WorkoutRepository.delete(removedWorkoutId);
            setDataArr(newDataArr);
          },
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={workoutsArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <>
                  <View style={styles.listItem}>
                    <Link
                      style={styles.listItemText}
                      to={{ screen: 'workout', params: { id: item.id } }}
                      onLongPress={() => handleDeleteItem(index)}>
                      {item.name}
                    </Link>
                  </View>
                </>
              );
            }}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            ItemSeparatorComponent={Separator}
          />
          <StatusBar />
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Workout Name"
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="OK" onPress={handleAddItem} />
            </View>
          </View>
        </View>
      </Modal>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    padding: scale(10),
    marginVertical: scale(5),
    marginHorizontal: scale(10),
    backgroundColor: theme.colors.background,
  },
  listItemText: {
    fontSize: scale(16), // Scaled font size for text
    color: theme.colors.text,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.secondary,
  },

  modalView: {
    margin: 20,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textInput: {
    borderColor: theme.colors.border,
    color: theme.colors.text,
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    fontSize: scale(25),
    fontWeight: 'bold',
    padding: 10,
    color: theme.colors.text,
  },
  footerContainer: {
    padding: 20, // Adds padding at the end of the list
  },
});
