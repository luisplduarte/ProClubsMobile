import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchClubByName } from '../../api/clubService';
import CardLayout from '@/components/cards/CardLayout';
import { SimplifiedClubInfo } from '../../types/ClubInfoTypes';

const { width: screenWidth } = Dimensions.get('window');

type FormData = {
  searchInput: string;
};

export default function Clubs() {
  const router = useRouter();
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
  useFocusEffect(
    React.useCallback(() => {
      reset();
      setInputText('');
    }, [reset])
  );

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
        <Controller
          control={control}
          name="searchInput"
          defaultValue=""
          rules={{ required: 'Must insert a value' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Input
                variant="rounded"
                size="md"
                style={{ borderColor: '#ffffff', margin: 16 }}
              >
                <InputField
                    placeholder="Enter club name..."
                    style={{ color: '#ffffff' }}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onBlur={onBlur}
                    value={value}
                />
                <InputSlot>
                    <TouchableOpacity onPress={handleSubmit(handleSearchClick)}>
                    <InputIcon as={() => <FontAwesome name="search" size={20} color="#ffffff" style={{ padding: 16 }} />} />
                    </TouchableOpacity>
                </InputSlot>
              </Input>
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
            </>
          )}
        />
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
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
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
});
