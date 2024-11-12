// SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, LinkText } from '@/components/ui/link';
import { signUp } from '../api/authService';
import { saveUserData } from '../utils/secureStore';

export default function SignUpScreen() {
  const router = useRouter();
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const password = watch('password');

  const mutation = useMutation({
    mutationFn: async (data: FieldValues) => {
      const accessToken = await signUp(data.email, data.password);
      await saveUserData(accessToken, { email: data.email });
      return accessToken;
    },
    onSuccess: () => {
      router.replace('/');
    },
    onError: (err) => {
      setError(err.toString());
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setError('');
    mutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.text}>
        Create a free account or
        <Link>
          <LinkText style={styles.text} onPress={() => router.replace('/login')}> log in</LinkText>
        </Link>
      </Text>
      
      <Controller
        control={control}
        rules={{ 
          required: 'Email is required',
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Enter a valid email address',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            placeholderTextColor="#000"
          />
        )}
        name="email"
        defaultValue=""
      />
      {errors.email && typeof errors.email.message === 'string' && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#000"
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && typeof errors.password.message === 'string' && <Text style={styles.error}>{errors.password.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: 'Confirm password is required',
          validate: (value) => value === password || 'Passwords do not match',
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#000"
          />
        )}
        name="confirmPassword"
        defaultValue=""
      />
      {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <Button 
        title="Sign Up" 
        onPress={handleSubmit(onSubmit)} 
        disabled={mutation.status === 'pending'} 
      />

      {mutation.status === 'pending' && <ActivityIndicator size="small" color="#0000ff" />}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    width: '50%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
