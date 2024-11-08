import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LogoutButton from '@/components/LogoutButton';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C02727',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
        headerRight: () => <LogoutButton />,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name={'home'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="clubInfo"
        options={{
          title: 'Club',
          tabBarIcon: ({ color }) => (
            <FontAwesome name={'shield'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="clubLeaderboards"
        options={{
          title: 'Leaderboards',
          tabBarIcon: ({ color }) => (
            <FontAwesome name={'table'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="squad"
        options={{
          title: 'Squad',
          tabBarIcon: ({ color }) => (
            <FontAwesome name={'group'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: 'Search clubs',
          tabBarIcon: ({ color }) => (
            <FontAwesome name={'search'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>

  );
}
