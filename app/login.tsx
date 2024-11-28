import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, LinkText } from '@/components/ui/link';
import { logIn } from '../api/authService';
import { saveUserData } from '../utils/secureStore';

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: FieldValues) => {
      const accessToken = await logIn(data.email, data.password);
      await saveUserData(accessToken, { email: data.email });
      return accessToken;
    },
    onSuccess: () => {
      router.replace('/');
    },
    onError: () => {
      setError("Login failed. Please check your credentials.");
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setError('');
    mutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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

      <Button title="Login" onPress={handleSubmit(onSubmit)} disabled={mutation.status === 'pending'} />

      {mutation.status === 'pending' && <ActivityIndicator size="small" color="#0000ff" />}

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.text}>
        Not a member?
        <Link>
          <LinkText style={styles.text} onPress={() => router.replace('/signup')}> Sign up now</LinkText>
        </Link>
      </Text>
      
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
