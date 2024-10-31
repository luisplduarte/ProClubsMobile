import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ReactNode } from 'react';
import { Box } from "@/components/ui/box"

type Props = {
    headerText: string;
    children: ReactNode;
};

export default function CardLayout({ children, headerText }: Props) {
  return (
    <Box style={styles.chartContainer}>
      <Text style={styles.chartHeaderText}>{headerText}</Text>
      {children}
    </Box>
  )
}

const styles = StyleSheet.create({
    chartContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#646466',
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ffffff'
    },
    chartHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        paddingBottom: 8,
    },
});
