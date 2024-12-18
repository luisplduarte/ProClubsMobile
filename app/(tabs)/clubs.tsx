import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchClubByName } from '../../api/clubService';
import CardLayout from '@/components/cards/CardLayout';
import { SimplifiedClubInfo } from '../../types/ClubInfoTypes';
import Button from '@/components/Button';
import { ButtonTypes } from '@/types/ButtonTypes';
import { HStack } from '@/components/ui/hstack';

const { width: screenWidth } = Dimensions.get('window');

type FormData = {
  searchInput: string;
};

export default function Clubs() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [inputText, setInputText] = useState('');
  const { data: clubs, isLoading, isError } = useQuery<[SimplifiedClubInfo], Error>(
    {
      queryKey: ['clubSearch', inputText],
      queryFn: () => fetchClubByName(inputText),
      enabled: !!inputText,
    }
  );

  // Clears form state when screen gains focus
  //TODO: change this to a normal useEffect with clean up function
  // useFocusEffect( () => {
  //   reset();
  //   setInputText('');
  // }, [reset]);
  
  useEffect(() => {
    if (isFocused) {
      reset();
      setInputText('');
    }
  }, [isFocused]);

  const handleSearchClick: SubmitHandler<FormData> = (data) => {
    setInputText(data.searchInput);
  };

  const handleClubClicked = (clubId: string) => {
    router.push(`/clubDetails?id=${clubId}`);
  }

  if (isLoading) return <Text style={styles.text}>Loading...</Text>

  if (isError) return <Text style={styles.errorText}>Error fetching club data.</Text>

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Controller
            control={control}
            name="searchInput"
            defaultValue=""
            rules={{ required: 'Must insert a value' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Enter club name..."
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  placeholderTextColor="#000"
                />

                

                

                  
              </>
            )}
          />
          <Button label='' onPress={handleSubmit(handleSearchClick)} theme={ButtonTypes.SEARCH} style={{ height: 50, width: 50, margin: 0 }} />
        </View>

        {errors.searchInput && (
          <Text style={styles.errorText}>{errors.searchInput.message}</Text>
        )}

        {clubs && clubs.map((club) => {
          return (
            <CardLayout style={styles.card} onClick={() => handleClubClicked(club.clubId)} key={club.clubId}>
              <View>
                <Text style={styles.text}>{club.name}</Text>
              </View>
            </CardLayout>
          )})
        }  
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  vStackContainer: {
    width: '85%',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row', 
    marginBottom: 12,
  },
  card: {
    width: screenWidth / 2 - 16,
    backgroundColor: '#646466',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
  clubDetails: {
    fontSize: 16,
    color: '#ffffff',
  },
  input: {
    height: 50,
    width: '50%',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    marginRight: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});
